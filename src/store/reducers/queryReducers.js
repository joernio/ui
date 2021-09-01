export const default_state = { results: {}, queue: {}, scriptsQueue: {} };

const query = (state = default_state, action) => {
  switch (action.type) {
    case 'SET_RESULTS':
      return {
        queue: state.queue,
        results: { ...state.results, ...action.payload },
        scriptsQueue: state.scriptsQueue,
      };

    case 'SET_QUEUE':
      return {
        results: state.results,
        queue: { ...state.queue, ...action.payload },
        scriptsQueue: state.scriptsQueue,
      };

    case 'RESET_QUEUE':
      return {
        results: state.results,
        queue: action.payload,
        scriptsQueue: state.scriptsQueue,
      };

    case 'SET_SCRIPTS_QUEUE':
      return {
        results: state.results,
        queue: state.queue,
        scriptsQueue: { ...state.scriptsQueue, ...action.payload },
      };

    case 'RESET_SCRIPTS_QUEUE':
      return {
        results: state.results,
        queue: state.queue,
        scriptsQueue: action.payload,
      };

    default:
      return state;
  }
};

export default query;
