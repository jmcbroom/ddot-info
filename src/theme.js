import { red } from '@material-ui/core/colors';
import { createMuiTheme } from '@material-ui/core/styles';

// A custom theme for this app
const theme = createMuiTheme({
  typography: {
    fontFamily:
      'Gibson Detroit Regular' +
      '"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif',
  },
  palette: {
    primary: {
      main: '#B0D27B',
    },
    secondary: {
      main: '#19857b',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#fff',
    },
  },
});

export default theme;
