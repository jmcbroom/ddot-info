import React from "react";
import _ from "lodash";
import { Card, CardHeader, CardContent, Typography, List, Chip, ListItem, ListItemAvatar } from "@material-ui/core";
import RouteLink from "./RouteLink";
import { Link } from "gatsby";
import routes from "../data/routes";

const StopTransfers = ({ xfers, title }) => {
  // let routeXfers = _.groupBy(_.flatten(_.uniqWith(xfers.map(x => x.routes), _.isEqual));

  console.log(xfers)

  let routeXfers = _(xfers.map(x => x.routes))
    .uniqWith(_.isEqual)
    .flatten()
    .groupBy("short")
    .value();

  console.log(routeXfers);

  return (
    <Card>
      <CardHeader title={title} titleTypographyProps={{ variant: "h6" }} style={{ paddingBottom: 0 }} />
      {Object.keys(routeXfers).map(k => {
        let rd = routes.filter(rt => rt.number === parseInt(k))[0];
        return (
          <>
            <CardHeader title={<RouteLink id={k} small />} titleTypographyProps={{ variant: "body1" }} style={{ paddingBottom: 0 }} />
            <CardContent style={{ padding: 15 }}>
              {_.uniqWith(routeXfers[k], _.isEqual).map(d => {
                let matchedStops = _.uniqWith(xfers.filter(xf => _.findIndex(xf.routes, r => _.isEqual(r, d)) > -1), _.isEqual);
                return (
                  <div style={{ marginBottom: 5 }}>
                    <Chip label={_.capitalize(d.direction)} display="inline" />
                    {matchedStops.slice(0, 1).map(ms => (
                      <Typography variant="body2" display="inline" style={{ marginLeft: 10 }}>
                        <Link to={`/stop/${ms.stopId}`}>{ms.stopDesc}</Link>
                      </Typography>
                    ))}
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
