import React from 'react';
import { connect } from 'react-redux';
import * as querySelectors from '../store/selectors/querySelectors';
import * as workSpaceSelectors from '../store/selectors/workSpaceSelectors';
import * as terminalSelectors from '../store/selectors/terminalSelectors';
import * as settingsSelectors from '../store/selectors/settingsSelectors';
import { refreshRecent, refreshOpenFiles } from '../assets/js/utils/scripts';

import {
	processFiles,
	processMethodListForBinaryProjects,
	ensureRulesConfigFileExists,
} from './filesProcessorScripts';

function FilesProcessor(props) {
	React.useEffect(() => {
		refreshRecent();
		refreshOpenFiles();
	}, []);

	React.useEffect(() => {
		processFiles(props);
	}, [props.results, props.projects]);

	React.useEffect(() => {
		processMethodListForBinaryProjects(props.circuit_ui_responses);
	}, [props.circuit_ui_responses]);

	React.useEffect(() => {
		ensureRulesConfigFileExists();
	}, [props.rulesConfigFilePath]);

	return null;
}

const mapStateToProps = state => ({
	results: querySelectors.selectResults(state),
	projects: workSpaceSelectors.selectProjects(state),
	circuit_ui_responses: terminalSelectors.selectCircuitUiResponses(state),
	rulesConfigFilePath: settingsSelectors.selectRulesConfigFilePath(state),
});

export default connect(mapStateToProps, null)(FilesProcessor);
