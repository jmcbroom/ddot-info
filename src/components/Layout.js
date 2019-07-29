import React from "react";
import { ThemeProvider } from "@material-ui/styles";
import { Helmet } from "react-helmet";
import theme from "../theme";
import TopNav from "./TopNav";
import "../css/app.css";
import { Divider } from "@material-ui/core";

const Footer = () => (
  <div style={{ gridArea: 'footer', background: "rgba(0, 68, 69, 0.2)", height: "5em", padding: '1em' }}>
    <Divider />
    <p>pwoeimfwoeimfwoeimf wefoimwe wefimwoeifm qwemfwoeimf wofmiwe</p>
  </div>
);

const Layout = ({ className, children }) => {
  return (
    <React.Fragment>
      <Helmet>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no" />
      </Helmet>
      <ThemeProvider theme={theme}>
        <div className={className}>{children}</div>
        <Footer />
      </ThemeProvider>
    </React.Fragment>
  );
};

export default Layout;
