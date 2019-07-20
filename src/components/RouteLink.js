import React from "react";
import { Link } from "gatsby";
import PropTypes from "prop-types";
import { Schedule } from "@material-ui/icons";

import routeDetails from "../data/routeDetails.js";
import _ from "lodash";

/** Linked route number and name with optional icons for RoutesList, NearbyList, StopTransfers and Stop */
const RouteLink = ({ id, routeId, icons, direction }) => {
  const route = _.find(routeDetails, a => {
    return a.number === parseInt(id, 10);
  });

  const styles = {
    wrapper: {
      display: "flex",
      justifyContent: "space-between",
      backgroundColor: "#eee"
    },
    badge: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "2em",
      height: "2em",
      margin: 5,
      backgroundColor: `${route.color}`,
      borderRadius: route.radius,
      // border: `1px solid ${route.color}`,
      color: "#fff",
      fontSize: "1.25em",
      fontWeight: 700
    },
    name: {
      display: "flex",
      alignItems: "center",
      justifyContent: "left",
      flexGrow: 1,
      marginLeft: 5
    },
    span: {
      fontSize: `1.1em`,
      fontFamily: "Gibson Detroit Light",
      fontWeight: 600,
      color: "black"
    },
    icons: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      width: 60,
      padding: 10
    },
    svg: {
      height: 30,
      color: "#ccc"
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.badge}>
        <Link
          to={`/route/${id}`}
          style={{ textDecoration: "none", color: "#fff" }}
        >
          {id}
        </Link>
      </div>
      <div style={styles.name}>
        <Link to={`/route/${id}`} style={{ textDecoration: "none" }}>
          <span style={styles.span}>
            {route.name} {direction ? ` (${direction})` : ``}
          </span>
        </Link>
      </div>
      {icons ? (
        <div style={styles.icons}>
          <Link to={`/route/${id}/stops`}>
            <Schedule style={styles.svg} />
          </Link>
          <Link to={`/route/${id}/schedule`}>
            <Schedule style={styles.svg} />
          </Link>
        </div>
      ) : (
        ``
      )}
    </div>
  );
};

RouteLink.propTypes = {
  id: PropTypes.string.isRequired,
  icons: PropTypes.bool
};

export default RouteLink;
