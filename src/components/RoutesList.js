import React from "react";
import RouteLink from "./RouteLink";

/** List of all routes matching search input for RouteSearch on Homepage */
const RoutesList = ({ routes }) => {
  const gridStyle = {
    display: "grid",
    gridTemplateColumns: `repeat(auto-fit, minmax(275px, 1fr))`,
    gridGap: `.5em`,
    maxHeight: '50vh',
    overflowY: "scroll",
    boxSizing: "border-box",
    padding: 0,
    webkitOverflowScrolling: "touch"
  };
  return (
    <div style={gridStyle}>
      {routes.map(r => (
        <RouteLink key={r.id} id={r.short} routeId={r.routeId} icons />
      ))}
    </div>
  );
};

export default RoutesList;
