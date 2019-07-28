import React, { useState } from "react";
import { graphql } from "gatsby";
import _ from "lodash";

import Layout from "../components/Layout";
import StopMap from "../components/StopMap";
import RouteLink from "../components/RouteLink";
import StopRouteSchedule from "../components/StopRouteSchedule";
import RoutePredictionsList from "../components/RoutePredictionsList";
import BusStop from "../components/BusStop";
import TopNav from "../components/TopNav";

import routes from "../data/routes";

import { Card, CardHeader, AppBar, Toolbar, NativeSelect } from "@material-ui/core";
import { Radio, RadioGroup } from "@material-ui/core";
import { FormControl, FormControlLabel, InputLabel, Input, FormHelperText } from "@material-ui/core";

export default ({ data, pageContext }) => {
  const s = data.postgres.stop;

  let uniqRoutes = _.uniqBy(s.times, t => {
    return t.trip.route.routeLongName;
  }).map(ur => ur.trip.route);

  let uniqRouteNums = uniqRoutes.map(u => parseInt(u.routeShortName)).sort((a, b) => a - b);

  // let [route, setRoute] = useState('');
  let [route, setRoute] = useState(uniqRouteNums[0]);

  let rd = routes.filter(rd => rd.number === route)[0];

  let [currentTrip, setCurrentTrip] = useState(null);

  let [predictions, setPredictions] = useState([]);

  console.log(predictions, currentTrip);

  return (
    <Layout className="pageGrid">
      <TopNav />
      <StopMap
        name={s.stopDesc || s.stopName}
        id={s.stopId}
        coords={[s.stopLon, s.stopLat]}
        shapes={s.routeShapes}
        stop={s.geojson}
        currentRoute={route}
        currentBus={predictions.filter(p => p.tripId === currentTrip)[0]}
      />
      <div style={{ gridArea: "details" }}>
        <Card>
          <CardHeader
            title="Bus routes that stop here"
            subheader="Showing next arrivals and today's schedule. Transfers tab shows nearby routes"
            style={{ fontSize: "1.1em" }}
          />
        </Card>
        <AppBar position="static" color="red" style={{ display: "flex" }} elevation={0}>
          <Toolbar>
            <FormControl component="fieldset" required style={{ width: "100%" }}>
              {uniqRouteNums.length < 4 ? (
                <RadioGroup name="routes" value={route}>
                  {uniqRouteNums.map(n => (
                    <FormControlLabel
                      key={n}
                      value={n}
                      control={<Radio />}
                      onChange={() => setRoute(n)}
                      label={<RouteLink id={n} small />}
                      style={{ width: "100%" }}
                    />
                  ))}
                </RadioGroup>
              ) : (
                <>
                  <InputLabel htmlFor="route-native-helper">{uniqRouteNums.length} routes stop here; choose yours from the menu</InputLabel>
                  <NativeSelect value={route} onChange={e => setRoute(e.target.value)} input={<Input name="route" id="route-native-helper" />}>
                    {uniqRouteNums.map(n => (
                      <option value={n}>{n}</option>
                    ))}
                  </NativeSelect>
                </>
              )}
            </FormControl>
          </Toolbar>
        </AppBar>
        <AppBar position="static" color="default" elevation={0} style={{ display: "flex" }}>
          <Toolbar style={{ justifyContent: "space-between" }} elevation={0}>
            <RouteLink id={route} />
          </Toolbar>
        </AppBar>
        <div style={{ display: "block", padding: "0em 0em", width: "100%" }}>
          <RoutePredictionsList
            stop={s.stopId}
            trips={s.times.map(ti => ti.trip)}
            route={route}
            currentTrip={currentTrip}
            handleChange={setCurrentTrip}
            predictions={predictions}
            setPredictions={setPredictions}
          />
          <StopRouteSchedule
            times={s.times.filter(t => t.trip.route.routeShortName === route.toString())}
            shapes={s.routeShapes.filter(rs => rs.routeByFeedIndexAndRouteId.routeShortName === route.toString())}
            route={route}
          />
        </div>
      </div>
    </Layout>
  );
};

export const query = graphql`
  query($stopId: String!) {
    postgres {
      stop: stopByFeedIndexAndStopId(stopId: $stopId, feedIndex: 5) {
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
