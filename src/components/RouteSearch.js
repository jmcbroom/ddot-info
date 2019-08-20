import React, { useState } from "react";
import { Card, CardHeader, CardContent } from "@material-ui/core";

// import RouteInput from './RouteInput';
import RoutesList from "./RoutesList";

const RouteSearch = ({ routes }) => {
  let [searchInput, setSearchInput] = useState(null);

  let filteredRoutes = null;

  if (searchInput) {
    filteredRoutes = routes.filter(
      r => r.short.indexOf(searchInput) + r.long.indexOf(searchInput) - 1
    );
  } else {
    filteredRoutes = routes;
  }
  
  return (
        <RoutesList routes={filteredRoutes} />
  );
};

export default RouteSearch;
