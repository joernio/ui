import { homedir } from 'os';

export const default_state = {
  server: {
    url: 'http://localhost:8080',
    auth_username: '',
    auth_password: '',
    enable_http: false,
  },
  websocket: {
    url: 'ws://localhost:8080/connect',
  },
  prefersDarkMode: true,
  prefersTerminalView: false,
  fontSize: '16px',
  scriptsDir: `${homedir()}/bin/joern/joern-cli/scripts`,
  uiIgnore: 'node_modules, vendor, build, .git',
};

const settings = (state = default_state, action) => {
  switch (action.type) {
    case 'SET_SETTINGS':
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

export default settings;
