import React, { useState } from "react";
import _ from "lodash";

import { Card, CardHeader, CardContent, CardActions } from "@material-ui/core";
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
  textAlign: "center",
  verticalAlign: "center",
  letterSpacing: "-0.05rem",
  borderLeft: "1px solid #eee"
};

const StopRouteSchedule = ({ times, shapes, route }) => {
  let availableServices = _.uniq(times.map(t => t.trip).map(tr => tr.serviceId));
  let [currentService, setCurrentService] = useState(availableServices[0]);
  let serviceTimes = times.filter(t => t.trip.serviceId === currentService);
  let rd = routes.filter(rd => rd.number === parseInt(route))[0];

  return (
    <>
      <Card style={{ padding: 10, marginTop: 10 }}>
        <div style={{ marginLeft: "1em", textSize: ".5em" }} />
        {shapes.map(s => (
          <>
            <CardHeader
              avatar={<Schedule />}
              title={`${_.capitalize(s.direction)}`}
              titleTypographyProps={{ variant: "h6" }}
              subheader={` to ${rd.between[s.dir]}`}
              subheaderTypographyProps={{ variant: "subtitle2" }}
              style={{ padding: "10px 10px" }}
            />
            <CardContent style={{ margin: 0, padding: 10, fontFamily: "Inter", fontFeatureSettings: "'tnum' 1" }}>
              <div
                style={{
                  gridTemplateRows: `repeat(${Math.ceil(serviceTimes.filter(st => st.trip.directionId.toString() === s.dir).length / 5)}, 22px)`,
                  ...gridStyle
                }}
              >
                {serviceTimes
                  .filter(st => st.trip.directionId.toString() === s.dir)
                  .map((st, i) => (
                    <div
                      style={{
                        ...cellStyle,
                        borderLeft: i / serviceTimes.length < 0.2 ? `0px solid #eee` : `1.5px solid #eee`,
                        fontWeight: st.arrivalTime.hours >= 12 && st.arrivalTime.hours <= 23 ? 600 : 400
                      }}
                    >
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
        <CardActions disableSpacing>
          <ServicePicker services={availableServices} service={currentService} handleChange={setCurrentService} asRow />
        </CardActions>
      </Card>
    </>
  );
};

export default StopRouteSchedule;
