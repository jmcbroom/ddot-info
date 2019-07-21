import React, { useState } from "react";
import _ from "lodash";

import { Card, CardHeader, CardContent, GridList, GridListTile } from "@material-ui/core";
import { Schedule } from "@material-ui/icons";

import ServicePicker from "./ServicePicker";

const arrivalTimeDisplay = (time, showAp) => {
  let hour = time.hours;
  let minutes = time.minutes ? time.minutes.toString().padStart(2, "0") : "00";
  let ap = "am";

  // vary hours & am/pm based on what hour it is
  // gtfs has hours that are greater than 24
  if (time.hours < 12 && time.hours > 0) {
    hour = time.hours;
    ap = "am";
  } else if (time.hours > 12 && time.hours < 24) {
    hour = time.hours - 12;
    ap = "pm";
  } else if (time.hours % 12 === 0) {
    hour = 12;
    ap = time.hours === 12 ? "pm" : "am";
  } else if (time.hours >= 24) {
    hour = time.hours - 24;
    ap = "am";
  }

  return `${hour}:${minutes} ${showAp ? ap : ``}`;
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: `repeat(auto-fit, minmax(20px, 1fr))`,
  gridAutoFlow: 'column',
}

const cellStyle = {
  // fontFeatureSettings: "'tnum' 1",
  textAlign: "center",
  verticalAlign: "center",
  letterSpacing: "-0.25px",
  borderRight: "1px solid #ccc",
  paddingTop: ".25em"
}

const StopRouteSchedule = ({ times, shapes, route }) => {
  let availableServices = _.uniq(times.map(t => t.trip).map(tr => tr.serviceId));
  let [currentService, setCurrentService] = useState(availableServices[0]);
  let serviceTimes = times.filter(t => t.trip.serviceId === currentService);

  return (
    <>
      <Card style={{ padding: 10 }}>
      <ServicePicker services={availableServices} service={currentService} handleChange={setCurrentService} asRow />
      {shapes.map(s => (
        <>
          <div style={{ display: "flex", alignItems: "center", padding: 0 }}>
            <Schedule style={{ marginLeft: ".5em", color: "#aaa", borderRadius: 999, height: "1.25em", width: "1.25em" }} />
            <CardHeader title={_.capitalize(s.direction)} subheader={`to ${route.between[s.dir]}`} style={{ padding: 10, marginLeft: 10 }} />
          </div>
          <CardContent>
            <div style={{gridTemplateRows: `repeat(${Math.ceil(serviceTimes.filter(st => st.trip.directionId.toString() === s.dir).length/7)}, 20px)`, ...gridStyle}}>
              {serviceTimes.filter(st => st.trip.directionId.toString() === s.dir).map(st => (
                <div style={cellStyle}>{arrivalTimeDisplay(st.arrivalTime, false)}</div>
              ))}
            </div>
          </CardContent>
          </>
      ))}
      </Card>
    </>
  );
};

export default StopRouteSchedule;
