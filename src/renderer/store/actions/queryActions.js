import CpgAPI from '../../api';
import {
	handleAPIQueryError,
	performDeQueueQuery,
	performEnQueueQuery,
	performPeekQueue,
	performPushResult,
} from '../../assets/js/utils/scripts';
import { store } from '../configureStore';

const API = new CpgAPI();

export const setResults = payload => dispatch => {
	dispatch({
		type: 'SET_RESULTS',
		payload,
	});
};

export const setScriptsResults = payload => dispatch => {
	dispatch({
		type: 'SET_SCRIPTS_RESULTS',
		payload,
	});
};

export const setQueue = payload => dispatch =>
	dispatch({
		type: 'SET_QUEUE',
		payload,
	});

export const resetQueue = payload => dispatch =>
	dispatch({
		type: 'RESET_QUEUE',
		payload,
	});

export const setScriptsQueue = payload => dispatch =>
	dispatch({
		type: 'SET_SCRIPTS_QUEUE',
		payload,
	});

export const resetScriptsQueue = payload => dispatch =>
	dispatch({
		type: 'RESET_SCRIPTS_QUEUE',
		payload,
	});

export const setQueryShortcut = payload => dispatch =>
	dispatch({
		type: 'SET_QUERY_SHORTCUT',
		payload,
	});

export const enQueueQuery = query => dispatch => {
	const { queue } = store.getState().query;
	const updated_queue = performEnQueueQuery(query, queue);
	dispatch(setQueue(updated_queue));
};

export const deQueueQuery = () => dispatch => {
	const { queue } = store.getState().query;
	const { queue: updated_queue, query } = performDeQueueQuery(queue);
	dispatch(setQueue(updated_queue));
	return query;
};

export const peekQueue = () => () => {
	const { queue } = store.getState().query;
	return performPeekQueue(queue);
};

export const enQueueScriptsQuery = query => dispatch => {
	const { scriptsQueue } = store.getState().query;
	const updated_scripts_queue = performEnQueueQuery(query, scriptsQueue);
	dispatch(setScriptsQueue(updated_scripts_queue));
};

export const deQueueScriptsQuery = () => dispatch => {
	const { scriptsQueue } = store.getState().query;
	const { queue: updated_scripts_queue, query } =
		performDeQueueQuery(scriptsQueue);
	dispatch(setScriptsQueue(updated_scripts_queue));
	return query;
};

export const peekScriptsQueue = () => () => {
	const { scriptsQueue } = store.getState().query;
	return performPeekQueue(scriptsQueue);
};

export const pushResult = result => dispatch => {
	const { results } = store.getState().query;
	const updated_results = performPushResult(result, results);
	dispatch(setResults(updated_results));
};

export const pushScriptsResult = result => dispatch => {
	const { scriptsResults } = store.getState().query;
	const updated_results = performPushResult(result, scriptsResults);
	dispatch(setScriptsResults(updated_results));
};

export const runQuery = query_string => () =>
	API.query(query_string).then(data => {
		if (data && data.uuid) {
			return data;
		}
		if (data && data.err) {
			throw new Error(data.err);
		} else {
			const err = Object.keys(data)
				.map(key => data[key])
				.join('\n');
			throw new Error(err);
		}
	});

export const getQueryResult = uuid => () =>
	API.getQueryResult(uuid).then(data => {
		if (data && data.uuid) {
			return data;
		}
		if (data && data.err) {
			throw new Error(data.err);
		} else {
			const err = Object.keys(data)
				.map(key => data[key])
				.join('\n');
			throw new Error(err);
		}
	});

export const postQuery = (post_query, main_result_key) => dispatch =>
	runQuery(post_query)()
		.then(data => {
			const { results } = store.getState().query;
			const result = results[main_result_key];

			if (result) {
				result.post_query_uuid = data.uuid;
				dispatch(setResults(results));
			}
		})
		.catch(err => {
			handleAPIQueryError(err);
		});

export const mainQuery = query => dispatch =>
	runQuery(query.query)()
		.then(data => {
			const query_result = {
				[data.uuid]: {
					result: { stdout: null, stderr: null },
					t_0: new Date().getTime(),
					t_1: null,
					...query,
				},
			};

			if (query.origin === 'script') {
				dispatch(pushScriptsResult(query_result));
			} else {
				dispatch(pushResult(query_result));
			}
		})
		.catch(err => {
			handleAPIQueryError(err);
		});
