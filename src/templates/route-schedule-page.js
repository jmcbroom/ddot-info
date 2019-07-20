import React, { useState } from "react";
import _ from "lodash";
import chroma from "chroma-js";
import { Link, graphql } from "gatsby";

import Layout from "../components/Layout";
import RouteHeader from "../components/RouteHeader";
import RouteBadge from "../components/RouteBadge";
import DirectionPicker from "../components/DirectionPicker";
import ServicePicker from "../components/ServicePicker";
import ScheduleTable from "../components/ScheduleTable";

import routes from "../data/routes";

import { AppBar } from "@material-ui/core";
import { Card, CardContent } from "@material-ui/core";
import Toolbar from "@material-ui/core/Toolbar";

export default ({ data, pageContext }) => {
  let r = data.postgres.route[0];
  let rd = routes.filter(rd => rd.number === parseInt(r.routeShortName))[0];

  let availableDirections = r.shapes.map(s => s.direction);
  let [currentDirection, setCurrentDirection] = useState(availableDirections[0]);
  let currentDirectionId = rd.directions.indexOf(currentDirection);

  let availableServices = _.uniq(r.trips.map(t => t.service));
  let [currentService, setCurrentService] = useState(availableServices[0]);

  let tripsToShow = r.trips.filter(trip => trip.direction === currentDirectionId && trip.service === currentService);

  // const sorted = tripsToShow.sort((a, b) => {
  //   return (
  //     a.stopTimes[0].arrivalTime.hours * 60 +
  //     a.stopTimes[0].arrivalTime.minutes -
  //     (b.stopTimes[0].arrivalTime.hours * 60 +
  //       b.stopTimes[0].arrivalTime.minutes)
  //   );
  // });

  let timepointList = tripsToShow
    .sort((a, b) => {
      return b.stopTimes.map(s => s.timepoint).reduce((acc, val) => acc + val) - a.stopTimes.map(s => s.timepoint).reduce((acc, val) => acc + val);
    })[0]
    .stopTimes.filter(st => {
      return st.timepoint === 1;
    });

    let sorted = tripsToShow.sort((a, b) => {
      let c = null;
      let d = null;
  
      for (let t of timepointList) {
        let aFilter = a.stopTimes.filter(st => st.stop.stopId === t.stop.stopId);
        let bFilter = b.stopTimes.filter(st => st.stop.stopId === t.stop.stopId);
        if (bFilter.length > 0 && aFilter.length > 0) {
          c = aFilter[0];
          d = bFilter[0];
          break;
        }
      }
      return (
        c.arrivalTime.hours * 60 +
        c.arrivalTime.minutes -
        (d.arrivalTime.hours * 60 + d.arrivalTime.minutes)
      );
    });
  
  return (
    <Layout>
      <RouteHeader number={r.routeShortName} page="Schedule" />
      <div className="schedule">
        <AppBar position="static" color="default" elevation={0} style={{ display: "flex", background: "white" }}>
          <Toolbar elevation={0} style={{ flexDirection: "column", alignItems: "flex-start" }}>
            <span style={{ margin: 0, padding: ".5em 0em", fontSize: "1.5em", display: "flex", flexDirection: "row", alignItems: "center" }}>
              <span style={{ marginLeft: ".25em" }}>
                <RouteBadge id={r.routeShortName} showName />
              </span>
              : <span style={{ fontWeight: 700, paddingLeft: ".2em" }}>Schedule</span>
            </span>
            <div style={{ display: "flex", flexWrap: "wrap", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", marginBottom: ".5em" }}>
              <span style={{ fontSize: ".9em" }}>
                <b>Major stops</b>{" "}
              </span>
              <span style={{ height: "15px", width: "15px", backgroundColor: "#000", border: "1px solid #000", borderRadius: "3em", margin: ".25em" }} />
              <span style={{ fontSize: ".9em" }}>
                {" "}
                are shown in order in the top row; look down the column to see scheduled departure times from that bus stop.
              </span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", marginBottom: ".5em" }}>
              <span style={{ fontSize: ".9em" }}>
                Buses make additional stops between major stops; see a list of all stops on the{" "}
                <Link to={`/route/${r.routeShortName}/stops`} style={{ color: "black" }}>
                  BUS STOPS
                </Link>{" "}
                tab.
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", marginBottom: ".5em" }}>
              <span style={{ fontSize: ".9em" }}>
                Displaying AM times, <b>PM times</b>, and{" "}
              </span>
              <span
                style={{
                  background: chroma(r.routeColor)
                    .alpha(0.25)
                    .css(),
                  fontSize: ".9em",
                  marginLeft: ".25em",
                  padding: ".15em"
                }}
              >
                {" "}
                current trips.
              </span>
            </div>
          </Toolbar>
        </AppBar>
        <AppBar position="static" color="default" elevation={0} style={{ display: "flex", flexWrap: "wrap", padding: ".5em 0em", marginBottom: "1em" }}>
          <Toolbar elevation={0} style={{ justifyContent: "flex-start", alignItems: "start", marginLeft: ".5em" }}>
            <DirectionPicker directions={availableDirections} direction={currentDirection} handleChange={setCurrentDirection} endpoints={rd.between} />
            <ServicePicker services={availableServices} service={currentService} handleChange={setCurrentService} />
          </Toolbar>
        </AppBar>
        <ScheduleTable trips={sorted} color={r.routeColor} />
        {/* <ScheduleTable 
            schedule={this.state[this.state.currentSvc]} 
            direction={this.state.currentDirection} 
            liveTrips={_.map(this.state.realtimeTrips, 'properties.tripId')} 
            color={this.state.color} /> */}
        <Card style={{ marginTop: "1em", backgroundColor: "#fff" }}>
          <CardContent>{/* <PrintSchedule routePdf={rd.pdf} /> */}</CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export const query = graphql`
  query($routeNo: String!) {
    postgres {
      route: allRoutesList(condition: { routeShortName: $routeNo, feedIndex: 1 }) {
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
          stopTimes: stopTimesByFeedIndexAndTripIdList(orderBy: STOP_SEQUENCE_ASC) {
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
          stopTimes: stopTimesByFeedIndexAndTripIdList(condition: { timepoint: 1 }) {
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
