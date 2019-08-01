import React, { useState, useEffect } from "react";
import moment from "moment";
import { Card, CardContent, List, ListItem, ListItemIcon, ListItemText, Collapse, Typography } from "@material-ui/core";
import { Schedule, SpeakerPhone, KeyboardArrowDown, KeyboardArrowRight } from "@material-ui/icons";
import Helpers from "../helpers";
import routes from "../data/routes";

import RealtimeCard from "./RealtimeCard";

const RoutePredictionsList = ({ stop, trips, route, currentTrip, handleChange, predictions, setPredictions }) => {
  const [now, setNow] = useState(new Date());
  let [references, setReferences] = useState([]);

  let rd = routes.filter(rd => rd.number === parseInt(route))[0];

  useEffect(() => {
    let tick = setInterval(() => {
      setNow(new Date());
    }, 5000);
    return () => clearInterval(tick);
  }, []);

  useEffect(() => {
    const url = `${Helpers.endpoint}/arrivals-and-departures-for-stop/DDOT_${stop}.json?key=BETA&includePolylines=false`;
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
  }, [now]);

  let matchedPredictions = predictions.filter(pr => pr.routeId.indexOf(rd.rt_id.toString()) > -1);

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
                  {currentTrip === p.tripId ? (
                    <span style={{ display: "flex", alignItems: "center", fontSize: ".9em" }}>
                      Showing live map
                      <KeyboardArrowDown />
                    </span>
                  ) : (
                    <span style={{ display: "flex", alignItems: "center", fontSize: ".9em" }}>
                      {i === 0 && currentTrip !== p.tripId ? `Where is this bus?` : null}
                      <KeyboardArrowRight />
                    </span>
                  )}
                </ListItemIcon>
              </ListItem>
              <Collapse in={currentTrip === p.tripId} timeout="auto" unmountOnExit>
                <RealtimeCard prediction={p} references={references} />
              </Collapse>
            </>
          ))
        ) : (
          <CardContent>
            <Typography variant="subtitle1">There are currently no real-time predictions available.</Typography>
            <Typography variant="subtitle1">There are currently no real-time predictions available.</Typography>
          </CardContent>
        )}
      </List>
    </Card>
  );
};

export default RoutePredictionsList;
