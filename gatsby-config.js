let activeEnv = process.env.ACTIVE_ENV || process.env.NODE_ENV || "development";

require("dotenv").config({
  path: `.env.${activeEnv}`
});

module.exports = {
  plugins: [
    'gatsby-plugin-top-layout',
    {
      resolve: 'gatsby-plugin-material-ui',
      // If you want to use styled components you should change the injection order.
      options: {
        // stylesProvider: {
        //   injectFirst: true,
        // },
      },
    },    
    {
      resolve: "gatsby-source-pg",
      options: {
        connectionString: process.env.PG_CONN,
        schema: "gtfs"
      }
    },
    // If you want to use styled components you should add the plugin here.
    // 'gatsby-plugin-styled-components',
    'gatsby-plugin-react-helmet',
  ],
  siteMetadata: {
    title: 'My page',
  },
};
