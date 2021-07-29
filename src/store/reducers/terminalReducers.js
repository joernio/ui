const default_state = {
  term: null,
  fitAddon: null,
  prev_results: null,
  prev_workspace: {},
  history: {
    prev_queries: {},
    next_queries: {},
  },
  isMaximized: true,
  busy: false,
};

const terminal = (state = default_state, action) => {
  switch (action.type) {
    case 'SET_TERMINAL':
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

export default terminal;
