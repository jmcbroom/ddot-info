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
  actions.setWebpackConfig({
    resolve: {
      alias: {
        "../../theme.config$": path.join(__dirname, "src/semantic/theme.config")
      }
    }
  });
};

exports.createPages = async ({ graphql, actions: { createPage } }) => {
  const agencies = ["ddot", "smart", "the-ride", "transit-windsor"];
  const result = await graphql(`
    {
      postgres {
        routes: allRoutesList(condition: { feedIndex: 1 }) {
          agencyId
          routeShortName
          routeLongName
        }
        stops: allStopsList(condition: { feedIndex: 1 }) {
          feedIndex
          stopId
        }
      }
    }
  `);

  result.data.postgres.routes.forEach(r => {
    createPage({
      path: `/route/${r.routeShortName}`,
      component: path.resolve("./src/templates/route-page.js"),
      context: {
        routeNo: r.routeShortName
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
