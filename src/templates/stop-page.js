import React, { useState } from "react";
import { graphql } from "gatsby";
import _ from "lodash";

import Layout from "../components/layout";
import StopMap from '../components/StopMap';
import RouteLink from '../components/RouteLink';
import StopRouteSchedule from '../components/StopRouteSchedule';

import routes from '../data/routes';

import { Card, CardHeader, AppBar, Toolbar} from '@material-ui/core';
import { Radio, RadioGroup } from "@material-ui/core";
import { FormControl, FormControlLabel } from "@material-ui/core";

export default ({ data, pageContext }) => {

    const s = data.postgres.stop;

    console.log(s)

    let uniqRoutes = _.uniqBy(s.times, t => {
      return t.trip.route.routeLongName;
    }).map(ur => ur.trip.route);
    let uniqRouteNums = uniqRoutes.map(u => parseInt(u.routeShortName))

    let [route, setRoute] = useState(uniqRouteNums[0])

    let rd = routes.filter(rd => rd.number === route)[0];

    return (
      <Layout className="App">
        <StopMap name={s.stopDesc || s.stopName} id={s.stopId} coords={[s.stopLon, s.stopLat]}/>
        <div className='routes'>
          <Card>
              <CardHeader title="Bus routes that stop here" subheader="Showing next arrivals and today's schedule. Transfers tab shows nearby routes" style={{ fontSize: '1.1em' }}/>
          </Card>
          <AppBar position="static" color="red" style={{ display: 'flex' }} elevation={0}>
            <Toolbar>
              <FormControl component='fieldset' required  style={{width: '100%'}}>
                <RadioGroup name='routes' value={route}>
                  {uniqRouteNums.map(n => (
                    <FormControlLabel
                      key={n}
                      value={n}
                      control={<Radio />}
                      onChange={() => setRoute(n)}
                      label={<RouteLink id={n} small />}
                      style={{width: '100%'}}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </Toolbar>
          </AppBar>
          <AppBar position="static" color="default" elevation={0} style={{ display: 'flex' }}>
            <Toolbar style={{ justifyContent: 'space-between' }} elevation={0}>
              <RouteLink id={route} />
            </Toolbar>
          </AppBar>
          <div style={{ display: 'block', padding: '0em 0em', width: '100%' }}>
            {/* <RoutePredictionsList /> */}
            <StopRouteSchedule 
              times={s.times.filter(t => t.trip.route.routeShortName === route.toString())}
              shapes={s.routeShapes.filter(rs => rs.routeByFeedIndexAndRouteId.routeShortName === route.toString())}
              route={rd}
              />
          </div>
        </div>
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
        times: stopTimesByFeedIndexAndStopIdList(orderBy: ARRIVAL_TIME_ASC) {
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