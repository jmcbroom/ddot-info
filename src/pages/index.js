import React from 'react';
import '../css/app.css';

import Homepage from '../components/Homepage'
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import MuiLink from '@material-ui/core/Link';



function MadeWithLove() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Built with love by the '}
      <MuiLink color="inherit" href="https://material-ui.com/">
        Material-UI
      </MuiLink>
      {' team.'}
    </Typography>
  );
}

export default function App() {
  return (
    <Container maxWidth="lg">
      <Homepage />
    </Container>
  );
}
