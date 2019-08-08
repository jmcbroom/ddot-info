import React from "react";
import { Link } from "gatsby";
import { InfoOutlined, Home } from "@material-ui/icons";

/** Navigation links used in TopNav */
const NavLinks = () => (
  <div style={{ display: "flex", alignContent: "center", alignItems: "center", flexWrap: "wrap" }}>
    <Link to={`/about`}>
      <InfoOutlined style={{ color: "#fff", margin:5 }} fontSize='large' />
    </Link>
    <Link to={`/`}>
      <Home style={{ color: "#fff", margin:5 }} fontSize='large' />
    </Link>
  </div>
);

export default NavLinks;
