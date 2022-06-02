import React from 'react';
import { connect } from 'react-redux';
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
		const run_query = shouldRunQuery(
			state.prev_queue,
			props.query.queue,
			query,
		);

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
			prev_queue: props.query.queue ? deepClone(props.query.queue) : {},
		});
	}, [props.query.queue]);

	React.useEffect(() => {
		const query = props.peekScriptsQueue();
		const run_query = shouldRunQuery(
			state.prev_scripts_queue,
			props.query.scriptsQueue,
			query,
		);
		run_query && props.mainQuery(query);
		handleSetState({
			prev_scripts_queue: props.query.scriptsQueue
				? deepClone(props.query.scriptsQueue)
				: {},
		});
	}, [props.query.scriptsQueue]);

	React.useEffect(() => {
		props.status.connected && addToQueue(addWorkSpaceQueryToQueue(), props);
	}, [
		props.status.connected,
		props.settings.server,
		props.settings.websocket,
	]);

	React.useEffect(() => {
		(async function run (){
			await processScriptResult(
				state.prev_results,
				props.query.results,
				handleSetState,
			);
		}())
	}, [props.query.results]);

	return null;
}

const mapStateToProps = state => ({
	query: state.query,
	status: state.status,
	settings: state.settings,
});

const mapDispatchToProps = dispatch => ({
	mainQuery: query => dispatch(queryActions.mainQuery(query)),
	peekQueue: () => dispatch(queryActions.peekQueue()),
	peekScriptsQueue: () => dispatch(queryActions.peekScriptsQueue()),
	enQueueQuery: query => dispatch(queryActions.enQueueQuery(query)),
});

export default connect(mapStateToProps, mapDispatchToProps)(QueryProcessor);
