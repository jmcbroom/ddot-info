import React, { useState } from "react";
import { graphql } from "gatsby";

import Layout from "../components/Layout";
import RouteHeader from "../components/RouteHeader";
import RouteBadge from "../components/RouteBadge";
import RouteStopList from "../components/RouteStopList";

import Toolbar from "@material-ui/core/Toolbar";
import { AppBar } from "@material-ui/core";
import { TextField } from "@material-ui/core";
import { Search } from "@material-ui/icons";

import routes from "../data/routes";
import DirectionPicker from "../components/DirectionPicker";

/** Search input for StopSearch */
const StopInput = ({ input, handleChange }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        padding: ".25em",
        border: "2px solid rgba(0, 68, 69, 0.2)",
        backgroundColor: "#fff"
      }}
    >
      <Search
        style={{ marginRight: ".25em", width: "1.25em", height: "1.25em" }}
      />
      <TextField
        label="Search by street name or stop ID"
        placeholder='Try "Michigan", "Washington", "1118"'
        value={input}
        onChange={e => handleChange(e.target.value)}
        fullWidth
        style={{ marginBottom: "1em" }}
      />
    </div>
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
      <div className="schedule">
        <AppBar
          position="static"
          color="default"
          elevation={0}
          style={{ display: "flex", background: "white" }}
        >
          <Toolbar
            elevation={0}
            style={{ flexDirection: "column", alignItems: "flex-start" }}
          >
            <span
              style={{
                margin: 0,
                padding: ".5em 0em",
                fontSize: "1.5em",
                display: "flex",
                flexDirection: "row",
                alignItems: "center"
              }}
            >
              <span style={{ marginLeft: ".25em" }}>
                <RouteBadge id={r.routeShortName} showName />
              </span>
              :{" "}
              <span style={{ fontWeight: 700, paddingLeft: ".2em" }}>
                Bus stops
              </span>
            </span>
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
          </Toolbar>
        </AppBar>
        <AppBar
          position="static"
          color="default"
          elevation={0}
          style={{ display: "flex", padding: ".5em 0em" }}
        >
          <Toolbar
            elevation={0}
            style={{
              justifyContent: "flex-start",
              flexWrap: "wrap",
              marginLeft: ".5em",
              alignItems: "start"
            }}
          >
            <DirectionPicker
              directions={availableDirections}
              direction={currentDirection}
              handleChange={setCurrentDirection}
              endpoints={rd.between}
            />
            <div style={{ width: 400 }}>
              <StopInput input={stopSearch} handleChange={setStopSearch} />
            </div>
          </Toolbar>
        </AppBar>
        <RouteStopList
          route={rd}
          input={stopSearch}
          longTrip={
            r.longTrips.filter(t => t.directionId === currentDirectionId)[0]
          }
        />
        {/* <RouteStopList
            id={this.state.routeId}
            input={this.state.input}
            routeNumber={thisRoute.id}
            timepoints={this.state[this.state.currentSvc][this.state.currentDirection].timepoints} /> */}
      </div>
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
