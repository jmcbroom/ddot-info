let activeEnv = process.env.ACTIVE_ENV || process.env.NODE_ENV || "development";

require("dotenv").config({
  path: `.env.${activeEnv}`
});

module.exports = {
  plugins: [
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `ddot.info`,
        short_name: `ddot.info`,
        start_url: `/`,
        background_color: `#f7f0eb`,
        theme_color: `#a2466c`,
        display: `standalone`,
      },
    },
    `gatsby-plugin-offline`,
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: `UA-107915075-4`
      }
    },
    `gatsby-plugin-netlify`,
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
    title: 'ddot.info',
  },
};
