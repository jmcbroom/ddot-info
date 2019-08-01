import React from "react";
import { Card, CardHeader } from "@material-ui/core";

const StopTransfers = ({ xfers }) => {
  return (
    <Card style={{ marginTop: 10 }}>
      <CardHeader title={`Nearby transfers`} titleTypographyProps={{ variant: "h6" }} />
      {xfers.map(x => (
        <div>{x.stopId}</div>
      ))}
    </Card>
  );
};

export default StopTransfers;
