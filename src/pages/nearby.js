import React, { useEffect, useState } from "react";
import mapboxgl from "mapbox-gl/dist/mapbox-gl.js";
import style from "../data/mapstyle.json";
import _ from "lodash";

import { Card, CardContent, CardHeader } from "@material-ui/core";
import Helpers from "../helpers";
import StopTransfers from "../components/StopTransfers";
import Layout from "../components/Layout";
import TopNav from "../components/TopNav";

const NearbyMap = ({ stops, routes, coords, radius }) => {
  let [theMap, setMap] = useState(null);

  console.log(routes)

  let shapesFeatures = routes.map(sh => {
    return {
      properties: { ...sh.route },
      ...sh.geojson
    }
  })

  // console.log(_.flatten(routes.map(r => r.shapes)))
  // let shapesFeatures = _.flatten(routes.map(r => r.shapes)).map(sh => {
  //   return {
  //     properties: { ...sh.routeByFeedIndexAndRouteId },
  //     ...sh.geojson
  //   };
  // });

  console.log(shapesFeatures)

  useEffect(() => {
    mapboxgl.accessToken =
      "pk.eyJ1IjoiY2l0eW9mZGV0cm9pdCIsImEiOiJjaXZvOWhnM3QwMTQzMnRtdWhyYnk5dTFyIn0.FZMFi0-hvA60KYnI-KivWg";

    let map = new mapboxgl.Map({
      container: "map",
      style: style,
      center: coords,
      zoom: 15.75, // starting zoom,
      attributionControl: false
    });

    map.on("load", e => {
      map.addLayer({
        id: "nearby-stop-icon-bg",
        type: "circle",
        source: "nearby",
        paint: {
          "circle-radius": 8,
          "circle-color": "rgba(255, 255, 255, 1)",
          "circle-stroke-color": "rgba(0, 0, 0, 0.95)",
          "circle-stroke-width": 1.5
        }
      });
      map.addLayer({
        id: "nearby-stop-icon",
        type: "symbol",
        source: "nearby",
        layout: {
          "icon-image": "bus-stop-15",
          "icon-size": 0.5,
          "icon-allow-overlap": true
        },
        paint: {
          "icon-opacity": 0.75
        }
      });
    });

    map.resize();

    setMap(map);
  }, []);

  // useEffect(() => {
  //   if (theMap) {
  //     theMap.getSource("nearby").setData({
  //       type: "FeatureCollection",
  //       features: stops.map(s => {
  //         return {
  //           type: "Feature",
  //           geometry: {
  //             type: "Point",
  //             coordinates: [s.stopLon, s.stopLat]
  //           },
  //           properties: {
  //             ...s
  //           }
  //         };
  //       })
  //     });

  //     theMap.resize();
  //   }
  // }, [stops]);

  return <div id="map" />;
};

const FeaturesNearLocation = ({
  coords,
  radius,
  allStops,
  allShapes,
  intersection
}) => {
  let [stops, setStops] = useState([]);

  useEffect(() => {
    fetch(
      `${
        Helpers.endpoint
      }/stops-for-location.json?key=BETA&radius=${radius}&lat=${
        coords[1]
      }&lon=${coords[0]}`
    )
      .then(r => r.json())
      .then(d => {
        let matchedStops = [];
        d.data.list.forEach(l => {
          matchedStops.push(
            _.merge(l, allStops.filter(as => as.stopId === l.id.slice(5))[0])
          );
        });
        setStops(matchedStops);
      });
  }, []);

  return (
    <>
      <Card style={{ gridArea: "title" }}>
        <CardHeader
          // avatar={<BusStop />}
          title={`5 minute walk`}
          titleTypographyProps={{ variant: "h6" }}
          subheader={intersection}
          subheaderTypographyProps={{ variant: "subtitle2" }}
        />
      </Card>
      <NearbyMap
        stops={stops}
        routes={allShapes}
        coords={coords}
        radius={radius}
      />
      <div style={{ gridArea: "details" }}>
        <StopTransfers xfers={stops} title={`Routes and stops near you`} />
      </div>
    </>
  );
};

const NearbyPage = ({ data }) => {
  let [coords, setCoords] = useState(null);
  let [location, setLocation] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(pos => {
      fetch(
        `${Helpers.geocoder}?location=${pos.coords.longitude}%2C${
          pos.coords.latitude
        }&returnIntersection=true&f=pjson`
      )
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
      {coords ? (
        <FeaturesNearLocation
          allStops={data.postgres.stops}
          allShapes={data.postgres.shapes}
          coords={coords}
          intersection={location}
          radius={400}
        />
      ) : (
        ``
      )}
    </Layout>
  );
};

export const query = graphql`
  {
    postgres {
      shapes: allRouteShapesList(condition: { feedIndex: 5 }) {
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
      stops: allStopsList(condition: { feedIndex: 5 }) {
        stopId
        stopDesc
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
