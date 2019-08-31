import React from "react";
import { Link } from "gatsby";
import _ from 'lodash';
import { Card, CardHeader, CardContent } from "@material-ui/core";
import { Timeline } from "@material-ui/icons";
import routes from "../data/routes";
import BusStop from "./BusStop";

const StopCard = ({ stopId, stopName, stopRoutes }) => {
  return (<Card component={Link} to={`/stop/${stopId}`} style={{ background: "#eee", padding: 5, minWidth: 250, textDecoration: 'none' }}>

    {/* <CardHeader style={{ paddingBottom: 0 }} avatar={<BusStop style={{ height: "1em", width: "1em" }} />} title={<>
      <Link to={`/stop/${stopId}`} style={{ color: "black", fontSize: "1.2em" }}>
        <span>{stopName}</span>
      </Link>
      <div>
        <span style={{ background: "#ccc", padding: "4px 8px", fontSize: "1em", fontWeight: 700, color: "black" }}>#{stopId}</span>
      </div>
    </>} /> */}
    <CardHeader avatar={<BusStop />} title={stopName} titleTypographyProps={{variant: 'body1'}} subheader={`#${stopId}`} style={{padding: 10}}/>
    <CardContent style={{padding: 10}}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <Timeline style={{ marginRight: ".65em" }} />
        <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", marginTop: "-.5em" }}>
          {_.uniq(stopRoutes)
            .sort((a, b) => {
              return a - b;
            })
            .map((r, i) => {
              let rd = routes.filter(rd => rd.number === parseInt(r))[0];
              return (<Link to={`/route/${rd.number}`} key={i} style={{
                display: "flex",
                textDecoration: "none",
                alignItems: "center",
                fontWeight: 900,
                justifyContent: "center",
                width: "1.8em",
                height: "1.8em",
                color: "white",
                fontSize: "1em",
                backgroundColor: rd.color,
                border: `1px solid ${rd.color}`,
                borderRadius: rd.radius,
                marginRight: ".5em",
                marginTop: ".5em"
              }}>
                {r}
              </Link>);
            })}
        </div>
      </div>
    </CardContent>
  </Card>);
};

export default StopCard;