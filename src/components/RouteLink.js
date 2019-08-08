import React from "react";
import { Link } from "gatsby";
import { Schedule } from "@material-ui/icons";
import BusStop from "../components/BusStop";

import routes from "../data/routes";
import _ from "lodash";

/** Linked route number and name with optional icons for RoutesList, NearbyList, StopTransfers and Stop */
const RouteLink = ({ id, icons, direction, small = false, background='none' }) => {
  const route = _.find(routes, a => {
    return a.number === parseInt(id, 10);
  });

  const styles = {
    wrapper: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: background
    },
    badge: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: small ? "1.5em" : "2em",
      height: small ? "1.5em" : "2em",
      margin: small ? 0 : 5,
      backgroundColor: `${route.color}`,
      borderRadius: route.radius,
      color: "#fff",
      fontSize: small ? "1em" : "1.25em",
      fontWeight: small ? 400 : 600
    },
    name: {
      display: "flex",
      alignItems: "center",
      justifyContent: "left",
      flexGrow: 1,
      marginLeft: small ? 10 : 5
    },
    span: {
      fontSize: small ? `1em` : `1.1em`,
      fontFamily: "Gibson Detroit Regular",
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
        {small ? (
          <>{id}</>
        ) : (
          <Link to={`/route/${id}`} style={{ textDecoration: "none", color: "#fff" }}>
            {id}
          </Link>
        )}
      </div>
      <div style={styles.name}>
          <Link to={`/route/${id}`} style={{ textDecoration: "none" }}>
            <span style={{...styles.span, fontWeight: 400}}>
              {route.name} {direction ? ` (${direction})` : ``}
            </span>
          </Link>
      </div>
      {icons ? (
        <div style={styles.icons}>
          <Link to={`/route/${id}/stops`}>
            <BusStop style={styles.svg} />
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

export default RouteLink;
