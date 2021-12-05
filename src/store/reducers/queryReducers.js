export const default_state = {
  results: {},
  queue: {},
  scriptsQueue: {},
  queryShortcut: {},
};

const query = (state = default_state, action) => {
  switch (action.type) {
    case 'SET_RESULTS':
      return {
        queue: state.queue,
        results: { ...state.results, ...action.payload },
        scriptsQueue: state.scriptsQueue,
        queryShortcut: state.queryShortcut,
      };

    case 'SET_QUEUE':
      return {
        results: state.results,
        queue: { ...state.queue, ...action.payload },
        scriptsQueue: state.scriptsQueue,
        queryShortcut: state.queryShortcut,
      };

    case 'RESET_QUEUE':
      return {
        results: state.results,
        queue: action.payload,
        scriptsQueue: state.scriptsQueue,
        queryShortcut: state.queryShortcut,
      };

    case 'SET_SCRIPTS_QUEUE':
      return {
        results: state.results,
        queue: state.queue,
        scriptsQueue: { ...state.scriptsQueue, ...action.payload },
        queryShortcut: state.queryShortcut,
      };

    case 'RESET_SCRIPTS_QUEUE':
      return {
        results: state.results,
        queue: state.queue,
        scriptsQueue: action.payload,
        queryShortcut: state.queryShortcut,
      };

    case 'SET_QUERY_SHORTCUT':
      return {
        results: state.results,
        queue: state.queue,
        scriptsQueue: state.scriptsQueue,
        queryShortcut: { ...action.payload },
      };

    case 'SET_QUERY_SHORTCUTS':
      return {
        results: state.results,
        queue: state.queue,
        scriptsQueue: state.scriptsQueue,
      };

    default:
      return state;
  }
};

export default query;
