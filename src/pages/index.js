import React, { useState } from "react";

import { graphql } from "gatsby";

import { List, ListItem, ListItemIcon, ListItemText, ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, Typography } from "@material-ui/core";
import { Card, CardHeader, CardContent } from "@material-ui/core";
import { AccessAlarm, DirectionsBus, KeyboardArrowDown, KeyboardArrowRight, NearMe, Star, ExpandMore, StarBorder } from "@material-ui/icons";
import BusStop from "../components/BusStop";
import Collapse from "@material-ui/core/Collapse";
import Divider from "@material-ui/core/Divider";
import Helpers from "../helpers";

import Layout from "../components/Layout";
import RouteSearch from "../components/RouteSearch";
import StopSearch from "../components/StopSearch";
import TopNav from "../components/TopNav";
import { navigate } from "@reach/router";
import StopCard from "../components/StopCard";

const IndexPage = ({ data }) => {
  let [open, setOpen] = useState("routes");

  let routes = data.postgres.routes;
  let stops = data.postgres.stops;

  let favorite = typeof window !== undefined && localStorage.getItem("favorite") ? localStorage.getItem("favorite") : null
  let favoriteStop = stops.filter(s => s.stopId === favorite)[0]
  console.log(favorite, favoriteStop)

  let favoriteStyles = {
    header: {
      paddingTop: 0,
      paddingBottom: 0
    }
  }
  
  return (
    <Layout>
      <TopNav />
      {/* <Card>
        <CardHeader title="Welcome to DDOT's new bus schedule tool" />
        <CardContent>You can browse bus routes, look up a bus stop, or see service near your current location</CardContent>
      </Card> */}

      <ExpansionPanel defaultExpanded={favorite ? true : false}>
        <ExpansionPanelSummary
          expandIcon={<ExpandMore />}
  
          >
            <Typography>Favorite routes & stops</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
          <Typography>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
            sit amet blandit leo lobortis eget.
          </Typography>
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <ExpansionPanel>
        <ExpansionPanelSummary
          expandIcon={<ExpandMore />}
          >
            <Typography>Choose a bus route</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <RouteSearch routes={routes} />
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <ExpansionPanel>
        <ExpansionPanelSummary
          expandIcon={<ExpandMore />}
          >
            <Typography>Search for a stop</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
          <Typography>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
            sit amet blandit leo lobortis eget.
          </Typography>
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <ExpansionPanel>
        <ExpansionPanelSummary
          expandIcon={<ExpandMore />}
          >
            <Typography>Near my location</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
          <Typography>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
            sit amet blandit leo lobortis eget.
          </Typography>
        </ExpansionPanelDetails>
      </ExpansionPanel>

      {/* {favoriteStop &&
      <Card>
        <CardHeader avatar={<Star />} title='Favorite stops' style={favoriteStyles.header}/>
        <CardHeader avatar={<BusStop />} title={favoriteStop.stopDesc} />
      </Card>


      }
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
        <ListItem
          key="nearby"
          button
          onClick={() => navigate(`/nearby`)}
        >
          <ListItemIcon style={{ fontSize: 30 }}>
            <NearMe style={{ color: "#000" }} />
          </ListItemIcon>
          <ListItemText inset primary="See what's nearby" style={{ padding: 0 }} />
        </ListItem>
        <Divider />
        <Collapse in={true} timeout="auto" unmountOnExit>
          {open === "routes" ? (
            <RouteSearch routes={routes} />
          ) : open === "stops" ? (
            <StopSearch stops={data.postgres.stops} />
          ) : null}
        </Collapse>
      </List> */}
    </Layout>
  );
};

export const query = graphql`
  {
    postgres {
      routes: allRoutesList(condition: { feedIndex: 5 }) {
        short: routeShortName
        long: routeLongName
        color: routeColor
        routeId
      }
      stops: allStopsList(condition: { feedIndex: 5 }) {
        stopId
        stopDesc
        routes: routeShapesList {
          short
        }
      }
    }
  }
`;

export default IndexPage;
