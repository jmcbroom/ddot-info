import React, { useState, useEffect } from "react";
import moment from "moment";
import { Card, CardContent, List, ListItem, ListItemIcon, ListItemText, Collapse } from "@material-ui/core";
import { Schedule, SpeakerPhone, KeyboardArrowDown, KeyboardArrowRight } from "@material-ui/icons";
import Helpers from "../helpers";

import RealtimeCard from "./RealtimeCard";

const RoutePredictionsList = ({ stop, trips, route, currentTrip, handleChange }) => {
  let [predictions, setPredictions] = useState([]);
  let [references, setReferences] = useState([]);

  useEffect(() => {
    const url = `${
      Helpers.endpoint
    }/arrivals-and-departures-for-stop/DDOT_${stop}.json?key=BETA&includePolylines=false`;
    fetch(url)
      .then(r => r.json())
      .then(d => {
        console.log(d);
        let tripAdded = d.data.entry.arrivalsAndDepartures.map(dp => {
          let filteredTrip = trips.filter(tr => dp.tripId.indexOf(tr.tripId) > -1)[0];
          return {
            trip: filteredTrip,
            ...dp
          };
        });
        setPredictions(tripAdded);
        setReferences(d.data.references);
      });
  }, []);

  let matchedPredictions = predictions.filter(pr => pr.routeId.indexOf(route.rt_id.toString()) > -1);
  return (
    <Card style={{ margin: "0px 0px 10px 0px" }}>
      <List style={{ paddingTop: 0 }}>
        {matchedPredictions.length > 0 ? (
          matchedPredictions.map((p, i) => (
            <>
              <ListItem button key={p.tripId} onClick={() => (currentTrip === p.tripId ? handleChange(null) : handleChange(p.tripId))}>
                <ListItemIcon>{p.predicted ? <SpeakerPhone /> : <Schedule />}</ListItemIcon>
                <ListItemText
                  secondary={p.directionId}
                  primary={`${p.predicted ? moment(p.predictedArrivalTime).format("h:mma") : moment(p.scheduledArrivalTime).format("h:mma")}`}
                />
                <ListItemIcon>
                  {currentTrip === p.tripId ? 
                    <span style={{ display: 'flex', alignItems: 'center', fontSize: '.9em' }}>Showing live map<KeyboardArrowDown /></span> 
                    : <span style={{ display: 'flex', alignItems: 'center', fontSize: '.9em' }}>{ i === 0 && currentTrip !== p.tripId ? `Where is this bus?` : null}<KeyboardArrowRight /></span>}
                </ListItemIcon>
              </ListItem>
              <Collapse in={currentTrip === p.tripId} timeout="auto" unmountOnExit>
                <RealtimeCard prediction={p} references={references} />
              </Collapse>
            </>
          ))
        ) : (
          <Card>
            <CardContent style={{ padding: "1em" }}>There are currently no real-time predictions available, see the schedule below.</CardContent>
          </Card>
        )}
      </List>
    </Card>
  );
};

export default RoutePredictionsList;
