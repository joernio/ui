const default_state = { connected: null, toast: null };

const status = (state = default_state, action) => {
  switch (action.type) {
    case 'SET_STATUS':
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

export default status;
