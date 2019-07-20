import React, { Component } from 'react'
import routeDetails from '../data/routeDetails.js'
import _ from 'lodash'

/** Non-linked route number and name for RouteDetails, RouteMap, RouteSchedule, RouteStops and Stop */
const RouteBadge = ({ id, showName }) => {
  // lookup route number in routeDetails

  const route = _.filter(routeDetails, r => { return id === r.number.toString() })[0];

  return (
    <div>  
      <div style={{ display: 'flex', alignItems:'center', justifyContent: 'flex-start'}}>
        <div style={{ display: 'flex', alignItems:'center', justifyContent: 'center', width: '1.75em', height: '1.75em', backgroundColor: route.color, border: `1px solid ${route.color}`, borderRadius: route.radius, color: '#fff', fontSize: '1.1em', textAlign: 'center', fontWeight: 700, }}>
          {route.new_number || id}
        </div>
        { showName ? <span style={{ marginLeft: '.25em' }}>{route.new_name || route.name}</span> : null }
      </div>
    </div>
  );
}

export default RouteBadge;