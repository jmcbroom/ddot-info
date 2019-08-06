import React, { useEffect, useState } from "react";
import mapboxgl from "mapbox-gl/dist/mapbox-gl.js";
import style from "../data/mapstyle.json";
import _ from "lodash";

import { Card, CardContent, CardHeader } from "@material-ui/core";
import Helpers from "../helpers";
import RouteLink from "./RouteLink.js";
import StopCard from "./StopCard";
import StopTransfers from "./StopTransfers";
import routes from "../data/routes";

const NearbyMap = ({ stops, coords, radius }) => {
  let [theMap, setMap] = useState(null);

  console.log(stops);

  useEffect(() => {
    mapboxgl.accessToken = "pk.eyJ1IjoiY2l0eW9mZGV0cm9pdCIsImEiOiJjaXZvOWhnM3QwMTQzMnRtdWhyYnk5dTFyIn0.FZMFi0-hvA60KYnI-KivWg";

    let map = new mapboxgl.Map({
      container: "map",
      style: style,
      center: coords,
      zoom: 15.75, // starting zoom,
      attributionControl: false
    });

    map.on("load", e => {

      console.log(stops.map(s => {
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
      }))
      map.addSource("nearby", {
        type: "geojson",
        data: {
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
        }
      });

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
          "icon-size": 0.5
        },
        paint: {
          "icon-opacity": 0.75
        }
      });
    });

    setMap(map);
  }, []);

  return <div id="map" style={{ height: "50vh", width: "100%" }} />;
};

const FeaturesNearLocation = ({ coords, radius, allStops }) => {
  let [stops, setStops] = useState([]);

  useEffect(() => {
    fetch(`${Helpers.endpoint}/stops-for-location.json?key=BETA&radius=${radius}&lat=${coords[1]}&lon=${coords[0]}`)
      .then(r => r.json())
      .then(d => {
        let matchedStops = [];
        d.data.list.forEach(l => {
          matchedStops.push(_.merge(l, allStops.filter(as => as.stopId === l.id.slice(5))[0]));
        });
        setStops(matchedStops);
      });
  }, []);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gridGap: 10 }}>
      <>
        <NearbyMap stops={stops} coords={coords} radius={radius} />
        <StopTransfers xfers={stops} />
        {/* <NearbyList refs={refs} stops={stops} /> */}
      </>
    </div>
  );
};

const Nearby = ({ allStops }) => {
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
    <Card>
      <CardHeader title={`5 minute walk`} subheader={location} />
      <CardContent>{coords ? <FeaturesNearLocation allStops={allStops} coords={coords} radius={1000} /> : ``}</CardContent>
    </Card>
  );
};

export default Nearby;
