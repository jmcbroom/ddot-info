import React, { useState } from "react";
import { graphql } from "gatsby";
import _ from "lodash";

import Layout from "../components/layout";
import StopMap from '../components/StopMap';

// const StopRoutes = ({ stop, list }) => {
//   let uniqRoutes = _.uniqBy(stop.times, t => {
//     return t.trip.route.routeLongName;
//   }).map(ur => ur.trip.route);

//   let dropdownOptions = uniqRoutes.map(u => {
//     return {
//       key: u.routeShortName.toString(),
//       text: u.routeLongName,
//       value: u.routeShortName.toString(),
//       content: <RouteDisplay key={u.routeShortName} route={u} size="big" />
//     };
//   });

//   return (
//     <div>
//       StopRoutes
//       <Dropdown placeholder="select Friends" fluid selection options={dropdownOptions} />
//       <StopTimeList list={list} />
//     </div>
//   );
// };

export default ({ data, pageContext }) => {

    const s = data.postgres.stop;

    // const times = s.times.filter(t => {
    //   return feeds[pageContext.feedIndex - 1].services[t.trip.serviceId] === "weekday";
    // });
    // // sort by arrivalTime
    // let sorted = times.sort((a, b) => {
    //   let times = [a, b].map(x => x.arrivalTime.hours * 3600 + x.arrivalTime.minutes * 60 + x.arrivalTime.seconds);
    //   return times[0] - times[1];
    // });
    // dedupe on arrivalTime: transit-windsor has a service for every day of the week
    // TODO: this will need more tweaks for t-w
    // let uniq = _.uniqBy(sorted, x => {
    //   return x.arrivalTime.hours * 3600 + x.arrivalTime.minutes * 60 + x.arrivalTime.seconds;
    // });

    return (
      <Layout className="App">
        <StopMap name={s.stopDesc || s.stopName} id={s.stopId} coords={[s.stopLon, s.stopLat]}/>
        {/* <Grid stackable padded>
          <Grid.Row>
            <Grid.Column width={10}>
              <StopMap lat={s.stopLat} lon={s.stopLon} routes={s.routeShapes} />
            </Grid.Column>
            <Grid.Column width={6}>
              <StopRoutes stop={s} list={uniq} />
            </Grid.Column>
          </Grid.Row>
        </Grid> */}
      </Layout>
    );
  };

export const query = graphql`
  query($stopId: String!) {
    postgres {
      stop: stopByFeedIndexAndStopId(stopId: $stopId, feedIndex: 1) {
        stopId
        stopName
        stopDesc
        stopLat
        stopLon
        geojson
        routeShapes: routeShapesList {
          routeByFeedIndexAndRouteId {
            agencyId
            routeShortName
            routeLongName
            routeType
            routeColor
            routeTextColor
          }
          direction
          dir
          geojson: simpleGeojson
        }
        times: stopTimesByFeedIndexAndStopIdList {
          trip: tripByFeedIndexAndTripId {
            tripId
            route: routeByFeedIndexAndRouteId {
              routeColor
              routeTextColor
              routeShortName
              routeLongName
              agencyId
            }
            directionId
            serviceId
            tripHeadsign
          }
          arrivalTime {
            hours
            minutes
            seconds
          }
        }
      }
    }
  }
`;