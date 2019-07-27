import React, { useState } from "react";

import BusStop from './BusStop'
import { Link } from 'gatsby';

import { Card, CardHeader, CardContent, TextField } from "@material-ui/core";
import { Search, Timeline } from '@material-ui/icons';
import _ from 'lodash';

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
      <Search
        style={{ marginRight: ".25em", width: "1.25em", height: "1.25em" }}
      />
      <TextField
        label="Search by street name or stop ID"
        placeholder='Try "Michigan", "Washington", "1118"'
        value={input}
        onChange={(e) => handleChange(e.target.value)}
        fullWidth
        style={{ marginBottom: "1em" }}
      />
    </div>
  );
};

const StopSearch = ({ stops }) => {

  let [input, setInput] = useState('')

  let randomStops = _.sampleSize(stops, 7)

  console.log(randomStops)

  return (
    <Card>
      <CardHeader
        title="Find your bus stop"
        subheader="DDOT has more than 5,000 bus stops. Bus stop signs are placed every 2-3 blocks along each route"
      />
      <CardContent>
        <StopInput input={input} handleChange={setInput} />
        { input === '' ? <div style={{color: '#333', fontSize: '1.2em', marginTop: '1em'}}>Here's a few random bus stops. Start typing in the box above to find your closest stop.</div> : ``}
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fit, minmax(200px, 1fr))`, height: 400, overflowY: 'scroll' }}>
          {randomStops.map(rs => (
            <Card style={{ background: '#eee', margin: '.25em', height: 150, width: 200 }}>
            <CardHeader 
              style={{paddingBottom: 0}}
              avatar={<BusStop style={{ height: '1em', width: '1em' }} />} 
              title={
                <>
                  <Link to={`/stop/${rs.stopId}` } style={{ color: 'black', fontSize: '1.2em' }}>
                    <span>{rs.stopDesc}</span>
                  </Link> 
                <div>
                  <span style={{ background: '#ccc', padding: '4px 8px', fontSize: '1em', fontWeight: 700, color: 'black' }}>
                    #{rs.stopId}
                  </span>
                </div>
                </>
                  }/>
            <CardContent>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Timeline style={{marginRight: '.65em'}} />
                <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', marginTop: '-.5em' }}>
                  {rs.routes.sort((a, b) => { return a.routeShortName - b.routeShortName}).map((r, i) => (
                    <Link to={`/route/${r}`} key={i} style={{ display: 'flex', textDecoration: 'none', alignItems:'center', fontWeight: 700, justifyContent: 'center', width: '1.8em', height: '1.8em', color: 'white', fontSize: '.9em', backgroundColor: 'red', border: `1px solid red`, marginRight: '.5em', marginTop: '.5em' }}>
                      {r.routeShortName}
                    </Link>))}
                </div>
              </div>
            </CardContent>
          </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default StopSearch;