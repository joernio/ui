import { spawn, Pool, Worker } from 'threads';

const workerURL = document.querySelector('script[type="text/js-worker"]').src;
const workerPool = Pool(() => spawn(new Worker(workerURL)));

export const default_state = {
	results: {},
  scriptsResults: {},
	queue: {},
	scriptsQueue: {},
	queryShortcut: {},
	workerPool,
};

const query = (state = default_state, action) => {
	switch (action.type) {
		case 'SET_RESULTS':
			return {
				queue: state.queue,
				results: { ...state.results, ...action.payload },
        scriptsResults: state.scriptsResults,
				scriptsQueue: state.scriptsQueue,
				queryShortcut: state.queryShortcut,
				workerPool: state.workerPool,
			};

      case 'SET_SCRIPTS_RESULTS':
        return {
          queue: state.queue,
          results: state.results,
          scriptsResults: { ...state.scriptsResults, ...action.payload },
          scriptsQueue: state.scriptsQueue,
          queryShortcut: state.queryShortcut,
          workerPool: state.workerPool,
        };

		case 'SET_QUEUE':
			return {
				results: state.results,
        scriptsResults: state.scriptsResults,
				queue: { ...state.queue, ...action.payload },
				scriptsQueue: state.scriptsQueue,
				queryShortcut: state.queryShortcut,
				workerPool: state.workerPool,
			};

		case 'RESET_QUEUE':
			return {
				results: state.results,
        scriptsResults: state.scriptsResults,
				queue: action.payload,
				scriptsQueue: state.scriptsQueue,
				queryShortcut: state.queryShortcut,
				workerPool: state.workerPool,
			};

		case 'SET_SCRIPTS_QUEUE':
			return {
				results: state.results,
        scriptsResults: state.scriptsResults,
				queue: state.queue,
				scriptsQueue: { ...state.scriptsQueue, ...action.payload },
				queryShortcut: state.queryShortcut,
				workerPool: state.workerPool,
			};

		case 'RESET_SCRIPTS_QUEUE':
			return {
				results: state.results,
        scriptsResults: state.scriptsResults,
				queue: state.queue,
				scriptsQueue: action.payload,
				queryShortcut: state.queryShortcut,
				workerPool: state.workerPool,
			};

		case 'SET_QUERY_SHORTCUT':
			return {
				results: state.results,
        scriptsResults: state.scriptsResults,
				queue: state.queue,
				scriptsQueue: state.scriptsQueue,
				queryShortcut: { ...action.payload },
				workerPool: state.workerPool,
			};

		default:
			return state;
	}
};

export default query;
