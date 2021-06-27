const default_state = {
  server_auth: {
    protocol: 'http',
    domain: 'localhost',
    port: '8080',
    auth_username: null,
    auth_password: null,
  },
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
