import React, { useState, useEffect } from 'react';
import mapboxgl from "mapbox-gl/dist/mapbox-gl.js";

import style from '../data/mapstyle.json'

const RouteMap = ({ shapes, longTrips }) => {

  console.log(style)
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
      console.log(e)
    })

    setMap(map)

  }, [])
  
  return (
    <div id="map" style={{height: 200, width: 200}} />
  )
}

export default RouteMap;