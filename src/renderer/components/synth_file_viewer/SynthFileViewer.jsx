import React from 'react';
import DotGraphViewer from '../dot_graph_viewer/DotGraphViewer';
import QueryShortcutsViewer from '../query_shortcuts_viewer/QueryShortcutsViewer';
import ScriptReportViewer from '../script_report_viewer/ScriptReportViewer';
import BinaryViewer from '../binary_viewer/BinaryViewer';
import RulesViewer from '../rules_viewer/RulesViewer';
import EditorWindowBanner from '../editor_window_banner/EditorWindowBanner';
import { syntheticFiles } from '../../assets/js/utils/defaultVariables';

function SynthFileViewer(props) {
	return props.path.endsWith(syntheticFiles[0]) ? (
		<DotGraphViewer path={props.path} content={props.content} />
	) : props.path.endsWith(syntheticFiles[1]) ? (
		<QueryShortcutsViewer {...props} />
	) : props.path.endsWith(syntheticFiles[2]) ? (
		<ScriptReportViewer path={props.path} content={props.content} />
	) : props.path.endsWith(syntheticFiles[3]) ? (
		<>
			<EditorWindowBanner message={'Read-only Mode'} />
			<BinaryViewer {...props} />
		</>
	) : props.path.endsWith(syntheticFiles[4]) ? (
		<RulesViewer {...props} />
	) : null;
}

export default SynthFileViewer;
