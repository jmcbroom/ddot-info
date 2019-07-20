import React, { useState, useEffect } from 'react';
import mapboxgl from "mapbox-gl/dist/mapbox-gl.js";
import {Card, CardHeader, CardContent} from '@material-ui/core';
import {DirectionsBus} from '@material-ui/icons'
import style from '../data/mapstyle.json'

const StopMap = ({ name, id, coords }) => {

  let [theMap, setMap] = useState(null)

  useEffect(() => {

    mapboxgl.accessToken = "pk.eyJ1IjoiY2l0eW9mZGV0cm9pdCIsImEiOiJjaXZvOWhnM3QwMTQzMnRtdWhyYnk5dTFyIn0.FZMFi0-hvA60KYnI-KivWg";  
    
    let map = new mapboxgl.Map({
      container: "map",
      style: style,
      center: coords,
      zoom: 15.75, // starting zoom,
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
    <Card className="map">
    <CardContent style={{ padding: 0, margin: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', padding: 0 }}>
        <DirectionsBus style={{ marginLeft: '1em', backgroundColor: 'rgba(0, 0, 0, .8)', color: 'yellow', borderRadius: 999, height: '1.8em', width: '1.8em' }}/>
        <CardHeader title={name} subheader={`Stop ID: #${id}`} style={{ fontSize: '1.2em', position: 'sticky'}}/>
      </div>
      <div id="map" style={{height: '60vh', width: '100%'}} />
    </CardContent>
  </Card>
  )
}

export default StopMap;