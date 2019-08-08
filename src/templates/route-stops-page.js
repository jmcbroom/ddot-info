import React, { useState } from "react";
import { graphql } from "gatsby";

import Layout from "../components/Layout";
import RouteHeader from "../components/RouteHeader";
import RouteBadge from "../components/RouteBadge";
import RouteStopList from "../components/RouteStopList";

import Toolbar from "@material-ui/core/Toolbar";
import { AppBar, Card, CardContent, CardActions, CardHeader, CardActionArea } from "@material-ui/core";
import { TextField } from "@material-ui/core";
import { Search } from "@material-ui/icons";

import routes from "../data/routes";
import DirectionPicker from "../components/DirectionPicker";

/** Search input for StopSearch */
const StopInput = ({ input, handleChange }) => {
  return (
      <TextField
        label="Search by street name or stop ID"
        placeholder='Try "Michigan", "Washington", "1118"'
        value={input}
        style={{minWidth: '35vw', marginRight: 20}}
        margin='dense'
        onChange={e => handleChange(e.target.value)}
      />
  );
};

export default ({ data, pageContext }) => {
  let r = data.postgres.route[0];
  let rd = routes.filter(rd => rd.number === parseInt(r.routeShortName))[0];

  let [stopSearch, setStopSearch] = useState(``);

  let availableDirections = r.shapes.map(s => s.direction);
  let [currentDirection, setCurrentDirection] = useState(
    availableDirections[0]
  );
  let currentDirectionId = rd.directions.indexOf(currentDirection);

  return (
    <Layout>
      <RouteHeader number={r.routeShortName} page="Bus stops" />
      <Card className="schedule">
      <CardHeader title={<RouteBadge id={r.routeShortName} showName />} />

        <CardContent>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
                marginBottom: ".5em"
              }}
            >
              <span style={{ fontSize: ".9em" }}>
                <b>Major stops</b>{" "}
              </span>
              <span
                style={{
                  height: "15px",
                  width: "15px",
                  backgroundColor: "#000",
                  border: "1px solid #000",
                  borderRadius: "3em",
                  margin: ".25em"
                }}
              />
              <span style={{ fontSize: ".9em" }}> and local stops </span>
              <span
                style={{
                  height: "13px",
                  width: "13px",
                  backgroundColor: "#fff",
                  border: `3px solid #${r.routeColor}`,
                  borderRadius: "3em",
                  margin: ".25em"
                }}
              />
              <span style={{ fontSize: ".9em" }}>
                {" "}
                shown in order of arrival.
              </span>
            </div>
            <span style={{ fontSize: ".9em", marginBottom: ".5em" }}>
              Transfer to other routes from the same stop or a nearby stop.
            </span>
        </CardContent>
        <CardActionArea>
        <CardActions style={{ display: "flex", paddingLeft: 20, paddingTop: 10, paddingBottom: 0 }}>

          <StopInput input={stopSearch} handleChange={setStopSearch} />
            <DirectionPicker
              directions={availableDirections}
              direction={currentDirection}
              handleChange={setCurrentDirection}
              endpoints={rd.between}
              asRow
              />
              </CardActions>
              </CardActionArea>

        <RouteStopList
          route={rd}
          input={stopSearch}
          longTrip={
            r.longTrips.filter(t => t.directionId === currentDirectionId)[0]
          }
        />
      </Card>
    </Layout>
  );
};

export const query = graphql`
  query($routeNo: String!) {
    postgres {
      route: allRoutesList(
        condition: { routeShortName: $routeNo, feedIndex: 5 }
      ) {
        agencyId
        routeShortName
        routeLongName
        routeDesc
        routeType
        routeUrl
        routeColor
        routeTextColor
        routeSortOrder
        shapes: routeShapesByFeedIndexAndRouteIdList {
          dir
          direction
          geojson: simpleGeojson
        }
        longTrips: longestTripsList {
          tripHeadsign
          directionId
          stopTimes: stopTimesByFeedIndexAndTripIdList(
            orderBy: STOP_SEQUENCE_ASC
          ) {
            stopSequence
            timepoint
            arrivalTime {
              seconds
              minutes
              hours
            }
            stop: stopByFeedIndexAndStopId {
              stopId
              stopName
              stopDesc
              stopLat
              stopLon
              geojson
              routeShapes: routeShapesList {
                short
              }
            }
          }
        }
        trips: tripsByFeedIndexAndRouteIdList {
          id: tripId
          headsign: tripHeadsign
          direction: directionId
          service: serviceId
          stopTimes: stopTimesByFeedIndexAndTripIdList(
            condition: { timepoint: 1 }
          ) {
            timepoint
            arrivalTime {
              hours
              minutes
              seconds
            }
            stop: stopByFeedIndexAndStopId {
              stopId
              stopDesc
              stopName
              stopLat
              stopLon
            }
          }
        }
      }
    }
  }
`;
