import React from "react";
import { ThemeProvider } from '@material-ui/styles';
import { Helmet } from 'react-helmet';
import theme from '../theme';
import TopNav from "./TopNav";
import '../css/app.css'

const Layout = ({ className, children }) => {
  return (
    <React.Fragment>
    <Helmet>
      <meta
        name="viewport"
        content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
      />
      {/* <link
        href="https://fonts.googleapis.com/css?family=Roboto:400,500,700&display=swap"
        rel="stylesheet"
      /> */}
    </Helmet>
    <div className={className}>
      <TopNav />
      {children}
    </div>
  </React.Fragment>
  );
};

export default Layout;
