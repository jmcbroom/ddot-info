import React from "react";
import { ThemeProvider } from "@material-ui/styles";
import { Helmet } from "react-helmet";
import theme from "../theme";
import TopNav from "./TopNav";
import "../css/app.css";
import { Divider, Typography } from "@material-ui/core";

const Footer = () => (
  <div style={{ gridArea: 'footer', background: "rgba(0, 68, 69, 0.2)", height: "5em", padding: '1em' }}>
    <Divider />
    <Typography>Created by IET. City of Detroit, 2019.</Typography>
  </div>
);

const Layout = ({ className, children }) => {
  return (
    <React.Fragment>
      <Helmet>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no" />
        <link href='https://api.tiles.mapbox.com/mapbox-gl-js/v1.1.1/mapbox-gl.css' rel='stylesheet' />
      </Helmet>
      <ThemeProvider theme={theme}>
        <div className={className}>{children}</div>
        <Footer />
      </ThemeProvider>
    </React.Fragment>
  );
};

export default Layout;
