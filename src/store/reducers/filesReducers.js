const defaultState = { recent: {} };

const files = (state = defaultState, action) => {
  switch (action.type) {
    case 'SET_RECENT':
      return {
        recent: { ...state.recent, ...action.payload.recent },
      };
    default:
      return state;
  }
};

export default files;
