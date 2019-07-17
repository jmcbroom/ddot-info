import React, { useState } from "react";
import "../css/app.css";

import { graphql } from "gatsby";

import { List, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import { Card, CardHeader, CardContent } from "@material-ui/core";
import { AccessAlarm, DirectionsBus } from "@material-ui/icons";
import Collapse from "@material-ui/core/Collapse";
import Divider from "@material-ui/core/Divider";
import Helpers from "../helpers";

import Layout from "../components/Layout";
import RouteSearch from "../components/RouteSearch";

const IndexPage = ({ data }) => {
  let [open, setOpen] = useState("routes");

  let routes = data.postgres.routes;

  return (
    <Layout>
      <Card>
        <CardHeader title="Welcome to DDOT's new bus schedule tool" />
        <CardContent>
          You can browse bus routes, look up a bus stop, or see service near
          your current location
        </CardContent>
      </Card>
      <List style={{ background: "#fff" }}>
        <ListItem
          key="routes"
          button
          onClick={() => setOpen("routes")}
          style={{
            background: open === "routes" ? Helpers.colors.background : "#fff"
          }}
        >
          <ListItemIcon style={{ fontSize: 30 }}>
            <DirectionsBus style={{ color: "#000" }} />
          </ListItemIcon>
          <ListItemText inset primary="Choose your bus route" />
          {open === "routes" ? <AccessAlarm /> : <AccessAlarm />}
        </ListItem>
        <ListItem
          key="stops"
          button
          onClick={() => setOpen("stops")}
          style={{
            background: open === "stops" ? Helpers.colors.background : "#fff"
          }}
        >
          <ListItemIcon style={{ fontSize: 30 }}>
            <AccessAlarm style={{ color: "#000" }} />
          </ListItemIcon>
          <ListItemText inset primary="Find your bus stop" />
          {open === "stops" ? <AccessAlarm /> : <AccessAlarm />}
        </ListItem>
        <ListItem
          key="nearby"
          button
          onClick={() => setOpen("nearby")}
          style={{
            background: open === "nearby" ? Helpers.colors.background : "#fff"
          }}
        >
          <ListItemIcon style={{ fontSize: 30 }}>
            <AccessAlarm style={{ color: "#000" }} />
          </ListItemIcon>
          <ListItemText inset primary="See what's nearby" />
          {open === "nearby" ? <AccessAlarm /> : <AccessAlarm />}
        </ListItem>
        <Divider />
        <Collapse in={true} timeout="auto" unmountOnExit>
          {open === "routes" ? (
            <RouteSearch routes={routes} />
          ) : open === "stops" ? (
            <p>Yoooo</p>
          ) : open === "nearby" ? (
            <p>Yooooo</p>
          ) : null}
        </Collapse>
      </List>
    </Layout>
  );
};

export const query = graphql`
  {
    postgres {
      routes: allRoutesList(condition: { feedIndex: 1 }) {
        short: routeShortName
        long: routeLongName
        color: routeColor
        routeId
      }
    }
  }
`;

export default IndexPage;
