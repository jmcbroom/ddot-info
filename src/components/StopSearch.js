import React from "react";

import { Card, CardHeader, CardContent } from "@material-ui/core";

const StopSearch = ({ stops }) => {
  return (
    <Card>
      <CardHeader title="Find your bus stop" subheader="DDOT has more than 5,000 bus stops. Bus stop signs are placed every 2-3 blocks along each route" />

      <CardContent />
    </Card>
  );
};

export default StopSearch;
