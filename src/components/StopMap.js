import { Card, CardHeader } from "@material-ui/core";
import { navigate } from "@reach/router";
import bbox from "@turf/bbox";
import nearestPointOnLine from "@turf/nearest-point-on-line";
import mapboxgl from "mapbox-gl/dist/mapbox-gl.js";
import React, { useEffect, useState } from "react";

import style from "../data/mapstyle.json";
import BusStop from "./BusStop.js";

const StopMap = ({ name, id, coords, stop, shapes, currentRoute, currentBus, nearby }) => {
  // make some GeoJSON features for the map
  let shapesFeatures = shapes
    .map(sh => {
      return {
        properties: { ...sh.routeByFeedIndexAndRouteId },
        ...sh.geojson
      };
    })
    .sort((a, b) => {
      return parseInt(b.properties.routeShortName) - parseInt(a.properties.routeShortName);
    });

  let nearbyFeatures = nearby.map(nb => {
    return {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [nb.stopLon, nb.stopLat]
      },
      properties: {
        stopId: nb.stopId,
        stopName: nb.stopName
      }
    };
  });

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

    map.addControl(new mapboxgl.NavigationControl());

    map.on("load", e => {
      // nearby stops

      map.getSource("nearby").setData({ type: "FeatureCollection", features: nearbyFeatures });

      map.addLayer({
        id: "nearby-stop-icon-bg",
        type: "circle",
        source: "nearby",
        minzoom: 15,
        paint: {
          "circle-radius": 10,
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
          "icon-size": 0.5
        },
        paint: {
          "icon-opacity": 0.75
        }
      });

      // the stop
      map.addSource("this-stop", {
        type: "geojson",
        data: { type: "FeatureCollection", features: [stop] }
      });
      map.addLayer({
        id: "this-stop-icon-bg",
        type: "circle",
        source: "this-stop",
        paint: {
          "circle-radius": 12,
          "circle-color": "rgba(237, 237, 74, 1)",
          "circle-stroke-color": "rgba(0, 0, 0, 0.95)",
          "circle-stroke-width": 2
        }
      });
      map.addLayer({
        id: "this-stop-icon",
        type: "symbol",
        source: "this-stop",
        layout: {
          "icon-image": "bus-stop-15",
          "icon-size": 0.75
        },
        paint: {
          "icon-opacity": 1
        }
      });

      // the routes
      map.getSource("routes").setData({ type: "FeatureCollection", features: shapesFeatures });

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

      // the live bus
      map.addSource("live-bus", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: []
        }
      });
      map.addLayer({
        id: "realtime-circle",
        type: "circle",
        source: "live-bus",
        paint: {
          "circle-radius": 14,
          "circle-color": "rgba(89,89,89,1)",
          "circle-stroke-width": 2
        }
      });
      map.addLayer({
        id: "live-bus-icon",
        type: "symbol",
        source: "live-bus",
        layout: {
          "icon-image": "bus-light-15",
          "icon-size": 1
        },
        paint: {
          "icon-opacity": 1
        }
      });

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
    setMap(map);
  }, []);

  // effect fires when the live bus ticks
  useEffect(() => {
    if (theMap && currentBus) {
      let liveBusGeom = {
        type: "Point",
        coordinates: [currentBus.tripStatus.position.lon, currentBus.tripStatus.position.lat]
      };

      let liveRouteGeom = shapesFeatures.filter(sf => sf.properties.routeShortName === currentRoute.toString())[0];

      let liveBusFeature = {
        type: "Feature",
        geometry: nearestPointOnLine(liveRouteGeom, liveBusGeom).geometry || liveBusGeom,
        properties: {
          this: "fake"
        }
      };

      theMap.getSource("live-bus").setData({
        type: "FeatureCollection",
        features: [liveBusFeature]
      });

      theMap.fitBounds(bbox({ type: "FeatureCollection", features: [liveBusFeature, stop] }), { padding: 70 });

      theMap.resize();
    } else if ((theMap && !currentBus) || (currentBus && parseInt(currentBus.routeShortName) !== currentRoute)) {
      theMap.easeTo({
        center: coords,
        zoom: 15.75
      });
      return;
    }
  }, [currentBus, currentRoute]);

  useEffect(() => {
    if (theMap) {
      theMap.setFilter("ddot-routes-highlight", ["==", "routeShortName", currentRoute.toString()]);
      theMap.setFilter("ddot-routes", ["==", "routeShortName", currentRoute.toString()]);
      theMap.setFilter("ddot-routes-case", ["==", "routeShortName", currentRoute.toString()]);
    }
  }, [currentRoute]);

  return (
    <>
      <Card style={{ gridArea: "title" }}>
        <CardHeader
          avatar={<BusStop />}
          title={name}
          titleTypographyProps={{ variant: "h6" }}
          subheader={`Stop ID: #${id}`}
          subheaderTypographyProps={{ variant: "subtitle2" }}
        />
      </Card>
      <div id="map" />
    </>
  );
};

export default StopMap;
