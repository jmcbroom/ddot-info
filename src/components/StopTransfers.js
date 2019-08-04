import React from "react";
import _ from "lodash";
import { Card, CardHeader, CardContent, Typography, Chip } from "@material-ui/core";
import RouteLink from "./RouteLink";
import RouteBadge from "./RouteBadge";
import routes from "../data/routes";

const StopTransfers = ({ xfers }) => {
  // let routeXfers = _.groupBy(_.flatten(_.uniqWith(xfers.map(x => x.routes), _.isEqual));

  let routeXfers = _(xfers.map(x => x.routes))
    .uniqWith(_.isEqual)
    .flatten()
    .groupBy("short")
    .value();

  console.log(routeXfers);

  return (
    <Card style={{ marginTop: 10 }}>
      <CardHeader title={`Nearby transfers`} titleTypographyProps={{ variant: "h6" }} style={{ paddingBottom: 0 }} />
      {Object.keys(routeXfers).map(k => {
        let rd = routes.filter(rt => rt.number === parseInt(k))[0];

        return (
          <>
            <CardHeader title={rd.name} titleTypographyProps={{ variant: "subtitle1" }} avatar={<RouteBadge id={k} />} style={{ paddingBottom: 0 }} />
            <CardContent>
              {routeXfers[k].map(d => {
                console.log(xfers.filter(xf => xf.routes.indexOf(routeXfers[k]) > -1));
                return <Typography>{_.capitalize(d.direction)}</Typography>;
              })}
            </CardContent>
          </>
        );
      })}
    </Card>
  );
};

export default StopTransfers;
