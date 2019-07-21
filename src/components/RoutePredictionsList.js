import React, { useState, useEffect } from 'react';
import moment from 'moment';
import _ from 'lodash';
import { Card, List, ListItem, ListItemIcon, ListItemText} from '@material-ui/core';
import { Schedule, SpeakerPhone } from '@material-ui/icons';
import Helpers from '../helpers';

const RoutePredictionsList = ({ stop, trips, route, currentTrip, handleChange }) => {

  let [predictions, setPredictions] = useState([])

  console.log(route)

  useEffect(() => {
    const url = `${Helpers.endpoint}/arrivals-and-departures-for-stop/DDOT_${stop}.json?key=BETA&includePolylines=false`;
    fetch(url)
      .then(r => r.json())
      .then(d => {

        let tripAdded = d.data.entry.arrivalsAndDepartures.map(dp => {
          let filteredTrip = trips.filter(tr => dp.tripId.indexOf(tr.tripId) > -1)[0]
          return {
            trip: filteredTrip,
            ...dp
          }
        })
        console.log(tripAdded)
        setPredictions(tripAdded)
      });
  }, []);


  let matchedPredictions = predictions.filter(pr => pr.routeId.indexOf(route.rt_id.toString()) > -1)
  return (
    <Card style={{ margin:'0px 0px 10px 0px' }}>
      <List style={{ paddingTop: 0 }}>
        {matchedPredictions.length > 0 ? matchedPredictions.map((p, i) => (
          <ListItem button key={p.tripId}>
            <ListItemIcon>
              {p.predicted ? <Schedule /> : <SpeakerPhone /> }
            </ListItemIcon>
            <ListItemText secondary={p.directionId} primary={`${p.predicted ? moment(p.predictedArrivalTime).format('h:mma') : moment(p.scheduledArrivalTime).format('h:mma')}`} />
          </ListItem>
        )) : `No predictions`}

        
        {/* {predictions.length > 0 ? Helpers.cleanPredictionHeadsign(predictions).map((p, i) => (
          <div key={i}>
            <ListItem button key={p.tripId} onClick={this.handleClick(p.tripId)} style={{ background: '#fff' }} >
              <ListItemIcon>
                {p.predicted ? <LiveSVG /> : <SchedSVG />}
              </ListItemIcon>
              <ListItemText style={{ fontWeight: this.state.open === p.tripId ? 700 : 300 }} secondary={_.capitalize(p.tripHeadsign)} primary={`${p.predicted ? moment(p.predictedArrivalTime).format('h:mma') : moment(p.scheduledArrivalTime).format('h:mma')}`} />
              <ListItemIcon>
                {this.state.open === p.tripId ? 
                  <span style={{ display: 'flex', alignItems: 'center', fontSize: '.9em' }}>Showing live map<ExpandLess /></span> 
                  : <span style={{ display: 'flex', alignItems: 'center', fontSize: '.9em' }}>{ i === 0 && !this.state.open ? `Where is this bus?` : null}<ExpandMore /></span>}
              </ListItemIcon>
            </ListItem>
            <Collapse in={this.state.open === p.tripId && this.props.isOpen} style={{ marginBottom: '.5em' }} timeout="auto" unmountOnExit>
              <RealtimeCard trip={p.tripId} stop={this.props.stop} status={p} route={this.props.route}/>
            </Collapse>
        </div>
          )) : <Card><CardContent style={{ padding: '1em' }}>There are currently no real-time predictions available, see the schedule below.</CardContent></Card>} */}
      </List>
    </Card>
  )
}

export default RoutePredictionsList;