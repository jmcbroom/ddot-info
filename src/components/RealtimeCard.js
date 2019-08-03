import React from "react";
import moment from "moment";

import { Link } from "gatsby";
import { Card, CardContent, Typography, List, ListItem, ListItemAvatar, ListItemText } from "@material-ui/core";
import { DirectionsBus, SpeakerPhone, Schedule, Warning } from "@material-ui/icons";
import BusStop from "./BusStop";

const styles = {
  prediction: {
    display: "flex",
    alignItems: "center",
    opacity: "0.6",
    marginTop: ".5em"
  },
  predictionIcon: {
    marginRight: ".25em",
    width: "1em"
  },
  ahead: {
    color: "darkgreen",
    fontWeight: 700,
    paddingLeft: ".25em"
  },
  behind: {
    color: "darkred",
    fontWeight: 700,
    paddingLeft: ".25em"
  }
};

const computeTimeAway = prediction => {
  if (prediction.tripStatus.predicted) {
    return Math.ceil((prediction.predictedArrivalTime - moment()) / 60000);
  } else {
    return Math.ceil((prediction.scheduledArrivalTime - moment()) / 60000);
  }
};

const RealtimeCard = ({ prediction, references }) => {
  let nextStopId = prediction.tripStatus.nextStop.slice(5);

  let defaultStop = {
    name: ``
  };

  let nextStop = references.stops.filter(s => s.id === prediction.tripStatus.nextStop)[0] || defaultStop;

  let arrivalText = prediction.tripStatus.predicted ? `Arrives here` : `Scheduled to arrive`;

  return (
    <Card style={{ padding: 0 }}>
      <CardContent style={{ padding: 0 }}>
        <List>
          <ListItem>
            <ListItemAvatar>
              <DirectionsBus />
            </ListItemAvatar>
            <ListItemText primary={arrivalText} />
          </ListItem>
          <ListItem>
            <ListItemAvatar>
              <BusStop />
            </ListItemAvatar>
          </ListItem>
          <ListItem>
            <ListItemAvatar>
              <SpeakerPhone />
            </ListItemAvatar>
          </ListItem>
        </List>
        {/* {prediction.tripStatus.activeTripId === prediction.tripId ? (
          <div style={{ display: "flex", alignItems: "center" }}>
            <DirectionsBus style={{ height: 20, width: 20, borderRadius: 9999, background: "rgba(0,0,0,.75)", padding: 2.5, color: "white" }} />
            <div style={{ marginLeft: ".5em" }}>
              {prediction.tripStatus.predicted ? `Arrives here` : `Scheduled to arrive`}
              <span style={{ fontWeight: 700, paddingLeft: ".25em" }}>
                {computeTimeAway(prediction) > 0 ? `in ${computeTimeAway(prediction)} minutes` : `${Math.abs(computeTimeAway(prediction))} minutes ago`}
              </span>
            </div>
          </div>
        ) : (
          <div style={styles.prediction}>
            <Warning style={styles.predictionIcon} />
            This bus is still finishing another trip and will turn around.
          </div>
        )} */}
        {/* <Typography>
          <DirectionsBus style={{ height: 20, width: 20, borderRadius: 9999, background: "rgba(0,0,0,.75)", padding: 2.5, color: "white" }} />
          {prediction.tripStatus.predicted ? `Arrives here` : `Scheduled to arrive`}
        </Typography>
        <Typography>
          <SpeakerPhone style={{ height: 20, width: 20, borderRadius: 9999, background: "rgba(0,0,0,.75)", padding: 2.5, color: "white" }} />
        </Typography>
        <Typography>
          <BusStop style={{ height: 20, width: 20, borderRadius: 9999, background: "rgba(0,0,0,.75)", padding: 2.5, color: "white" }} />
        </Typography> */}
        {/* <div style={{ marginTop: '.5em', display: 'flex', alignItems: 'center' }}>
          <BusStop style={{ height: 20, width: 20, borderRadius: 9999, background: 'rgba(0,0,0,.75)', padding: 2.5, color: 'white' }} />
          <span style={{ marginLeft: '.5em' }}>Now near</span>
          <Link 
            style={{ fontSize: '1em', color: '#000', fontWeight: 300, padding: '0px 5px 0px 5px' }} 
            to={`/stop/${nextStopId}/`}>
            <span style={{fontWeight: 700}}>{nextStop.name}</span>
          </Link>
          <span style={{ background: '#eee', padding: '.25em', display: 'inline-block' }}>#{nextStopId}</span>
        </div> */}
        {/* {prediction.tripStatus.predicted ? (
          <div style={styles.prediction}>
            <SpeakerPhone style={{ height: 20, width: 20, borderRadius: 9999, padding: 2.5 }} />
            <div style={{ marginLeft: ".5em" }}>
              Real-time location
              {prediction.tripStatus.predicted ? (
                <span style={prediction.tripStatus.scheduleDeviation > 0 ? styles.behind : styles.ahead}>
                  {prediction.tripStatus.scheduleDeviation === 0
                    ? `on time`
                    : `${Math.abs(prediction.tripStatus.scheduleDeviation / 60)} min ${prediction.tripStatus.scheduleDeviation >= 0 ? " late" : " early"}`}
                </span>
              ) : (
                ``
              )}
            </div>
          </div>
        ) : (
          <div style={styles.prediction}>
            <Schedule style={{ height: 20, width: 20, borderRadius: 9999, padding: 2.5 }} />
            <div style={{ marginLeft: ".5em" }}>Scheduled location</div>
          </div>
        )} */}
      </CardContent>
    </Card>
  );
};

export default RealtimeCard;
