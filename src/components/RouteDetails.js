import React from "react";
import _ from "lodash";
import { Card, CardContent, CardHeader } from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import routes from "../data/routes";
import RouteBadge from "./RouteBadge";

/** General service info about a route within BusRoute */
const RouteDetails = ({ id }) => {
  const obj = _.filter(routes, r => {
    return id === r.number.toString();
  })[0];

  return (
    <div style={{gridArea: "details"}}>
    <Card>
      <CardContent>{obj.description}</CardContent>
      {["Monday-Friday", "Saturday", "Sunday/Holiday"].map((d, i) => (
        <div key={i}>
          {obj.services[d] ? (
            <>
              <Divider />
              <Card key={i}>
                <CardHeader
                  title={d}
                  subheader={
                    obj.services[d].service_hours.length === 1
                      ? `${obj.services[d].service_hours[0]} (see schedule for all times)`
                      : `${obj.services[d].service_hours[0]} - ${obj.services[d].service_hours[1]} (see schedule for all times)`
                  }
                />
                <CardContent>
                  <table style={{ width: "100%" }}>
                    <tbody>
                      {obj.services[d].frequency.map((f, i) => (
                        <tr key={i}>
                          <td style={{ padding: ".5rem", backgroundColor: "#eee", width: "50%" }}>{_.capitalize(f[0])}</td>
                          <td style={{ padding: ".5rem", backgroundColor: "#eee", width: "50%" }}>
                            Every{" "}
                            <span>
                              <b>{f[1]}</b>
                            </span>{" "}
                            minutes
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card key={i}>
              <CardHeader title={d} subheader="No service" />
            </Card>
          )}
        </div>
      ))}
    </Card>
    </div>
  );
};

export default RouteDetails;
