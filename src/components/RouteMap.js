import React, { useState, useEffect } from "react";
import _ from 'lodash';
import { navigate } from "@reach/router";
import mapboxgl from "mapbox-gl/dist/mapbox-gl.js";
import bbox from '@turf/bbox';
import { Card, CardHeader, CardContent } from "@material-ui/core";
import style from "../data/mapstyle.json";
import RouteBadge from "./RouteBadge";
import { DirectionsBus } from "@material-ui/icons";
import routes from '../data/routes'

const RouteMap = ({ shapes, longTrips, color, shortName }) => {
  
  let rd = routes.filter(rd => rd.number === parseInt(shortName))[0];
  
  // make some GeoJSON features for the map
  let shapesFeatures = shapes.map(sh => {
    return {
      ...sh.geojson,
      properties: {
        direction: sh.direction,
        directionId: sh.dir,
        number: shortName,
        color: "#" + color
      }
    };
  });
  
  let bounds = bbox({'type': "FeatureCollection", features: shapesFeatures})

  let stopsFeatures = [];

  longTrips.forEach(lt => {
    lt.stopTimes.forEach(st => {
      let stopFeature = st.stop.geojson;
      stopFeature.properties.timepoint = st.timepoint ? `1` : `0`;
      stopFeature.properties.directionId = lt.directionId;
      stopFeature.properties.direction = rd['directions'][lt.directionId]
      stopsFeatures.push(stopFeature);
    });
  });

  let randomTimepoint = _.sample(stopsFeatures.filter(sf => sf.properties.timepoint === '1'))

  console.log(randomTimepoint)

  let [theMap, setMap] = useState(null);

  useEffect(() => {
    mapboxgl.accessToken = "pk.eyJ1IjoiY2l0eW9mZGV0cm9pdCIsImEiOiJjaXZvOWhnM3QwMTQzMnRtdWhyYnk5dTFyIn0.FZMFi0-hvA60KYnI-KivWg";

    let map = new mapboxgl.Map({
      container: "map",
      style: style,
      center: randomTimepoint.geometry.coordinates,
      zoom: 12.75, // starting zoom,
      attributionControl: false
    });

    map.on("load", e => {

      map.fitBounds(bounds, {
        padding: 30
      })

      map.addSource("routes", {
        type: "geojson",
        data: { type: "FeatureCollection", features: shapesFeatures }
      });

      map.addSource("stops", {
        type: "geojson",
        data: { type: "FeatureCollection", features: stopsFeatures }
      });

      map.addLayer({
        id: "stop-points",
        type: "circle",
        source: "stops",
        interactive: true,
        filter: ["==", "$type", "Point"],
        layout: {},
        paint: {
          "circle-color": {
            type: 'categorical',
            property: 'timepoint',
            stops: [['0', 'white'], ['1', '#222']]
          },
          "circle-stroke-color": {
            type: 'categorical',
            property: 'timepoint',
            stops: [['0', '#222'], ['1', 'black']]
          },
          "circle-stroke-width": {
            stops: [[13, 1], [19, 3]]
          },
          "circle-stroke-opacity": {
            stops: [[13, 0], [13.1, 0.1], [13.2, 0.8]]
          },
          "circle-opacity": {
            stops: [[13, 0], [13.1, 0.1], [13.2, 0.8]]
          },
          "circle-radius": {
            stops: [[13, 1.5], [19, 12]]
          }
        }
      });

      map.addLayer({
        id: "stop-labels",
        type: "symbol",
        source: "stops",
        minzoom: 15,
        layout: {
          "text-line-height": 1,
          "text-size": {
            base: 1,
            stops: [[15, 7], [18, 15]]
          },
          "text-allow-overlap": true,
          "text-ignore-placement": true,
          "text-font": ["Gibson Detroit SemiBold", "Arial Unicode MS Regular"],
          "text-justify": 'center',
          "text-padding": 0,
          "text-offset": {
            base: 1,
            type: "categorical",
            property: "direction",
            stops: [["eastbound", [0.5, 0.5]], ["westbound", [-0.5, -0.5]], ["northbound", [0.5, -0.5]], ["southbound", [-0.5, 0.5]]]
          },
          "text-anchor": {
            base: 1,
            type: "categorical",
            property: "direction",
            stops: [["southbound", "top-right"], ["northbound", "bottom-left"], ["eastbound", "top-left"], ["westbound", "bottom-right"]],
            default: "center"
          },
          "text-field": ['get', 'stop_desc'],
          "text-letter-spacing": -0.01,
          "text-max-width": 5
        },
        paint: {
          "text-translate": [0, 0],
          "text-halo-color": "hsl(0, 0%, 100%)",
          "text-halo-width": 1,
          "text-color": "hsl(0, 0%, 0%)",
          "text-opacity": {
            base: 1,
            stops: [[15, 0], [15.1, 0.1], [15.2, 1]]
          }
        }
      });

      map.addLayer({
        id: "timepoint-points",
        type: "circle",
        source: "stops",
        interactive: true,
        filter: ["==", "timepoint", "1"],
        maxzoom: 15,
        layout: {},
        paint: {
          "circle-color": "#444",
          "circle-stroke-color": "black",
          "circle-stroke-width": {
            stops: [[8, 1], [19, 3]]
          },
          "circle-stroke-opacity": 1,
          "circle-opacity": 1,
          "circle-radius": {
            stops: [[8, 0.5], [10.5, 2.5], [15, 4]]
          }
        }
      });

      map.addLayer({
        id: "timepoint-labels",
        type: "symbol",
        source: "stops",
        filter: ["==", "timepoint", "1"],
        maxzoom: 15,
        layout: {
          "text-line-height": 0.8,
          "text-size": {
            base: 1,
            stops: [[6, 6], [11, 10], [13, 14]]
          },
          "text-allow-overlap": false,
          "text-padding": 10,
          "text-offset": [0, 1.5],
          "text-font": ["Gibson Detroit SemiBold", "Arial Unicode MS Regular"],
          "text-padding": 0,
          visibility: "visible",
          "text-field": "{stop_name}",
          "text-max-width": 5
        },
        paint: {
          "text-translate": [0, 0],
          "text-halo-color": "white",
          "text-halo-width": 2,
          "text-opacity": {
            stops: [[9.5, 0], [9.51, 0.1], [9.6, 1], [14.9, 1], [15, 0]]
          },
          "text-color": "black"
        }
      });

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
            // "line-color": "red",
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
            // "line-color": "red",
            "line-color": ["get", "color"],
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

      map.on('click', 'stop-points', e => {
        let stop = map.queryRenderedFeatures(e.point, {
          layers: ['stop-points']
        })[0]

        navigate(`/stop/${stop.properties.stop_id}`)
      })

      map.on('mouseover', 'stop-points', e => {
        map.getCanvas().style.cursor = 'pointer'
      })

      map.on('mouseleave', 'stop-points', e => {
        map.getCanvas().style.cursor = ''
      })
    });

    setMap(map);
  }, []);

  return (
    <Card className="routeMap" elevation={0}>
      <CardContent style={{ padding: 0, margin: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <CardHeader
            title={<RouteBadge id={shortName} showName />}
            subheader={<div style={{ display: "flex", alignItems: "center" }}>Zoom in for all stops and real-time bus info.</div>}
          />
          <div
            style={{ display: "grid", gridTemplate: "repeat(2, 1fr) / 1fr 1fr", gridGap: 10, marginRight: ".5em", background: "rgba(0,0,0,0.05)", padding: 10 }}
          >
            <div style={{ display: "flex", alignItems: "center", alignContent: "center", fontWeight: 700 }}>
              <span style={{ textAlign: "center", textSize: "1.5em" }} />
            </div>
            <div style={{ display: "flex", alignItems: "center", alignContent: "space-between" }}>
              <DirectionsBus style={{ height: 17, width: 17, padding: 1, borderRadius: 9999, color: "white", background: "rgba(0,0,0,1)" }} />
              <span style={{ marginLeft: ".5em" }}>Active buses</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", alignContent: "space-between" }}>
              <span style={{ borderRadius: 9999, border: "3px solid black", width: 13, height: 13, background: "#000" }} />
              <span style={{ marginLeft: ".5em", textAlign: "center" }}>Major stops</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", alignContent: "space-between" }}>
              <span style={{ borderRadius: 9999, border: `3px solid ${color}`, width: 13, height: 13, background: "#fff" }} />
              <span style={{ marginLeft: ".5em" }}>Local stops</span>
            </div>
          </div>
        </div>
        <div id="map" style={{ height: "60vh", width: "100%" }} />
      </CardContent>
    </Card>
  );
};

export default RouteMap;
