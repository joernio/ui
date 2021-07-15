const default_state = { results: {}, queue: {} };

const query = (state = default_state, action) => {
  switch (action.type) {
    case 'SET_RESULTS':
      return {
        queue: state.queue,
        results: { ...state.results, ...action.payload },
      };
    case 'SET_QUEUE':
      return {
        results: state.results,
        queue: { ...state.queue, ...action.payload },
      };

    case 'RESET_QUEUE':
      return {
        results: state.results,
        queue: action.payload,
      };
    default:
      return state;
  }
};

export default query;
