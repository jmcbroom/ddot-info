import { Card, CardContent, CardHeader, Chip, Typography } from "@material-ui/core";
import distance from "@turf/distance";
import { Link } from "gatsby";
import _ from "lodash";
import React from "react";

import RouteLink from "./RouteLink";

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
            <CardHeader key={k} title={<RouteLink id={k} small />} titleTypographyProps={{ variant: "body1" }} style={{ paddingBottom: 0 }} />
            <CardContent key={k} style={{ padding: 15 }}>
              {_.uniqWith(routeXfers[k], _.isEqual).map(d => {
                let matchedStops = _.uniqWith(xfers.filter(xf => _.findIndex(xf.routes, r => _.isEqual(r, d)) > -1), _.isEqual);
                let stopsByDistance = matchedStops.sort(
                  (a, b) =>
                    distance(coords, { type: "Point", coordinates: [a.stopLon, a.stopLat] }) -
                    distance(coords, { type: "Point", coordinates: [b.stopLon, b.stopLat] })
                );
                return (
                  <div key={`${k}-${d.direction}`} style={{ marginBottom: 5 }}>
                    <Chip label={_.capitalize(d.direction)} display="inline" />
                    <Typography variant="body2" display="inline" style={{ marginLeft: 10 }}>
                      <Link to={`/stop/${stopsByDistance[0].stopId}`}>{stopsByDistance[0].stopName}</Link>
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
