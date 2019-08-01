import React from 'react';
import { Card, CardHeader } from '@material-ui/core';

const StopTransfers = ({ xfers }) => {
  return (
    <Card style={{marginTop: 10}}>
      <CardHeader title={`Nearby transfers`} titleTypographyProps={{variant: 'h6'}} />
    </Card>
  )
}

export default StopTransfers;