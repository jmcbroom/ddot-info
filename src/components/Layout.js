import React from "react";

import TopNav from "./TopNav";

const Layout = ({ className, children }) => {
  return (
    <div className={className}>
      <TopNav />
      {children}
    </div>
  );
};

export default Layout;
