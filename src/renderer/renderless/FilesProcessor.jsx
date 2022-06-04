import React from 'react';
import { connect } from 'react-redux';
import * as querySelectors from '../store/selectors/querySelectors';
import * as workSpaceSelectors from '../store/selectors/workSpaceSelectors';
import { refreshRecent, refreshOpenFiles } from '../assets/js/utils/scripts';

import { processFiles } from './filesProcessorScripts';

function FilesProcessor(props) {
	React.useEffect(() => {
		refreshRecent();
		refreshOpenFiles();
	}, []);

	React.useEffect(() => {
		processFiles(props);
	}, [props.results, props.projects]);

	return null;
}

const mapStateToProps = state => ({
	results: querySelectors.selectResults(state),
	projects: workSpaceSelectors.selectProjects(state),
});

export default connect(mapStateToProps, null)(FilesProcessor);
