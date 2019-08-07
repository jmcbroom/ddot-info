import React, { useState } from "react";
import { graphql, Link } from "gatsby";
import _ from "lodash";

import Layout from "../components/Layout";
import StopMap from "../components/StopMap";
import RouteLink from "../components/RouteLink";
import StopRouteSchedule from "../components/StopRouteSchedule";
import RoutePredictionsList from "../components/RoutePredictionsList";
import TopNav from "../components/TopNav";
import StopTransfers from "../components/StopTransfers";

import { Card, CardHeader, AppBar, Toolbar, NativeSelect, CardContent } from "@material-ui/core";
import { Radio, RadioGroup } from "@material-ui/core";
import { FormControl, FormControlLabel, InputLabel, Input } from "@material-ui/core";
import { NetworkCell, Timeline } from "@material-ui/icons";

export default ({ data }) => {
  const s = data.postgres.stop;

  let thisStopRoutes = s.routeShapes.map(rs => {
    return {
      short: rs.routeByFeedIndexAndRouteId.routeShortName,
      dir: rs.dir,
      direction: rs.direction
    };
  });

  let transferStops = s.nearby.filter(s => {
    return !_.isEqual(s.routes, thisStopRoutes);
  });

  let uniqRoutes = _.uniqBy(s.times, t => {
    return t.trip.route.routeLongName;
  }).map(ur => ur.trip.route);

  let uniqRouteNums = uniqRoutes.map(u => parseInt(u.routeShortName)).sort((a, b) => a - b);

  let [route, setRoute] = useState(uniqRouteNums[0]);

  let [currentTrip, setCurrentTrip] = useState(null);

  let [predictions, setPredictions] = useState([]);

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
        nearby={transferStops}
      />
      <div style={{ gridArea: "details" }}>
        <Card>
        <CardHeader avatar={<Timeline />} title="Bus routes that stop here" titleTypographyProps={{ variant: "h6" }} />
          <CardContent style={{ paddingTop: 0, paddingBottom: 0 }}>
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
          </CardContent>
          <CardHeader
            component={Link}
            to={`/route/${route}`}
            style={{ textDecoration: "none" }}
            title={<RouteLink id={route} small />}
            titleTypographyProps={{ variant: "h6" }}
          />
          <RoutePredictionsList
            stop={s.stopId}
            trips={s.times.map(ti => ti.trip)}
            route={route}
            currentTrip={currentTrip}
            handleChange={setCurrentTrip}
            predictions={predictions}
            setPredictions={setPredictions}
          />
        </Card>
        <StopRouteSchedule
          times={s.times.filter(t => t.trip.route.routeShortName === route.toString())}
          shapes={s.routeShapes.filter(rs => rs.routeByFeedIndexAndRouteId.routeShortName === route.toString())}
          route={route}
        />
        <StopTransfers xfers={transferStops} title={`Nearby transfers`}/>
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
        nearby: nearbyStopsList {
          stopId
          stopDesc
          stopLat
          stopLon
          routes: routeShapesList {
            short
            dir
            direction
          }
        }
      }
    }
  }
`;
