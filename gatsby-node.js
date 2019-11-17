/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

const path = require("path");

exports.onCreateWebpackConfig = ({ stage, loaders, actions }) => {
  if (stage === "build-html") {
    actions.setWebpackConfig({
      module: {
        rules: [
          {
            test: /mapbox-gl/,
            use: loaders.null()
          }
        ]
      }
    });
  }
};

exports.createPages = async ({ graphql, actions: { createPage } }) => {
  const result = await graphql(`
    {
      postgres {
        routes: allRoutesList(condition: { feedIndex: 7, routeId: "7134" }) {
          agencyId
          short: routeShortName
          long: routeLongName
        }
        stops: allStopsList(condition: { feedIndex: 7, stopId: "10499" }) {
          feedIndex
          stopId
        }
      }
    }
  `);

  result.data.postgres.routes.forEach(r => {
    // we'll make a route page
    createPage({
      path: `/route/${r.short}`,
      component: path.resolve("./src/templates/route-page.js"),
      context: {
        routeNo: r.short
      }
    });

    // a page showing all the stops on the route
    createPage({
      path: `/route/${r.short}/stops`,
      component: path.resolve("./src/templates/route-stops-page.js"),
      context: {
        routeNo: r.short
      }
    });

    // a page showing the route schedule
    createPage({
      path: `/route/${r.short}/schedule`,
      component: path.resolve("./src/templates/route-schedule-page.js"),
      context: {
        routeNo: r.short
      }
    });
  });

  result.data.postgres.stops.forEach(stop => {
    createPage({
      path: `/stop/${stop.stopId}`,
      component: path.resolve("./src/templates/stop-page.js"),
      context: {
        stopId: stop.stopId
      }
    });
  });
};
