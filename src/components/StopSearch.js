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

  let stopsToShow = input === "" ? _.sampleSize(stops, 7) : stops.filter(st => { return st.stopId.indexOf(input) > -1 || st.stopDesc.indexOf(input) > -1 })

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
          {stopsToShow.slice(0,12).map(st => (
            <StopCard key={st.stopId} stopId={st.stopId} stopDesc={st.stopDesc || st.stopName} stopRoutes={st.routes.map(r => r.short)} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default StopSearch;
