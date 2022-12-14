import React from 'react';
import { connect } from 'react-redux';
import * as querySelectors from '../store/selectors/querySelectors';
import * as workSpaceSelectors from '../store/selectors/workSpaceSelectors';
import * as terminalSelectors from '../store/selectors/terminalSelectors';
import * as settingsSelectors from '../store/selectors/settingsSelectors';
import * as findingsSelectors from '../store/selectors/findingsSelectors';
import { refreshRecent, refreshOpenFiles } from '../assets/js/utils/scripts';
import * as findingsActions from '../store/actions/findingsActions';

import {
	processFiles,
  processScripts,
	// processScriptsTemp,
	processMethodListForBinaryProjects,
	ensureRulesConfigFileExists,
} from './filesProcessorScripts';

// TODO should be moved to GenericProcessor
function FilesProcessor(props) {
	React.useEffect(() => {
		refreshRecent();
		refreshOpenFiles();
	}, []);

	// TODO should be moved to QueryProcessor
	React.useEffect(() => {
		processFiles(props.results);
	}, [props.results, props.projects]);

	// TODO should be moved to GenericProcessor
	React.useEffect(() => {
		processMethodListForBinaryProjects(props.circuit_ui_responses);
	}, [props.circuit_ui_responses]);

	// TODO should be moved to GenericProcessor
	React.useEffect(() => {
		ensureRulesConfigFileExists();
	}, [props.rulesConfigFilePath]);

	React.useEffect(() => {
    processFiles(props.scriptsResults)
		processScripts(props.scriptsResults);
	}, [props.scriptsResults]);

  React.useEffect(()=>{
    processScripts(props.results)
  },[props.results]);

	React.useEffect(() => {
		props.resetFindings();
	}, []);

	return null;
}

const mapStateToProps = state => ({
	results: querySelectors.selectResults(state),
  scriptsResults: querySelectors.selectScriptsResults(state),
	projects: workSpaceSelectors.selectProjects(state),
	circuit_ui_responses: terminalSelectors.selectCircuitUiResponses(state),
	rulesConfigFilePath: settingsSelectors.selectRulesConfigFilePath(state),
	findings: findingsSelectors.selectFindings(state),
});

const mapDispatchToProps = dispatch => ({
	resetFindings: () => {
		const value = {
			open_sarif_finding_path: '',
			triages: {},
			triage_ids: [],
		};
		dispatch(findingsActions.setFindings(value));
	},
});

export default connect(mapStateToProps, mapDispatchToProps)(FilesProcessor);
