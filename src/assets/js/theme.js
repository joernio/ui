import { createMuiTheme } from '@material-ui/core/styles/index.js';

const createTheme = mode =>
  createMuiTheme({
    typography: {
      fontFamily: ['Raleway', 'Roboto', 'sans-serif'].join(','),
    },
    palette: {
      type: mode ? 'dark' : 'light',
      titlebar: {
        light: '#DDDDDD',
        dark: '#3C3C3C',
      },
      editor: {
        light: '#FFFFFF',
        dark: '#1E1E1E',
      },
      drawer: {
        light: 'F3F3F3',
        dark: '#252526',
      },
    },
  });

export default createTheme;
