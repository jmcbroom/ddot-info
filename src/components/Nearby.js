import React, { useEffect, useState } from "react";
import mapboxgl from "mapbox-gl/dist/mapbox-gl.js";
import style from "../data/mapstyle.json";

import { Card, CardContent, CardHeader } from "@material-ui/core";
import Helpers from "../helpers";
import RouteLink from "./RouteLink.js";

const NearbyList = ({ refs }) => {
  console.log(refs);

  let routes = refs.routes.map(r => parseInt(r.shortName));

  return (
    <div>
      {routes.map(r => (
        <RouteLink id={r} />
      ))}
    </div>
  );
};

const NearbyMap = ({ stops, coords, radius }) => {
  let [theMap, setMap] = useState(null);

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
      map.addSource("routes", {
        type: "geojson",
        data: {}
      });
      console.log(e);
    });

    setMap(map);
  }, []);

  return <div id="map" style={{ height: "60vh", width: "100%" }} />;
};

const FeaturesNearLocation = ({ coords, radius }) => {
  let [refs, setRefs] = useState(null);

  useEffect(() => {
    fetch(`${Helpers.endpoint}/stops-for-location.json?key=BETA&radius=${radius}&lat=${coords[1]}&lon=${coords[0]}`)
      .then(r => r.json())
      .then(d => {
        setRefs(d.data.references);
        console.log(d);
      });
  }, []);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gridGap: 10 }}>
      {refs ? (
        <>
          <NearbyMap refs={refs} coords={coords} radius={250} />
          <NearbyList refs={refs} />
        </>
      ) : (
        ``
      )}
    </div>
  );
};

const Nearby = () => {
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
      <CardContent>{coords ? <FeaturesNearLocation coords={coords} radius={250} /> : ``}</CardContent>
    </Card>
  );
};

export default Nearby;
