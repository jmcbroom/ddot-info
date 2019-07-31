import React from "react";
import { Card, CardContent } from "@material-ui/core";
import { SwapHoriz } from "@material-ui/icons";

import StopLink from "./StopLink";
import BusStop from "./BusStop";

const RouteStopList = ({ route, longTrip }) => {
  const cardStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "top",
    borderBottom: "1px solid #aaa",
    fontSize: "1.25rem",
    paddingTop: "1rem",
    paddingBottom: "1rem",
    width: "100%"
  };

  return (
    <Card>
      <CardContent>
        <div style={cardStyle}>
          <div style={{ width: "50%", marginLeft: "1rem", display: "flex", alignItems: "center" }}>
            <BusStop />
            <span style={{ display: "block", marginLeft: ".5em" }}>Bus stops</span>
          </div>
          <div style={{ width: "50%", marginLeft: "1rem", display: "flex", alignItems: "center" }}>
            <SwapHoriz />
            <span style={{ display: "block", marginLeft: ".5em" }}>Transfers</span>
          </div>
        </div>
        <div style={{ height: "60vh", overflowY: "scroll", WebkitOverflowScrolling: "touch" }}>
          {longTrip.stopTimes.map(st => (
            <div style={{ display: "flex", alignItems: "center", zIndex: 0 }} key={st.stop.stopId}>
              <StopLink stop={st.stop} color={route.color} isTimepoint={st.timepoint ? true : false} showTransfers showBorder />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RouteStopList;
