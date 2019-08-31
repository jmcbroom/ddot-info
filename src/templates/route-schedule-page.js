import { CardActionArea, CardActions, Typography } from "@material-ui/core";
import { Card, CardContent, CardHeader } from "@material-ui/core";
import { FiberManualRecord } from "@material-ui/icons";
import { Link, graphql } from "gatsby";
import _ from "lodash";
import React, { useState } from "react";

import DirectionPicker from "../components/DirectionPicker";
import Layout from "../components/Layout";
import RouteBadge from "../components/RouteBadge";
import RouteHeader from "../components/RouteHeader";
import ScheduleTable from "../components/ScheduleTable";
import ServicePicker from "../components/ServicePicker";
import routes from "../data/routes";

export default ({ data }) => {
  let r = data.postgres.route[0];
  let rd = routes.filter(rd => rd.number === parseInt(r.routeShortName))[0];

  let availableDirections = r.shapes.map(s => s.direction);
  let [currentDirection, setCurrentDirection] = useState(availableDirections[0]);
  let currentDirectionId = rd.directions.indexOf(currentDirection);

  let availableServices = _.uniq(r.trips.map(t => t.service));
  let todayService = availableServices[0];
  if (new Date().getDay() === 0 && availableServices.indexOf("3") > -1) {
    todayService = availableServices[2];
  }
  if (new Date().getDay() === 6 && availableServices.indexOf("2") > -1) {
    todayService = availableServices[1];
  }
  let [currentService, setCurrentService] = useState(todayService);

  let tripsToShow = r.trips.filter(trip => trip.direction === currentDirectionId && trip.service === currentService);

  return (
    <Layout>
      <RouteHeader number={r.routeShortName} page="Schedule" />
      <Card className="schedule">
        <CardHeader title={<RouteBadge id={r.routeShortName} showName />} />
        <CardContent style={{ paddingTop: 0 }}>
          <Typography variant={"body1"}>
            <b>Major stops</b> <FiberManualRecord fontSize="small" style={{ padding: 0, margin: 0, display: "inline" }} />
            are shown in order in the top row; look down the column to see scheduled departure times from that bus stop.
          </Typography>
          <Typography variant={"body1"}>
            {" "}
            Buses make additional stops between major stops; see a list of all stops on the{" "}
            <Link to={`/route/${r.routeShortName}/stops`} style={{ color: "black" }}>
              BUS STOPS
            </Link>{" "}
            tab.
          </Typography>
          <Typography variant={"body1"}>
            {" "}
            Displaying AM times and <b>PM times</b>
          </Typography>
        </CardContent>
        <CardActionArea>
          <CardActions style={{ display: "flex", paddingLeft: 20, paddingTop: 10, paddingBottom: 0 }}>
            <ServicePicker services={availableServices} service={currentService} handleChange={setCurrentService} asRow />
            <DirectionPicker directions={availableDirections} direction={currentDirection} handleChange={setCurrentDirection} endpoints={rd.between} asRow />
          </CardActions>
        </CardActionArea>
        <ScheduleTable trips={tripsToShow} color={r.routeColor} />
        {/* <CardActions><PrintSchedule routePdf={rd.pdf} /></CardActions> */}
      </Card>
    </Layout>
  );
};

export const query = graphql`
  query($routeNo: String!) {
    postgres {
      route: allRoutesList(condition: { routeShortName: $routeNo, feedIndex: 6 }) {
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
              stopName
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
              stopName
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
