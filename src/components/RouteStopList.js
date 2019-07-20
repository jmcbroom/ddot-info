import React from "react";
import { Card, CardContent } from "@material-ui/core";
import { SwapHoriz } from "@material-ui/icons";

const RouteStopList = ({ route, longTrip }) => {
  console.log(longTrip);

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
            <SwapHoriz />
            <span style={{ display: "block", marginLeft: ".5em" }}>Bus stops</span>
          </div>
          <div style={{ width: "50%", marginLeft: "1rem", display: "flex", alignItems: "center" }}>
            <SwapHoriz />
            <span style={{ display: "block", marginLeft: ".5em" }}>Transfers</span>
          </div>
        </div>
        <div style={{ height: "60vh", overflowY: "scroll" }}>
          {longTrip.stopTimes.map(st => (
            <div style={{ display: "flex", alignItems: "center", zIndex: 0 }} key={st.stop.stopId}>
              {st.stop.stopDesc}
            </div>
          ))}

          {/* {filteredStops.length === 0
            ? `Loading...`
            : filteredStops.length > 0
            ? filteredStops.map((stop, i) => (
                <div style={{ display: "flex", alignItems: "center", zIndex: 0 }} key={i}>
                  <StopLink
                    id={stop.slice(5)}
                    exclude={this.props.routeNumber}
                    color={color}
                    isTimepoint={this.props.timepoints.indexOf(stop.slice(5)) > -1}
                    showTransfers
                    showBorder
                  />
                </div>
              ))
            : `Loading stops...`} */}
        </div>
      </CardContent>
    </Card>
  );
};

export default RouteStopList;
