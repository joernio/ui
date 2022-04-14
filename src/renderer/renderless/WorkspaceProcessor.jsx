import React from 'react';
import { connect } from 'react-redux';
import * as queryActions from '../store/actions/queryActions';
import * as workSpaceActions from '../store/actions/workSpaceActions';
import {
	processQueryResult,
	shouldProcessQueryResult,
} from './workspaceProcessorScripts';

function WorkspaceProcessor(props) {
	React.useEffect(() => {
		const latest = shouldProcessQueryResult(props.query.results);
		if (latest) {
			processQueryResult(latest, props);
		}
	}, [props.query.results]);

	return null;
}

const mapStateToProps = state => ({
	query: state.query,
	workspace: state.workspace,
});

const mapDispatchToProps = dispatch => ({
	enQueueQuery: query => dispatch(queryActions.enQueueQuery(query)),
	setProjects: projects => dispatch(workSpaceActions.setProjects(projects)),
	setWorkSpace: workspace =>
		dispatch(workSpaceActions.setWorkSpace(workspace)),
});

export default connect(mapStateToProps, mapDispatchToProps)(WorkspaceProcessor);
