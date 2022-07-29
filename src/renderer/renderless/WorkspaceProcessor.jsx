import React from 'react';
import { connect } from 'react-redux';
import * as queryActions from '../store/actions/queryActions';
import * as workSpaceActions from '../store/actions/workSpaceActions';
import * as querySelectors from '../store/selectors/querySelectors';
import * as workSpaceSelectors from '../store/selectors/workSpaceSelectors';
import {
	processQueryResult,
	shouldProcessQueryResult,
} from './workspaceProcessorScripts';

function WorkspaceProcessor(props) {
	React.useEffect(() => {
		const latest = shouldProcessQueryResult(props.results);
		if (latest) {
			processQueryResult(latest, props);
		}
	}, [props.results]);

	return null;
}

const mapStateToProps = state => ({
	results: querySelectors.selectResults(state),
	projects: workSpaceSelectors.selectProjects(state),
	path: workSpaceSelectors.selectPath(state),
});

const mapDispatchToProps = dispatch => ({
	setProjects: projects => dispatch(workSpaceActions.setProjects(projects)),
	setWorkSpace: workspace =>
		dispatch(workSpaceActions.setWorkSpace(workspace)),
});

export default connect(mapStateToProps, mapDispatchToProps)(WorkspaceProcessor);
