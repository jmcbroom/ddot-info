import React, { useState } from 'react';

import { List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { Card, CardHeader, CardContent } from '@material-ui/core';
import { AccessAlarm, DirectionsBus } from '@material-ui/icons'
import Collapse from '@material-ui/core/Collapse'
import Divider from '@material-ui/core/Divider';
import Helpers from '../helpers';

import TopNav from './TopNav'

const Homepage = () => {
  let [open, setOpen] = useState('routes')

  return (
    <>
    <TopNav />
    <div style={{background: "#B0D27B", padding: '.5em', textAlign: 'center', display: 'flex', fontFamily: 'Gibson Detroit Light', alignItems: 'vertical', justifyContent: 'center', fontSize: '1.2em'}}>
      <span>This is a <b>beta</b> tool, which means we want <a href="https://app.smartsheet.com/b/form/28665a43770d48b5bbdfe35f3b7b45ac">your feedback!</a></span>
    </div>
    <Card>
    <CardHeader title="Welcome to DDOT's new bus schedule tool" />
    <CardContent>
      You can browse bus routes, look up a bus stop, or see service near your current location
    </CardContent>
  </Card>
  <List 
    style={{ background: '#fff' }}>
    <ListItem key="routes" button onClick={() => setOpen("routes")} style={{ background: open === "routes" ? Helpers.colors.background : '#fff' }}>
      <ListItemIcon style={{ fontSize: 30 }}>
        <DirectionsBus style={{ color: '#000' }} />
      </ListItemIcon>
      <ListItemText inset primary="Choose your bus route" />
      {open === "routes" ? <AccessAlarm /> : <AccessAlarm />}
    </ListItem>
    <ListItem key="stops" button onClick={() => setOpen("stops")} style={{ background: open === "stops" ? Helpers.colors.background : '#fff' }}>
      <ListItemIcon style={{ fontSize: 30 }}>
        <AccessAlarm style={{ color: '#000' }} />
      </ListItemIcon>
      <ListItemText inset primary="Find your bus stop" />
      {open === "stops" ? <AccessAlarm /> : <AccessAlarm />}
    </ListItem>
    <ListItem key="nearby" button onClick={() => setOpen("nearby")} style={{ background: open === "nearby" ? Helpers.colors.background : '#fff' }}>
      <ListItemIcon style={{ fontSize: 30 }}>
        <AccessAlarm style={{ color: '#000' }} />
      </ListItemIcon>
      <ListItemText inset primary="See what's nearby" />
      {open === "nearby" ? <AccessAlarm /> : <AccessAlarm />}
    </ListItem>
    <Divider />
    <Collapse in={true} timeout="auto" unmountOnExit>
      {open === "routes" ? <p>Yo</p> 
        : open === "stops" ? <p>Yoooo</p>  
          : open === "nearby" ? <p>Yooooo</p> 
            : null}
    </Collapse>
  </List>
  </>
  )
}

export default Homepage;