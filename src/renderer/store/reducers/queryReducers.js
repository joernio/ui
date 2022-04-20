import { spawn, Pool, Worker } from 'threads';

const workerURL = document.querySelector('script[type="text/js-worker"]').src;
const workerPool = Pool(() => spawn(new Worker(workerURL)));

export const default_state = {
	results: {},
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
				scriptsQueue: state.scriptsQueue,
				queryShortcut: state.queryShortcut,
				workerPool: state.workerPool,
			};

		case 'SET_QUEUE':
			return {
				results: state.results,
				queue: { ...state.queue, ...action.payload },
				scriptsQueue: state.scriptsQueue,
				queryShortcut: state.queryShortcut,
				workerPool: state.workerPool,
			};

		case 'RESET_QUEUE':
			return {
				results: state.results,
				queue: action.payload,
				scriptsQueue: state.scriptsQueue,
				queryShortcut: state.queryShortcut,
				workerPool: state.workerPool,
			};

		case 'SET_SCRIPTS_QUEUE':
			return {
				results: state.results,
				queue: state.queue,
				scriptsQueue: { ...state.scriptsQueue, ...action.payload },
				queryShortcut: state.queryShortcut,
				workerPool: state.workerPool,
			};

		case 'RESET_SCRIPTS_QUEUE':
			return {
				results: state.results,
				queue: state.queue,
				scriptsQueue: action.payload,
				queryShortcut: state.queryShortcut,
				workerPool: state.workerPool,
			};

		case 'SET_QUERY_SHORTCUT':
			return {
				results: state.results,
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
