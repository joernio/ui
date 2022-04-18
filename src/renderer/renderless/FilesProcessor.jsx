import React from 'react';
import { connect } from 'react-redux';
import { refreshRecent, refreshOpenFiles } from '../assets/js/utils/scripts';

import { processFiles } from './filesProcessorScripts';

function FilesProcessor(props) {
	React.useEffect(() => {
		refreshRecent();
		refreshOpenFiles();
	}, []);

	React.useEffect(() => {
		processFiles(props);
	}, [props.query.results, props.workspace.projects]);

	return null;
}

const mapStateToProps = state => ({
	files: state.files,
	workspace: state.workspace,
	editor: state.editor,
	query: state.query,
});

export default connect(mapStateToProps, null)(FilesProcessor);
