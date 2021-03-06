import { Card, CardHeader } from "@material-ui/core";
import { graphql } from "gatsby";
import React, { useEffect, useState } from "react";

import Layout from "../components/Layout";
import RouteBadge from "../components/RouteBadge";
import RouteDetails from "../components/RouteDetails";
import RouteHeader from "../components/RouteHeader";
import RouteMap from "../components/RouteMap";
// import routes from "../data/routes";
import Helpers from "../helpers";

export default ({ data, pageContext }) => {
  let r = data.postgres.route[0];
  // let rd = routes.filter(rd => rd.number === parseInt(pageContext.routeNo));
  let [now, setNow] = useState(new Date());
  let [activeTrips, setActiveTrips] = useState([]);
  let [refs, setRefs] = useState(null);

  // set up a 15s 'tick' using `now`
  useEffect(() => {
    let tick = setInterval(() => {
      setNow(new Date());
    }, 2000);
    return () => clearInterval(tick);
  }, []);

  // fetch data here; this ticks on `now`
  useEffect(() => {
    const url = `${Helpers.endpoint}/trips-for-route/DDOT_${r.routeId}.json?key=BETA&includePolylines=false&includeStatus=true`;
    fetch(url)
      .then(r => r.json())
      .then(d => {
        // filter the API's trips; does it appear in the current route's roster of trips?
        let allTripIds = r.trips.map(trip => trip.id);
        let filteredTrips = d.data.list.filter(l => allTripIds.indexOf(l.tripId.slice(5)) !== -1);
        setActiveTrips(filteredTrips);
        setRefs(d.data.references);
      });
  }, [now]);

  return (
    <Layout className="pageGrid">
      <RouteHeader number={r.routeShortName} page="Overview" />
      <div style={{ gridArea: "title" }}>
        <Card>
          <CardHeader title={<RouteBadge id={r.routeShortName} showName />} />
        </Card>
      </div>
      <RouteMap
        shapes={r.shapes}
        longTrips={r.longTrips}
        activeTrips={activeTrips}
        allTrips={r.trips}
        refs={refs}
        color={r.routeColor}
        shortName={r.routeShortName}
      />
      <RouteDetails id={r.routeShortName} />
    </Layout>
  );
};

export const query = graphql`
  query($routeNo: String!) {
    postgres {
      route: allRoutesList(
        condition: { routeShortName: $routeNo, feedIndex: 7 }
      ) {
        agencyId
        routeShortName
        routeLongName
        routeId
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
              stopLat
              stopLon
            }
          }
        }
      }
    }
  }
`;
