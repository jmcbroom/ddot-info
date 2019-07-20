import React from "react";
import { Link } from "gatsby";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import { KeyboardArrowRight } from "@material-ui/icons";
import { withStyles } from "@material-ui/styles";

// attempting a fixedHeader like this: https://codesandbox.io/s/k0vwm7xpl3
const styles = theme => ({
  head: {
    position: "sticky",
    top: 0,
    backgroundColor: "white"
  }
});

const arrivalTimeDisplay = (time, showAp) => {
  let hour = time.hours;
  let minutes = time.minutes ? time.minutes.toString().padStart(2, "0") : "00";
  let ap = "am";

  // vary hours & am/pm based on what hour it is
  // gtfs has hours that are greater than 24
  if (time.hours < 12 && time.hours > 0) {
    hour = time.hours;
    ap = "am";
  }  else if (time.hours > 12 && time.hours < 24) {
    hour = time.hours - 12;
    ap = "pm";
  } else if (time.hours % 12 === 0) {
    hour = 12;
    ap = time.hours === 12 ? 'pm' : 'am';
  } else if (time.hours >= 24) {
    hour = time.hours - 24;
    ap = "am";
  }

  return `${hour}:${minutes} ${ap}`;
};

/** Schedule table for RouteSchedule */
const ScheduleTable = ({ trips, color, classes }) => {
  const mostTimepointsTrip = trips.sort((a, b) => {
    return b.stopTimes.length - a.stopTimes.length;
  })[0];

  const timepoints = mostTimepointsTrip.stopTimes;

  return (
    <div style={{ overflow: "auto", backgroundColor: "white", maxHeight: 700 }}>
      <Table>
        <TableHead>
          <TableRow>
            {timepoints.map((s, k) => (
              <TableCell key={s.stop.stopId} className={classes.head} style={{ padding: 0, textAlign: "center", width: 120 }}>
                <div
                  style={{
                    borderBottom: "0",
                    height: 60,
                    lineHeight: "1.25em",
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "center",
                    padding: 3,
                    minWidth: 100
                  }}
                >
                  <Link style={{ fontSize: "1.1em", color: "black", fontWeight: 700 }} to={`/stop/${s.stop.stopId}/`}>
                    {s.stop.stopDesc || s.stop.stopName}
                  </Link>
                </div>
                <div style={{ display: "flex", flexDirection: "column", position: "relative" }}>
                  <div
                    style={{
                      position: "absolute",
                      top: "11px",
                      height: "8px",
                      right: k === 0 ? 0 : null,
                      width: k === 0 || k + 1 === timepoints.length ? "50%" : "100%",
                      backgroundColor: `#${color}`,
                      verticalAlign: "center"
                    }}
                  />
                  <KeyboardArrowRight
                    style={{
                      color: "white",
                      backgroundColor: "#000",
                      height: "24px",
                      width: "24px",
                      borderRadius: "2em",
                      border: "3px solid #fff",
                      margin: "auto",
                      verticalAlign: "center",
                      zIndex: "200"
                    }}
                  />
                </div>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {trips.map((t, i) => (
            <TableRow>
              {/* Iterate over the timepoints and filter the current trip's timepoints for a match.  */}
              {timepoints.map((tp, j) => {
                console.log(t, tp);
                let filtered = t.stopTimes.filter(st => {
                  return st.stop.stopId === tp.stop.stopId;
                });
                if (filtered.length === 0) {
                  return (
                    <TableCell
                      style={{
                        borderBottom: (i + 1) % 5 === 0 ? `2px solid #${color}` : 0,
                        borderRight: "1px solid #ccc",
                        background: 'rgba(0,0,0,0.03)',
                        textAlign: "center",
                        padding: 2,
                      }}
                    >
                      -
                    </TableCell>
                  );
                } else {
                  return (
                    <TableCell
                      style={{
                        borderBottom: (i + 1) % 5 === 0 ? `2px solid #${color}` : 0,
                        borderRight: "1px solid #ccc",
                        textAlign: "center",
                        padding: 2,
                        fontWeight: arrivalTimeDisplay(filtered[0].arrivalTime).indexOf("p") > -1 ? 700 : 500
                      }}
                      key={tp.stop.stopId}
                    >
                      {arrivalTimeDisplay(filtered[0].arrivalTime).slice(0, -3)}
                    </TableCell>
                  );
                }
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default withStyles(styles)(ScheduleTable);
