import React, { useState, useEffect } from 'react';
import mapboxgl from "mapbox-gl/dist/mapbox-gl.js";
import {Card, CardHeader, CardContent} from '@material-ui/core';
import style from '../data/mapstyle.json'
import RouteBadge from './RouteBadge';
import {DirectionsBus} from '@material-ui/icons';

const RouteMap = ({ shapes, longTrips, color, shortName }) => {

  console.log(shapes)

  let [theMap, setMap] = useState(null)

  useEffect(() => {

    mapboxgl.accessToken = "pk.eyJ1IjoiY2l0eW9mZGV0cm9pdCIsImEiOiJjaXZvOWhnM3QwMTQzMnRtdWhyYnk5dTFyIn0.FZMFi0-hvA60KYnI-KivWg";  
    
    let map = new mapboxgl.Map({
      container: "map",
      style: style,
      center: [-83, 42],
      zoom: 8.75, // starting zoom,
      attributionControl: false
    });

    map.on('load', (e) => {

      map.addSource("routes", {
        type: 'geojson',
        data: {}
      })
      console.log(e)
    })

    setMap(map)

  }, [])
  
  return (
    <Card className="routeMap" elevation={0}>
    <CardContent style={{ padding: 0, margin: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <CardHeader 
          title={<RouteBadge id={shortName} showName />} 
          subheader={
            <div style={{ display: 'flex', alignItems: 'center' }}>
              Zoom in for all stops and real-time bus info.
            </div>} />
          <div style={{display: 'grid', gridTemplate: 'repeat(2, 1fr) / 1fr 1fr', gridGap: 10, marginRight: '.5em', background: 'rgba(0,0,0,0.05)', padding: 10}}>
            <div style={{display: 'flex', alignItems: 'center', alignContent: 'center', fontWeight: 700}}>
              <span style={{textAlign: 'center', textSize: '1.5em'}}></span>
            </div>
            <div style={{display: 'flex', alignItems: 'center', alignContent: 'space-between'}}>
              <DirectionsBus style={{height: 17, width: 17, padding: 1, borderRadius: 9999, color: 'white', background: 'rgba(0,0,0,1)'}}/>
              <span style={{marginLeft: '.5em'}}>Active buses</span>
            </div>
            <div style={{display: 'flex', alignItems: 'center', alignContent: 'space-between'}}>
              <span style={{borderRadius: 9999, border: '3px solid black', width: 13, height: 13, background: '#000'}}></span>
              <span style={{marginLeft: '.5em', textAlign: 'center'}}>Major stops</span>
            </div>
            <div style={{display: 'flex', alignItems: 'center', alignContent: 'space-between'}}>
              <span style={{borderRadius: 9999, border: `3px solid ${color}`, width: 13, height: 13, background: '#fff'}}></span>
              <span style={{marginLeft: '.5em'}}>Local stops</span>
            </div>
          </div>
      </div>
      <div id="map" style={{height: '60vh', width: '100%'}} />
    </CardContent>
  </Card>
  )
}

export default RouteMap;