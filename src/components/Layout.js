import React from "react";
import { ThemeProvider } from "@material-ui/styles";
import { Helmet } from "react-helmet";
import theme from "../theme";
import { Link } from "gatsby";
import "../css/app.css";
import { Divider, Typography } from "@material-ui/core";

const Footer = () => (
  <div style={{ gridArea: 'footer', height: "4em", padding: '1em' }}>
    <Divider style={{margin: 10}} />
    <Typography variant={'subtitle1'} style={{color: '#555'}} align='center'>2019, City of Detroit. <Link to={`/about`}>Read more about this site.</Link> You can provide feedback <a href='https://app.smartsheet.com/b/form/28665a43770d48b5bbdfe35f3b7b45ac'>using this form.</a></Typography>
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
