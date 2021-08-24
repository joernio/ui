export const default_state = {
  server: {
    url: 'http://localhost:8080',
    auth_username: '',
    auth_password: '',
  },
  websocket: {
    url: 'ws://localhost:8080/connect',
  },
  prefersDarkMode: true,
  prefersTerminalView: true,
  fontSize: '16px',
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
