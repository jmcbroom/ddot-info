import { Card, CardActions, CardHeader, TextField } from "@material-ui/core";
import { navigate } from "@reach/router";
import bbox from "@turf/bbox";
import { graphql } from "gatsby";
import _ from "lodash";
import mapboxgl from "mapbox-gl/dist/mapbox-gl.js";
import React, { useEffect, useState } from "react";

import Layout from "../components/Layout";
import StopTransfers from "../components/StopTransfers";
import TopNav from "../components/TopNav";
import style from "../data/mapstyle.json";
import Helpers from "../helpers";

const NearbyMap = ({ stops, routes, coords, radius }) => {
  let [theMap, setMap] = useState(null);

  let shapesFeatures = routes
    .map(sh => {
      return {
        properties: { ...sh.route },
        ...sh.geojson
      };
    })
    .sort((a, b) => b.properties.short - a.properties.short);

  let routeXfers = _(stops.map(x => x.routes))
    .uniqWith(_.isEqual)
    .flatten()
    .groupBy("short")
    .value();

  let filteredShapes = shapesFeatures.filter(sf => Object.keys(routeXfers).indexOf(sf.properties.short) > -1);

  useEffect(() => {
    mapboxgl.accessToken = "pk.eyJ1IjoiY2l0eW9mZGV0cm9pdCIsImEiOiJjaXZvOWhnM3QwMTQzMnRtdWhyYnk5dTFyIn0.FZMFi0-hvA60KYnI-KivWg";

    let map = new mapboxgl.Map({
      container: "map",
      style: style,
      center: coords,
      zoom: 15.75, // starting zoom,
      attributionControl: false
    });

    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "bottom-left");

    map.on("load", e => {
      map.addSource("geolocated", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: coords
              }
            }
          ]
        }
      });

      map.addLayer({
        id: "geolocated-marker",
        type: "symbol",
        source: "geolocated",
        layout: {
          "icon-image": "geolocated",
          "icon-size": 1.25
        }
      });

      map.addLayer({
        id: "nearby-stop-icon-bg",
        type: "circle",
        source: "nearby",
        paint: {
          "circle-radius": {
            base: 1,
            stops: [[13, 2], [15, 8], [19, 10]]
          },
          "circle-color": "rgba(255, 255, 255, 1)",
          "circle-stroke-color": "rgba(0, 0, 0, 0.95)",
          "circle-stroke-width": 1.5
        }
      });
      map.addLayer({
        id: "nearby-stop-icon",
        type: "symbol",
        source: "nearby",
        minzoom: 15,
        layout: {
          "icon-image": "bus-stop-15",
          "icon-size": 0.5,
          "icon-allow-overlap": true
        },
        paint: {
          "icon-opacity": 0.75
        }
      });
      map.addLayer(
        {
          id: "ddot-routes-highlight",
          type: "line",
          source: "routes",
          interactive: "true",
          filter: ["==", "routeShortName", ""],
          layout: {
            visibility: "visible",
            "line-cap": "round",
            "line-join": "round"
          },
          paint: {
            "line-color": ["concat", "#", ["get", "routeColor"]],
            "line-width": {
              base: 1,
              stops: [[9, 5.5], [16, 15], [22, 90]]
            },
            "line-offset": 0,
            "line-opacity": 0.4
          }
        },
        "road-label-small"
      );

      map.addLayer(
        {
          id: "ddot-routes-case",
          type: "line",
          source: "routes",
          interactive: "true",
          layout: {
            visibility: "visible",
            "line-cap": "round",
            "line-join": "round"
          },
          paint: {
            "line-color": "black",
            "line-width": {
              base: 1,
              stops: [[9, 1.5], [16, 8], [22, 69]]
            },
            "line-offset": 0,
            "line-opacity": 1
          }
        },
        "road-label-small"
      );

      map.addLayer(
        {
          id: "ddot-routes",
          type: "line",
          source: "routes",
          interactive: "true",
          layout: {
            visibility: "visible",
            "line-cap": "round",
            "line-join": "round"
          },
          paint: {
            "line-color": ["concat", "#", ["get", "routeColor"]],
            "line-width": {
              base: 1,
              stops: [[9, 1], [16, 6], [22, 60]]
            },
            "line-offset": 0,
            "line-opacity": 1
          }
        },
        "road-label-small"
      );

      map.on("click", "nearby-stop-icon-bg", e => {
        let stop = map.queryRenderedFeatures(e.point, {
          layers: ["nearby-stop-icon-bg"]
        })[0];

        navigate(`/stop/${stop.properties.stopId}`);
      });

      map.on("mouseover", "nearby-stop-icon-bg", () => {
        map.getCanvas().style.cursor = "pointer";
      });

      map.on("mouseleave", "nearby-stop-icon-bg", () => {
        map.getCanvas().style.cursor = "";
      });
    });

    map.resize();

    setMap(map);
  }, []);

  useEffect(() => {
    if (theMap) {
      theMap.getSource("nearby").setData({
        type: "FeatureCollection",
        features: stops.map(s => {
          return {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [s.stopLon, s.stopLat]
            },
            properties: {
              ...s
            }
          };
        })
      });

      theMap.getSource("routes").setData({ type: "FeatureCollection", features: filteredShapes });

      let stopBounds = bbox({
        type: "FeatureCollection",
        features: stops.map(s => {
          return {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [s.stopLon, s.stopLat]
            },
            properties: {
              ...s
            }
          };
        })
      });

      theMap.fitBounds(stopBounds, {
        padding: 40
      });

      theMap.resize();
    }
  }, [stops]);

  return <div id="map" />;
};

