import { Link } from "gatsby";
import _ from "lodash";
import React from "react";

import routes from "../data/routes";

const defaultStyles = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  borderBottom: "1px dashed #ccc",
  width: "100%",
  padding: ".5rem"
};

/** Linked stop name and id for RouteStopList */
const StopLink = ({ stop, color, isTimepoint, showBorder, showTransfers, route }) => {
  return (
    <div style={showBorder ? { ...defaultStyles, marginLeft: "1em", borderLeft: `6px solid ${color}` } : defaultStyles}>
      {showBorder ? (
        <span
          style={{
            marginLeft: "-1.25em",
            border: isTimepoint ? ".25em solid black" : `.25em solid ${color}`,
            backgroundColor: !isTimepoint ? "white" : "black",
            borderRadius: "4em",
            height: "11px",
            width: "11px",
            marginRight: "1em",
            zIndex: 2
          }}
        />
      ) : (
        ``
      )}
      <div style={{ width: "50%" }}>
        <Link
          style={{ color: "#000", display: "block", marginBottom: ".25rem", fontSize: "1em", fontWeight: !isTimepoint ? "normal" : "bold" }}
          to={`/stop/${stop.stopId}/`}
        >
          <span>{stop.stopName}</span>
        </Link>
        <span style={{ padding: ".25rem", fontSize: ".75rem", background: "#eee" }}>#{stop.stopId}</span>
      </div>
      <div style={{ display: "flex", marginLeft: ".5em", flexWrap: "wrap", alignItems: "center", width: "50%", marginTop: "-.25em" }}>
        {_.uniq(stop.routeShapes.map(r => r.short).filter(x => parseInt(x) !== route.number)).map(u => {
          let rd = routes.filter(rd => rd.number === parseInt(u))[0];
          return (
            <Link
              to={`/route/${rd.number}`}
              key={u}
              style={{
                display: "flex",
                textDecoration: "none",
                alignItems: "center",
                fontWeight: 900,
                justifyContent: "center",
                width: "1.8em",
                height: "1.8em",
                color: "white",
                fontSize: "1em",
                backgroundColor: rd.color,
                border: `1px solid ${rd.color}`,
                borderRadius: rd.radius,
                marginRight: ".5em",
                marginTop: ".5em"
              }}
            >
              {u}
            </Link>
          );
        })}
        {/* {Stops[this.props.id] && routes.length < 25 ? routes.sort((a, b) => { return a - b}).map((r, i) => (
        <Link style={exclude.toString() === r.toString() ? { display: 'none' } : { marginRight: '.5rem', textDecoration: 'none' }} to={{pathname: `/route/${r}`}} key={i}>
          <div style={exclude.toString() === r.toString() ? { display: 'none' } : { display: 'flex', alignItems:'center',  justifyContent: 'center', width: '2em', height: '2em', backgroundColor: Schedules[r].color, border: `1px solid ${Schedules[r].color}`, borderRadius: Schedules[r].color === '#004445' ? 99 : 0, color: '#fff', fontWeight: 700, marginTop: '.25em' }}>
            {r}
          </div> 
        </Link>
      )) : `All downtown routes`} */}
      </div>
    </div>
  );
};

export default StopLink;
