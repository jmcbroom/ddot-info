import { Card, CardContent, List, ListItem, ListItemAvatar, ListItemText } from "@material-ui/core";
import { Schedule, SpeakerPhone } from "@material-ui/icons";
import moment from "moment";
import React from "react";

import BusStop from "./BusStop";

const computeTimeAway = prediction => {
  if (prediction.tripStatus.predicted) {
    return Math.ceil((prediction.predictedArrivalTime - moment()) / 60000);
  } else {
    return Math.ceil((prediction.scheduledArrivalTime - moment()) / 60000);
  }
};

const arrivalText = prediction => {
  let elements = [];
  elements.push(prediction.tripStatus.predicted ? `Arrives here` : `Scheduled to arrive`);
  let minsAway = computeTimeAway(prediction);

  if (minsAway < 0 && prediction.tripStatus.predicted) {
    return `Arrived ${Math.abs(computeTimeAway(prediction))} minutes ago`;
  }
  if (minsAway === 0) {
    return `Arriving now`;
  }
  if (minsAway > 0 && prediction.tripStatus.predicted) {
    return `Arrives here in ${computeTimeAway(prediction)} minutes`;
  }
  if (minsAway > 0 && !prediction.tripStatus.predicted) {
    return `Scheduled to arrive in ${computeTimeAway(prediction)} minutes`;
  }
};

const computeOnTime = prediction => {
  if (!prediction.tripStatus.predicted) {
    return `Showing scheduled time`;
  }
  let deviation = prediction.tripStatus.scheduleDeviation;
  if (deviation === 0) {
    return `on time`;
  }
  if (deviation > 0) {
    return `${Math.abs(deviation / 60)} ${Math.abs(deviation / 60) ? `minutes` : `minute`} late`;
  }
  if (deviation < 0) {
    return `${Math.abs(deviation / 60)} ${Math.abs(deviation / 60) ? `minutes` : `minute`} early`;
  }
};

const RealtimeCard = ({ prediction, references }) => {
  let defaultStop = {
    name: ``
  };

  let nextStop = references.stops.filter(s => s.id === prediction.tripStatus.nextStop)[0] || defaultStop;

  return (
    <Card elevation={0}>
      <CardContent style={{ padding: 0 }}>
        <List>
          <ListItem>
            <ListItemAvatar>
              <BusStop />
            </ListItemAvatar>
            <ListItemText primary={`Next stop: ${nextStop.name}`} secondary={arrivalText(prediction)} color="red" />
          </ListItem>
          <ListItem>
            <ListItemAvatar>{prediction.tripStatus.predicted ? <SpeakerPhone /> : <Schedule />}</ListItemAvatar>
            <ListItemText primary={computeOnTime(prediction)} />
          </ListItem>
        </List>
      </CardContent>
    </Card>
  );
};

export default RealtimeCard;
