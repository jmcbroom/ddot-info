import React from 'react';
import { Link } from 'gatsby';
import { Info, Home } from '@material-ui/icons';

/** Navigation links used in TopNav */
const NavLinks = () => (
  <div style={{ display: 'flex', alignContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
    <Link to={`/about` }>
      <Info style={{ color: '#fff', paddingRight: '.5em', fontSize: '1.75em' }} />
    </Link>
    <Link to={`/`}>
      <Home style={{ color: '#fff', paddingRight: '.5em', fontSize: '1.75em' }} />
    </Link>
  </div>
);

export default NavLinks;
