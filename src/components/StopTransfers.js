import React from "react";
import _ from "lodash";
import { Card, CardHeader, CardContent, Typography, Chip } from "@material-ui/core";
import RouteLink from "./RouteLink";
import { Link } from "gatsby";
import distance from '@turf/distance';

const StopTransfers = ({ xfers, coords, title, avatar }) => {
  
  let routeXfers = _(xfers.map(x => x.routes))
    .uniqWith(_.isEqual)
    .flatten()
    .groupBy("short")
    .value();

  return (
    <Card>
      <CardHeader title={title} avatar={avatar} titleTypographyProps={{ variant: "h6" }} style={{ paddingBottom: 0 }} />
      {Object.keys(routeXfers).map(k => {
        return (
          <>
            <CardHeader title={<RouteLink id={k} small />} titleTypographyProps={{ variant: "body1" }} style={{ paddingBottom: 0 }} />
            <CardContent style={{ padding: 15 }}>
              {_.uniqWith(routeXfers[k], _.isEqual).map(d => {
                let matchedStops = _.uniqWith(xfers.filter(xf => _.findIndex(xf.routes, r => _.isEqual(r, d)) > -1), _.isEqual);
                let stopsByDistance = matchedStops.sort((a, b) => distance(coords, {type: "Point", coordinates: [a.stopLon, a.stopLat]}) - distance(coords, {type: "Point", coordinates: [b.stopLon, b.stopLat]}))
                return (
                  <div key={`${k}-${d.direction}`} style={{ marginBottom: 5 }}>
                    <Chip label={_.capitalize(d.direction)} display="inline" />
                    <Typography variant="body2" display="inline" style={{ marginLeft: 10 }}>
                      <Link to={`/stop/${stopsByDistance[0].stopId}`}>{stopsByDistance[0].stopDesc}</Link>
                    </Typography>
                  </div>
                );
              })}
            </CardContent>
          </>
        );
      })}
    </Card>
  );
};

export default React.memo(StopTransfers);
