const default_state = {
  refs: null,
  highlightRange: { startLine: null, endLine: null },
};

const editor = (state = default_state, action) => {
  switch (action.type) {
    case 'SET_EDITOR':
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

export default editor;
