import React from 'react';
import Layout from '../components/Layout'
import RouteHeader from '../components/RouteHeader'

export default ({ data, pageContext }) => {

  let r = data.postgres.route[0]

  return (
    <Layout>
      {data.postgres.route.routeLongName}
      <RouteHeader number={r.routeShortName} page='stops' />
    </Layout>
  )
}

export const query = graphql`
query($routeNo: String!) {
  postgres {
    route: allRoutesList(
      condition: { routeShortName: $routeNo, feedIndex: 1 }
    ) {
      agencyId
      routeShortName
      routeLongName
      routeDesc
      routeType
      routeUrl
      routeColor
      routeTextColor
      routeSortOrder
      shapes: routeShapesByFeedIndexAndRouteIdList {
        dir
        direction
        geojson: simpleGeojson
      }
      longTrips: longestTripsList {
        tripHeadsign
        directionId
        stopTimes: stopTimesByFeedIndexAndTripIdList(
          orderBy: STOP_SEQUENCE_ASC
        ) {
          stopSequence
          timepoint
          arrivalTime {
            seconds
            minutes
            hours
          }
          stop: stopByFeedIndexAndStopId {
            stopId
            stopName
            stopDesc
            stopLat
            stopLon
            geojson
          }
        }
      }
      trips: tripsByFeedIndexAndRouteIdList {
        id: tripId
        headsign: tripHeadsign
        direction: directionId
        service: serviceId
        stopTimes: stopTimesByFeedIndexAndTripIdList(
          condition: { timepoint: 1 }
        ) {
          timepoint
          arrivalTime {
            hours
            minutes
            seconds
          }
          stop: stopByFeedIndexAndStopId {
            stopId
            stopDesc
            stopName
            stopLat
            stopLon
          }
        }
      }
    }
  }
}
`