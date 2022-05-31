import React from 'react';
import { connect } from 'react-redux';
import * as settingsSelectors from '../store/selectors/settingsSelectors';
import * as querySelectors from '../store/selectors/querySelectors';
import * as statusSelectors from '../store/selectors/statusSelectors';
import * as queryActions from '../store/actions/queryActions';
import { shouldRunQuery, processScriptResult } from './queryProcessorScripts';
import {
	addToQueue,
	addWorkSpaceQueryToQueue,
	deepClone,
} from '../assets/js/utils/scripts';

function QueryProcessor(props) {
	const [state, setState] = React.useState({
		prev_queue: {},
		prev_scripts_queue: {},
		prev_results: {},
	});

	const handleSetState = obj => {
		if (obj) {
			Promise.resolve(obj).then(obj => {
				setState(state => ({ ...state, ...obj }));
			});
		}
	};

	React.useEffect(() => {
		const query = props.peekQueue();
		const run_query = shouldRunQuery(state.prev_queue, props.queue, query);

		if (run_query) {
			props.mainQuery(query);

			if (
				query.query.startsWith('open') ||
				query.query.startsWith('importCode') ||
				query.query.startsWith('importCpg') ||
				query.query.startsWith('workspace')
			) {
				props.enQueueQuery({
					query: 'cpg.metaData.language.l',
					origin: 'workspace',
					ignore: true,
				});
			}
		}

		handleSetState({
			prev_queue: props.queue ? deepClone(props.queue) : {},
		});
	}, [props.queue]);

	React.useEffect(() => {
		const query = props.peekScriptsQueue();
		const run_query = shouldRunQuery(
			state.prev_scripts_queue,
			props.scriptsQueue,
			query,
		);
		run_query && props.mainQuery(query);
		handleSetState({
			prev_scripts_queue: props.scriptsQueue
				? deepClone(props.scriptsQueue)
				: {},
		});
	}, [props.scriptsQueue]);

	React.useEffect(() => {
		props.connected && addToQueue(addWorkSpaceQueryToQueue(), props);
	}, [props.connected, props.server, props.websocket]);

	React.useEffect(() => {
		processScriptResult(state.prev_results, props.results, handleSetState);
	}, [props.results]);

	return null;
}

const mapStateToProps = state => ({
	results: querySelectors.selectResults(state),
	queue: querySelectors.selectQueue(state),
	scriptsQueue: querySelectors.selectScriptsQueue(state),
	connected: statusSelectors.selectConnected(state),
	server: settingsSelectors.selectServer(state),
	websocket: settingsSelectors.selectWebSocket(state),
});

const mapDispatchToProps = dispatch => ({
	mainQuery: query => dispatch(queryActions.mainQuery(query)),
	peekQueue: () => dispatch(queryActions.peekQueue()),
	peekScriptsQueue: () => dispatch(queryActions.peekScriptsQueue()),
	enQueueQuery: query => dispatch(queryActions.enQueueQuery(query)),
});

export default connect(mapStateToProps, mapDispatchToProps)(QueryProcessor);
