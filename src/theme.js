import { red } from '@material-ui/core/colors';
import { createMuiTheme } from '@material-ui/core/styles';

// A custom theme for this app
const theme = createMuiTheme({
  typography: {
    fontFamily:['Gibson Detroit Regular','Gibson Detroit Light',"Segoe UI"]
  },
  overrides: {
    MuiFormLabel: {
      asterisk: {
        display: 'none'
      }
    },
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
      default: '#CCDADA',
    },
  },
});

export default theme;
