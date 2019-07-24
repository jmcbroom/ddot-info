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
        routes: allRoutesList(condition: { feedIndex: 5 }) {
          agencyId
          short: routeShortName
          long: routeLongName
        }
        stops: allStopsList(condition: { feedIndex: 5, stopId: "7919" }) {
          feedIndex
          stopId
        }
      }
    }
  `);

  result.data.postgres.routes.forEach(r => {
    createPage({
      path: `/route/${r.short}`,
      component: path.resolve("./src/templates/route-page.js"),
      context: {
        routeNo: r.short
      }
    });

    createPage({
      path: `/route/${r.short}/stops`,
      component: path.resolve("./src/templates/route-stops-page.js"),
      context: {
        routeNo: r.short
      }
    });

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

  // result.data.postgres.stops.forEach(stop => {
  //   createPage({
  //     path: `/stop/${stop.stopId}`,
  //     component: path.resolve("./src/templates/stop-page.js"),
  //     context: {
  //       stopId: stop.stopId
  //     }
  //   });
  // });
};
