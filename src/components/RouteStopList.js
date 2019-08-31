import { Card, CardContent } from "@material-ui/core";
import { SwapHoriz } from "@material-ui/icons";
import React from "react";

import BusStop from "./BusStop";
import StopLink from "./StopLink";

const RouteStopList = ({ route, longTrip, input }) => {
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

  let filteredStopTimes = longTrip.stopTimes;

  if (input !== ``) {
    filteredStopTimes = longTrip.stopTimes.filter(st => {
      return st.stop.stopName.indexOf(input) > -1 || st.stop.stopId.indexOf(input) > -1;
    });
  }

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
          {filteredStopTimes.map(st => (
            <div style={{ display: "flex", alignItems: "center", zIndex: 0 }} key={st.stop.stopId}>
              <StopLink stop={st.stop} route={route} color={route.color} isTimepoint={st.timepoint ? true : false} showTransfers showBorder />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RouteStopList;
