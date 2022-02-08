// const workerURL = new URL('./worker.renderer.dev.js', import.meta.url);
const workerURL = document.querySelector('script[type="text/js-worker"]').src;
console.log('dsdskdlskdlksldk', workerURL);
const newWorker = new Worker(workerURL, { type: 'module' });

// console.log("dlskdlskdlksldkslkdlskdsldks: ", import.meta.url);

export const default_state = {
  results: {},
  queue: {},
  scriptsQueue: {},
  queryShortcut: {},
  workers: [newWorker],
};

const query = (state = default_state, action) => {
  switch (action.type) {
    case 'SET_RESULTS':
      return {
        queue: state.queue,
        results: { ...state.results, ...action.payload },
        scriptsQueue: state.scriptsQueue,
        queryShortcut: state.queryShortcut,
        workers: state.workers,
      };

    case 'SET_QUEUE':
      return {
        results: state.results,
        queue: { ...state.queue, ...action.payload },
        scriptsQueue: state.scriptsQueue,
        queryShortcut: state.queryShortcut,
        workers: state.workers,
      };

    case 'RESET_QUEUE':
      return {
        results: state.results,
        queue: action.payload,
        scriptsQueue: state.scriptsQueue,
        queryShortcut: state.queryShortcut,
        workers: state.workers,
      };

    case 'SET_SCRIPTS_QUEUE':
      return {
        results: state.results,
        queue: state.queue,
        scriptsQueue: { ...state.scriptsQueue, ...action.payload },
        queryShortcut: state.queryShortcut,
        workers: state.workers,
      };

    case 'RESET_SCRIPTS_QUEUE':
      return {
        results: state.results,
        queue: state.queue,
        scriptsQueue: action.payload,
        queryShortcut: state.queryShortcut,
        workers: state.workers,
      };

    case 'SET_QUERY_SHORTCUT':
      return {
        results: state.results,
        queue: state.queue,
        scriptsQueue: state.scriptsQueue,
        queryShortcut: { ...action.payload },
        workers: state.workers,
      };

    default:
      return state;
  }
};

export default query;
