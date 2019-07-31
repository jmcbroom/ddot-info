import React, { useEffect, useState } from "react";
import mapboxgl from "mapbox-gl/dist/mapbox-gl.js";
import style from "../data/mapstyle.json";
import _ from "lodash";

import { Card, CardContent, CardHeader } from "@material-ui/core";
import Helpers from "../helpers";
import RouteLink from "./RouteLink.js";
import StopCard from "./StopCard";
import routes from "../data/routes";

const NearbyList = ({ refs, stops }) => {
  let nearbyRoutes = refs.routes.map(r => parseInt(r.shortName));

  return (
    <div>
      {nearbyRoutes.map(r => (
        <RouteLink id={r} />
      ))}
      {stops.map(s => {
        let routeNumbers = s.routeIds.map(rid => parseInt(rid.slice(5))).map(rn => _.filter(routes, rd => rn === rd.rt_id)[0].number);
        console.log(routeNumbers);
        return <StopCard stopId={s.id.slice(5)} stopDesc={s.name} stopRoutes={routeNumbers} />;
      })}
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

    map.on("load");

    setMap(map);
  }, []);

  return <div id="map" style={{ height: "60vh", width: "100%" }} />;
};

const FeaturesNearLocation = ({ coords, radius }) => {
  let [refs, setRefs] = useState(null);
  let [stops, setStops] = useState([]);

  useEffect(() => {
    fetch(`${Helpers.endpoint}/stops-for-location.json?key=BETA&radius=${radius}&lat=${coords[1]}&lon=${coords[0]}`)
      .then(r => r.json())
      .then(d => {
        setRefs(d.data.references);
        setStops(d.data.list);
      });
  }, []);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gridGap: 10 }}>
      {refs ? (
        <>
          <NearbyMap refs={refs} stops={stops} coords={coords} radius={250} />
          <NearbyList refs={refs} stops={stops} />
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
