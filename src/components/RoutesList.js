import React from "react";
import RouteLink from "./RouteLink";

/** List of all routes matching search input for RouteSearch on Homepage */
const RoutesList = ({ routes }) => {
  const gridStyle = {
    display: "grid",
    gridTemplateColumns: `repeat(auto-fit, minmax(350px, 1fr))`,
    gridGap: `.5em`,
    maxHeight: "35vh",
    overflowY: "scroll",
    boxSizing: "border-box",
    padding: 0,
    WebkitOverflowScrolling: "touch"
  };
  return (
    <div style={gridStyle}>
      {routes.map(r => (
        <RouteLink key={r.short} id={r.short} routeId={r.routeId} background='#eee' icons />
      ))}
    </div>
  );
};

export default RoutesList;
