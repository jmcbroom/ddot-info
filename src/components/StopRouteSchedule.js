import React, { useState } from "react";
import _ from "lodash";

import { Card, CardHeader, CardContent, GridList, GridListTile } from "@material-ui/core";
import { Schedule } from "@material-ui/icons";

import { makeStyles } from "@material-ui/core/styles";
import ServicePicker from "./ServicePicker";

const useStyles = makeStyles(theme => ({
  gridList: {
    flexFlow: "column wrap",
    maxHeight: 500,
    width: "100%"
  },
  gridListTile: {
    maxWidth: 60,
    fontFeatureSettings: "'tnum' 1",
    textAlign: "center",
    verticalAlign: "center",
    letterSpacing: "-0.25px",
    borderRight: "1px solid #ccc",
    paddingTop: ".25em"
  }
}));

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

const StopRouteSchedule = ({ times, shapes, route }) => {
  const classes = useStyles();
  let availableServices = _.uniq(times.map(t => t.trip).map(tr => tr.serviceId));
  let [currentService, setCurrentService] = useState(availableServices[0]);
  let serviceTimes = times.filter(t => t.trip.serviceId === currentService);

  return (
    <>
      <ServicePicker services={availableServices} service={currentService} handleChange={setCurrentService} asRow />
      {shapes.map(s => (
        <Card style={{ padding: 10 }}>
          <div style={{ display: "flex", alignItems: "center", padding: 0 }}>
            <Schedule style={{ marginLeft: ".5em", color: "#aaa", borderRadius: 999, height: "1.25em", width: "1.25em" }} />
            <CardHeader title={_.capitalize(s.direction)} subheader={`to ${route.between[s.dir]}`} style={{ padding: 10, marginLeft: 10 }} />
          </div>
          <CardContent>
            <GridList
              className={classes.gridList}
              cellHeight={18}
            >
              {serviceTimes.filter(st => st.trip.directionId.toString() === s.dir).map((t, i) => (
                <GridListTile
                  key={t.tripId}
                  cols={1}
                  className={classes.gridListTile}
                >
                  <span>{arrivalTimeDisplay(t.arrivalTime, true)}</span>
                </GridListTile>
              ))}
            </GridList>
          </CardContent>
        </Card>
      ))}
    </>
  );
};

export default StopRouteSchedule;
