import React, { useState } from "react";
import { Card, CardHeader, CardContent, TextField } from "@material-ui/core";
import { Search } from "@material-ui/icons";
import _ from "lodash";

import StopCard from "./StopCard";

const StopInput = ({ input, handleChange }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        padding: ".25em",
        border: "2px solid rgba(0, 68, 69, 0.2)",
        backgroundColor: "#fff"
      }}
    >
      <Search style={{ marginRight: ".25em", width: "1.25em", height: "1.25em" }} />
      <TextField
        label="Search by street name or stop ID"
        placeholder='Try "Michigan", "Washington", "1118"'
        value={input}
        onChange={e => handleChange(e.target.value)}
        fullWidth
        style={{ marginBottom: "1em" }}
      />
    </div>
  );
};

const StopSearch = ({ stops }) => {
  let [input, setInput] = useState("");

  let randomStops = _.sampleSize(stops, 7);

  console.log(randomStops);

  return (
    <Card>
      <CardHeader title="Find your bus stop" subheader="DDOT has more than 5,000 bus stops. Bus stop signs are placed every 2-3 blocks along each route" />
      <CardContent>
        <StopInput input={input} handleChange={setInput} />
        {input === "" ? (
          <div style={{ color: "#333", fontSize: "1.2em", marginTop: "1em" }}>
            Here's a few random bus stops. Start typing in the box above to find your closest stop.
          </div>
        ) : (
          ``
        )}
        <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fit, minmax(250px, 1fr))`, gridGap: 20, overflowY: "scroll" }}>
          {randomStops.map(rs => (
            <StopCard stopId={rs.stopId} stopDesc={rs.stopDesc || rs.stopName} stopRoutes={rs.routes.map(r => r.routeShortName)} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default StopSearch;
