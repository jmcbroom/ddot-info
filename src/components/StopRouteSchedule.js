import React, { useState } from "react";
import _ from "lodash";

import { Card, CardHeader, CardContent } from "@material-ui/core";
import { Schedule } from "@material-ui/icons";

import ServicePicker from "./ServicePicker";
import routes from "../data/routes";

const arrivalTimeDisplay = (time, showAp) => {
  let hour = time.hours;
  let minutes = time.minutes ? time.minutes.toString().padStart(2, "0") : "00";
  let ap = "a";

  // vary hours & am/pm based on what hour it is
  // gtfs has hours that are greater than 24
  if (time.hours < 12 && time.hours > 0) {
    hour = time.hours;
    ap = "a";
  } else if (time.hours > 12 && time.hours < 24) {
    hour = time.hours - 12;
    ap = "p";
  } else if (time.hours % 12 === 0) {
    hour = 12;
    ap = time.hours === 12 ? "p" : "a";
  } else if (time.hours >= 24) {
    hour = time.hours - 24;
    ap = "a";
  }

  return `${hour}:${minutes}${showAp ? ap : ``}`;
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: `repeat(auto-fit, minmax(50px, 1fr))`,
  gridAutoFlow: "column",
  maxWidth: 400
};

const cellStyle = {
  textAlign: "right",
  verticalAlign: "center",
  letterSpacing: "-0.05rem",
  borderLeft: "1px solid #ccc",
  paddingRight: 8
};

const StopRouteSchedule = ({ times, shapes, route }) => {
  let availableServices = _.uniq(times.map(t => t.trip).map(tr => tr.serviceId));
  let [currentService, setCurrentService] = useState(availableServices[0]);
  let serviceTimes = times.filter(t => t.trip.serviceId === currentService);
  let rd = routes.filter(rd => rd.number === parseInt(route))[0];

  return (
    <>
      <Card style={{ padding: 10 }}>
        <div style={{ marginLeft: "1em", textSize: ".5em" }} />
        {shapes.map(s => (
          <>
            <div style={{ display: "flex", alignItems: "center", padding: 0 }}>
              <Schedule
                style={{
                  marginLeft: ".5em",
                  color: "#aaa",
                  borderRadius: 999,
                  height: "1.25em",
                  width: "1.25em"
                }}
              />
              <CardHeader title={_.capitalize(s.direction)} subheader={`to ${rd.between[s.dir]}`} style={{ padding: 10, marginLeft: 10 }} />
            </div>
            <CardContent style={{ margin: 0, padding: 0, fontFamily: "Inter", fontFeatureSettings: "'tnum' 1" }}>
              <div
                style={{
                  gridTemplateRows: `repeat(${Math.ceil(serviceTimes.filter(st => st.trip.directionId.toString() === s.dir).length / 5)}, 22px)`,
                  ...gridStyle
                }}
              >
                {serviceTimes
                  .filter(st => st.trip.directionId.toString() === s.dir)
                  .map((st, i) => (
                    <div style={{ ...cellStyle, borderLeft: i/serviceTimes.length < 0.2 ? `0px solid #ccc` : `1.5px solid #ccc`, fontWeight: st.arrivalTime.hours >= 12 && st.arrivalTime.hours <= 23 ? 600 : 400 }}>
                      {arrivalTimeDisplay(
                        st.arrivalTime,
                        i === 0 || i === serviceTimes.length - 1 || (st.arrivalTime.hours === 12 && serviceTimes[i - 1].arrivalTime.hours === 11) ? true : false
                      )}
                    </div>
                  ))}
              </div>
            </CardContent>
          </>
        ))}
        <ServicePicker services={availableServices} service={currentService} handleChange={setCurrentService} asRow />
      </Card>
    </>
  );
};

export default StopRouteSchedule;
