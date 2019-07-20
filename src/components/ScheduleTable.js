import React from 'react';
import { Link } from 'gatsby';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import { KeyboardArrowRight } from '@material-ui/icons';

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
  } else if (time.hours === 24) {
    hour = 12;
    ap = "am";
  } else if (time.hours >= 24) {
    hour = time.hours - 24;
    ap = "am";
  }

  return `${hour}:${minutes} ${ap}`;
};

/** Schedule table for RouteSchedule */
const ScheduleTable = ({ trips, color }) => {

  const mostTimepointsTrip = trips.sort((a, b) => {
    return (
      b.stopTimes.length -
      a.stopTimes.length
    );
  })[0];

  const timepoints = mostTimepointsTrip.stopTimes

    return (
      <div style={{ overflow: 'auto', maxHeight: 500, backgroundColor: 'white' }}>
        <Table>
          <TableHead>
            <TableRow>
              {timepoints.map((s, k) => (
                <TableCell
                key={s.stop.stopId}
                style={{ borderBottom: '0', padding: 0 }}>
                  <div style={{ borderBottom: '0', height: '50px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', padding: '.2em .5em' }}>
                    <Link style={{ fontSize: '1.1em', color: 'black', fontWeight: 700 }} to={`/stop/${s.stop.stopId}/`}  >
                      {s.stop.stopDesc || s.stop.stopName}
                    </Link>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '11px', height: '8px', right: k === 0 ? 0 : null, width: k === 0 || k + 1 === timepoints.length ? '50%' : '100%', backgroundColor: `#${color}`, verticalAlign: 'center' }}></div>
                    <KeyboardArrowRight style={{ color: 'white', backgroundColor: '#000', height: '24px', width: '24px', borderRadius: '2em', border: '3px solid #fff', margin: 'auto', verticalAlign: 'center', zIndex: '200' }} />
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
                  console.log(t, tp)
                  let filtered = t.stopTimes.filter(
                    st => {
                      return st.stop.stopId === tp.stop.stopId;
                    }
                  );
                  if (filtered.length === 0) {
                    return <TableCell>-</TableCell>;
                  } else {
                    return (
                      <TableCell key={tp.stop.stopId}>
                        {arrivalTimeDisplay(filtered[0].arrivalTime)}
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
  }

export default ScheduleTable;
