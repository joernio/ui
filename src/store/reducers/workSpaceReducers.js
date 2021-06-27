const default_state = { path: '', projects: {} };

const workspace = (state = default_state, action) => {
  switch (action.type) {
    case 'SET_WORKSPACE':
      return {
        ...state,
        ...action.payload,
      };
    case 'SET_PROJECTS':
      return {
        path: state.path,
        projects: action.payload,
      };
    default:
      return state;
  }
};

export default workspace;
