import { Card, CardContent, CardHeader } from "@material-ui/core";
import React, { useState } from "react";

// import RouteInput from './RouteInput';
import RoutesList from "./RoutesList";

const RouteSearch = ({ routes }) => {
  let [searchInput, setSearchInput] = useState(null);

  let filteredRoutes = null;

  if (searchInput) {
    filteredRoutes = routes.filter(r => r.short.indexOf(searchInput) + r.long.indexOf(searchInput) - 1);
  } else {
    filteredRoutes = routes;
  }

  return (
    <Card>
      <CardHeader
        title="Choose your bus route"
        subheader="Click on a route number or name for an overview, including real-time locations. Click an icon to go directly to that route's bus stops or schedule."
      />
      <CardContent>
        {/* <RouteInput
          input={this.state.input}
          onSearchChange={this.handleSearchChange}
        /> */}
        {filteredRoutes ? <RoutesList routes={filteredRoutes} /> : <span style={{ color: "red" }}>No routes match your search! Try again.</span>}
        <div style={{ display: "flex", flexWrap: "wrap", marginTop: "1.25em" }}>
          <span style={{ padding: ".2em .2em .2em 0" }}>Bus routes are color coded by their service direction and frequency:</span>
          <span style={{ padding: ".2em .2em .2em 0" }}>
            <span style={{ borderBottom: "4px solid #004445" }}>ConnectTen</span>,
          </span>
          <span style={{ padding: ".2em .2em .2em 0" }}>
            <span style={{ borderBottom: "4px solid rgb(68, 170, 66)" }}>downtown</span>,
          </span>
          <span style={{ padding: ".2em .2em .2em 0" }}>
            <span style={{ borderBottom: "4px solid rgb(155, 91, 165)" }}>northbound/southbound</span>,
          </span>
          <span style={{ padding: ".2em .2em .2em 0" }}>
            <span style={{ borderBottom: "4px solid rgb(0, 121, 194)" }}>eastbound/westbound</span> and
          </span>
          <span style={{ padding: ".2em .2em .2em 0" }}>
            <span style={{ borderBottom: "4px solid rgb(208, 124, 50)" }}>special routes</span>.
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default RouteSearch;
