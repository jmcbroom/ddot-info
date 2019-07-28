import React from "react";
import { ThemeProvider } from "@material-ui/styles";
import { Helmet } from "react-helmet";
import theme from "../theme";
import TopNav from "./TopNav";
import "../css/app.css";

const Layout = ({ className, children }) => {
  return (
    <React.Fragment>
      <Helmet>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no" />
      </Helmet>
      <ThemeProvider theme={theme}>
        <div className={className}>{children}</div>
      </ThemeProvider>
    </React.Fragment>
  );
};

export default Layout;