const FeaturesNearLocation = ({ coords, allStops, allShapes, intersection }) => {
  let [stops, setStops] = useState([]);

  const radii = {
    300: "5 minute walk",
    600: "10 minute walk",
    1200: "20 minute walk"
  };

  let [radius, setRadius] = useState(300);

  useEffect(() => {
    if (coords) {
      fetch(`${Helpers.endpoint}/stops-for-location.json?key=BETA&radius=${radius}&lat=${coords[1]}&lon=${coords[0]}`)
        .then(r => r.json())
        .then(d => {
          let matchedStops = [];
          d.data.list.forEach(l => {
            matchedStops.push(_.merge(l, allStops.filter(as => as.stopId === l.id.slice(5))[0]));
          });
          setStops(matchedStops);
        });
    } else {
      return;
    }
  }, [coords, radius]);

  return (
    <>
      <Card style={{ gridArea: "title" }}>
        <CardHeader
          // avatar={<BusStop />}
          subheader={
            <>
              <TextField select value={radius} onChange={e => setRadius(e.target.value)}>
                {Object.keys(radii).map(n => (
                  <option key={n} value={n}>
                    {radii[n]}
                  </option>
                ))}
              </TextField>{" "}
              from {coords ? intersection : `?`}
            </>
          }
          subheaderTypographyProps={{ variant: "h6" }}
        />
        <CardActions></CardActions>
      </Card>
      {coords && <NearbyMap stops={stops} routes={allShapes} coords={coords} radius={radius} />}
      <div style={{ gridArea: "details" }}>
        <StopTransfers coords={coords} xfers={coords ? stops : []} title={`Routes and stops near you`} />
      </div>
    </>
  );
};

const NearbyPage = ({ data }) => {
  let [coords, setCoords] = useState(null);
  let [location, setLocation] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(pos => {
      fetch(`${Helpers.geocoder}?location=${pos.coords.longitude}%2C${pos.coords.latitude}&returnIntersection=true&f=pjson`)
        .then(r => r.json())
        .then(d => {
          setCoords([pos.coords.longitude, pos.coords.latitude]);
          setLocation(d.address.Street);
        });
    });
  }, []);

  return (
    <Layout className="pageGrid">
      <TopNav />
      <FeaturesNearLocation allStops={data.postgres.stops} allShapes={data.postgres.shapes} coords={coords} intersection={location} radius={400} />
    </Layout>
  );
};

export const query = graphql`
  {
    postgres {
      shapes: allRouteShapesList(condition: { feedIndex: 7 }) {
        dir
        direction
        geojson: simpleGeojson
        route: routeByFeedIndexAndRouteId {
          agencyId
          short: routeShortName
          long: routeLongName
          routeDesc
          routeType
          routeUrl
          routeColor
          routeTextColor
          routeSortOrder
        }
      }
      stops: allStopsList(condition: { feedIndex: 7 }) {
        stopId
        stopName
        stopLat
        stopLon
        routes: routeShapesList {
          short
          dir
          direction
        }
      }
    }
  }
`;

export default NearbyPage;
