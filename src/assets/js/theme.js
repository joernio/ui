import { createMuiTheme } from '@material-ui/core/styles/index.js';

const createTheme = mode =>
  createMuiTheme({
    typography: {
      fontFamily: ['Raleway', 'Roboto', 'sans-serif'].join(','),
    },
    palette: {
      type: mode ? 'dark' : 'light',
      sideNav: {
        background: {
          light: '#2C2C2C',
          dark: '#333333',
        },
        base: {
          light: '#7B7B7B',
          dark: '#7B7B7B',
        },
        hover: {
          light: '#FFFFFF',
          dark: '#FFFFFF',
        },
      },
      explorer: {
        background: {
          light: '#F3F3F3',
          dark: '#252526',
        },
        base: {
          light: '#616161',
          dark: '#CCCCCC',
        },
        hover: {
          light: '#E8E8E8',
          dark: '#2A2D2E',
        },
      },
      navBar: {
        background: {
          light: '#E5E5E5',
          dark: '#3C3C3C',
        },
        base: {
          light: '#525252',
          dark: '#B4B4B4',
        },
        hover: {
          light: '#C6C6C6',
          dark: '#505050',
        },
      },
      editorNavBar: {
        background: {
          light: '#ECECEC',
          dark: '#2D2D2D',
        },
        base: {
          light: '#989898',
          dark: '#8B8B8B',
        },
        hover: {
          light: '#DCDCDC',
          dark: '#3B3C3C',
        },
      },
      editor: {
        background: {
          light: '#FFFFFF',
          dark: '#1E1E1E',
        },
        base: {
          light: '#ECECEC',
          dark: '#6D6D6D',
        },
        hover: {
          light: '#A5A5A5',
          dark: '#CBCBCB',
        },
      },
    },
  });

export default createTheme;
