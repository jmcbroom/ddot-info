import { Card, CardContent, CardHeader, IconButton } from "@material-ui/core";
import { Close, DirectionsBus, Schedule, SpeakerPhone } from "@material-ui/icons";
import { navigate } from "@reach/router";
import bbox from "@turf/bbox";
import { Link } from "gatsby";
import _ from "lodash";
import mapboxgl from "mapbox-gl/dist/mapbox-gl.js";
import React, { useEffect, useState } from "react";

import style from "../data/mapstyle.json";
import routes from "../data/routes";

const RouteMap = ({ shapes, longTrips, allTrips, color, shortName, activeTrips }) => {
  // do a route detail lookup
  let rd = routes.filter(rd => rd.number === parseInt(shortName))[0];

  // we're going to store the mapbox gl map object here.
  let [theMap, setMap] = useState(null);
  let [tracked, setTracked] = useState(null);

  // make some GeoJSON features for the map
  // route shapes
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

  // we'll fitBounds using this on map load
  let bounds = bbox({ type: "FeatureCollection", features: shapesFeatures });

  // we iterate through the longTrips to get all stops.
  let stopsFeatures = [];
  longTrips.forEach(lt => {
    lt.stopTimes.forEach(st => {
      let stopFeature = st.stop.geojson;
      stopFeature.properties.timepoint = st.timepoint ? `1` : `0`;
      stopFeature.properties.directionId = lt.directionId;
      stopFeature.properties.direction = rd["directions"][lt.directionId];
      stopsFeatures.push(stopFeature);
    });
  });

  // just for kicks, let's start on a random timepoint and zoom out to the whole route
  let randomTimepoint = _.sample(stopsFeatures.filter(sf => sf.properties.timepoint === "1"));

  // here's the initial map setup useEffect; we'll store the map in state
  useEffect(() => {
    mapboxgl.accessToken = "pk.eyJ1IjoiY2l0eW9mZGV0cm9pdCIsImEiOiJjaXZvOWhnM3QwMTQzMnRtdWhyYnk5dTFyIn0.FZMFi0-hvA60KYnI-KivWg";

    let map = new mapboxgl.Map({
      container: "map",
      style: style,
      center: randomTimepoint.geometry.coordinates,
      zoom: 12.75 // starting zoom
    });

    let ctrl = new mapboxgl.NavigationControl({
      showCompass: false
    });

    map.addControl(ctrl, "bottom-left");

    map.on("load", () => {
      map.fitBounds(bounds, {
        padding: 50
      });

      map.getSource("routes").setData({ type: "FeatureCollection", features: shapesFeatures });
      map.addSource("stops", {
        type: "geojson",
        data: { type: "FeatureCollection", features: stopsFeatures }
      });

      // stops
      map.addLayer({
        id: "stop-points",
        type: "circle",
        source: "stops",
        interactive: true,
        filter: ["==", "$type", "Point"],
        layout: {},
        minzoom: 14,
        paint: {
          "circle-color": {
            type: "categorical",
            property: "timepoint",
            stops: [["0", "white"], ["1", "#222"]]
          },
          "circle-stroke-color": {
            type: "categorical",
            property: "timepoint",
            stops: [["0", "#222"], ["1", "black"]]
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
          "text-justify": "center",
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
          "text-field": ["get", "stop_name"],
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

      // timepoints
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
          visibility: "visible",
          "text-field": "{stop_name}",
          "text-max-width": 5
        },
        paint: {
          "text-translate": [0, 0],
          "text-halo-color": "white",
          "text-halo-width": 2,
          "text-opacity": {
            stops: [[9.5, 0], [9.51, 0.1], [9.6, 0.9], [14.9, 0.9], [15, 0]]
          },
          "text-color": "black"
        }
      });

      // realtime
      map.addLayer({
        id: "realtime-circle",
        type: "circle",
        source: "realtime",
        paint: {
          "circle-radius": 14,
          "circle-color": "rgba(89,89,89,1)",
          "circle-stroke-width": 2
        }
      });
      map.addLayer({
        id: "realtime-icons",
        type: "symbol",
        source: "realtime",
        layout: {
          "icon-image": "bus-light-15",
          "icon-allow-overlap": true,
          "icon-size": 1
        }
      });

      // routes
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

      map.on("click", "stop-points", e => {
        let stop = map.queryRenderedFeatures(e.point, {
          layers: ["stop-points"]
        })[0];

        navigate(`/stop/${stop.properties.stop_id}`);
      });

      map.on("click", "realtime-circle", e => {
        let clickedTrip = map.queryRenderedFeatures(e.point, {
          layers: ["realtime-circle"]
        })[0];

        // let matchedTrip = activeTrips.filter(at => at.status.vehicleId === clickedTrip.properties.vehicleId)[0];
        setTracked(clickedTrip.properties.tripId);

        map.easeTo({
          center: clickedTrip.geometry.coordinates,
          zoom: 16
        });
      });

      map.on("mouseover", "stop-points", () => {
        map.getCanvas().style.cursor = "pointer";
      });

      map.on("mouseleave", "stop-points", () => {
        map.getCanvas().style.cursor = "";
      });
    });

    setMap(map);
  }, []);

  // an effect for when the realtime data changes
  useEffect(() => {
    // let's make some GeoJSON
    let features = activeTrips.map(tr => {
      return {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [tr.status.position.lon, tr.status.position.lat]
        },
        properties: {
          tripId: tr.tripId,
          ...tr.status
        }
      };
    });

    if (theMap) {
      theMap.getSource("realtime").setData({ type: "FeatureCollection", features: features });
      if (tracked) {
        let filtered = activeTrips.filter(trip => trip.tripId === tracked);

        if (filtered.length === 0) {
          return;
        } else {
          theMap.easeTo({
            center: [filtered[0].status.position.lon, filtered[0].status.position.lat]
          });
        }
      }
    }
  }, [activeTrips]);

  let realtimeTrip,
    gtfsTrip,
    nextStop = null;
  if (tracked !== null) {
    realtimeTrip = activeTrips.filter(trip => trip.tripId === tracked)[0];
    gtfsTrip = allTrips.filter(trip => trip.id === tracked.slice(5))[0];
    nextStop = stopsFeatures.filter(sf => sf.properties.stop_id === realtimeTrip.status.nextStop.slice(5).toString())[0];
  }

  return (
    <>
      <div id="map" style={{ gridArea: "map" }} />

      {tracked && realtimeTrip && gtfsTrip && (
        <div style={{ gridArea: "realtime" }}>
          <Card style={{ background: "white", zIndex: 2 }}>
            <CardHeader
              avatar={realtimeTrip.status.predicted ? <SpeakerPhone /> : <Schedule />}
              title={`${_.capitalize(rd.directions[gtfsTrip.direction])} to ${rd.between[gtfsTrip.direction]}`}
              subheader={
                Math.abs(realtimeTrip.status.scheduleDeviation / 60) === 0
                  ? `On time`
                  : `${Math.abs(realtimeTrip.status.scheduleDeviation / 60)} minute${Math.abs(realtimeTrip.status.scheduleDeviation / 60) === 1 ? `` : `s`} ${
                      realtimeTrip.status.scheduleDeviation < 0 ? "early" : "late"
                    }`
              }
              titleTypographyProps={{ variant: "subtitle1" }}
              action={
                <IconButton onClick={() => setTracked(null)}>
                  <Close />
                </IconButton>
              }
            />
            <CardContent title="what" style={{ paddingTop: 0 }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <DirectionsBus style={{ height: 20, width: 20, borderRadius: 9999, background: "rgba(0,0,0,.75)", padding: 2.5, color: "white" }} />
                <span style={{ marginLeft: ".5em" }}>Now near</span>
                <Link style={{ fontSize: "1em", color: "#000", fontWeight: 300, padding: "0px 5px 0px 5px" }} to={`/stop/${nextStop.properties.stop_id}/`}>
                  <span style={{ fontWeight: 700 }}>{nextStop.properties.stop_name}</span>
                </Link>
                <span style={{ background: "#eee", padding: ".25em", display: "inline-block" }}>#{nextStop.properties.stop_id}</span>
              </div>
            </CardContent>
            {/* <Typography variant="subtitle1" color="textPrimary" />
            <Typography variant="subtitle2" color="textPrimary">
              {`Next stop:`}
            </Typography>
            <Typography variant="h6" color="textPrimary">
              <Link to={`/stop/${nextStop.properties.stopId}`}> {`${nextStop.properties.stop_desc} (#${nextStop.properties.stop_id})`} </Link>
            </Typography>
          </CardContent> */}
          </Card>
        </div>
      )}
    </>
  );
};

export default RouteMap;
