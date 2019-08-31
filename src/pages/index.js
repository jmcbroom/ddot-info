import { List, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import Collapse from "@material-ui/core/Collapse";
import Divider from "@material-ui/core/Divider";
import { DirectionsBus, KeyboardArrowDown, KeyboardArrowRight, NearMe } from "@material-ui/icons";
import { navigate } from "@reach/router";
import { graphql } from "gatsby";
import React, { useState } from "react";

import BusStop from "../components/BusStop";
import Layout from "../components/Layout";
import RouteSearch from "../components/RouteSearch";
import StopSearch from "../components/StopSearch";
import TopNav from "../components/TopNav";
import Helpers from "../helpers";

const IndexPage = ({ data }) => {
  let [open, setOpen] = useState("routes");

  let routes = data.postgres.routes;

  return (
    <Layout>
      <TopNav />
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
          <ListItemText inset primary="Choose your bus route" style={{ padding: 0 }} />
          {open === "routes" ? <KeyboardArrowDown /> : <KeyboardArrowRight />}
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
            <BusStop style={{ color: "#000" }} />
          </ListItemIcon>
          <ListItemText inset primary="Find your bus stop" style={{ padding: 0 }} />
          {open === "stops" ? <KeyboardArrowDown /> : <KeyboardArrowRight />}
        </ListItem>
        <ListItem key="nearby" button onClick={() => navigate(`/nearby`)}>
          <ListItemIcon style={{ fontSize: 30 }}>
            <NearMe style={{ color: "#000" }} />
          </ListItemIcon>
          <ListItemText inset primary="See what's nearby" style={{ padding: 0 }} />
        </ListItem>
        <Divider />
        <Collapse in={true} timeout="auto" unmountOnExit>
          {open === "routes" ? <RouteSearch routes={routes} /> : open === "stops" ? <StopSearch stops={data.postgres.stops} /> : null}
        </Collapse>
      </List>
    </Layout>
  );
};

export const query = graphql`
  {
    postgres {
      routes: allRoutesList(condition: { feedIndex: 6 }) {
        short: routeShortName
        long: routeLongName
        color: routeColor
        routeId
      }
      stops: allStopsList(condition: { feedIndex: 6 }) {
        stopId
        stopName
        routes: routeShapesList {
          short
        }
      }
    }
  }
`;

export default IndexPage;
