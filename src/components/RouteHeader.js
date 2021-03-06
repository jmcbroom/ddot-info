import React from "react";
import { Link } from "gatsby";
import { Tabs, Tab } from "@material-ui/core";
import { DirectionsBus, Schedule, PinDrop } from "@material-ui/icons";
import TopNav from "./TopNav";

/** Navigation tabs for /route/{#} page */
const RouteHeader = ({ number, page }) => {
  const tabs = [
    { label: "Overview", path: `/route/${number}`, icon: <DirectionsBus style={{ color: "#fff" }} /> },
    { label: "Bus stops", path: `/route/${number}/stops`, icon: <PinDrop style={{ color: "#fff" }} /> },
    { label: "Schedule", path: `/route/${number}/schedule`, icon: <Schedule style={{ color: "#fff" }} /> }
  ];

  return (
    <div style={{ background: "#004445", gridArea: "nav" }}>
      <TopNav />
      <Tabs value={tabs.map(t => t.label).indexOf(page)} indicatorColor="primary" style={{ fontSize: "1.2em" }}>
        {tabs.map(({ label, path, icon }, i) => (
          <Tab
            key={label}
            icon={icon}
            label={label}
            component={Link}
            to={path}
            style={label !== "Schedule" ? { borderRight: ".1px solid #fff", color: "#fff" } : { color: "#fff" }}
          />
        ))}
      </Tabs>
    </div>
  );
};

export default RouteHeader;
