import React from 'react';
import DotGraphViewer from '../../components/dot_graph_viewer/DotGraphViewer';
import QueryShortcutsViewer from '../../components/query_shortcuts_viewer/QueryShortcutsViewer';
import ScriptReportViewer from '../../components/script_report_viewer/ScriptReportViewer';

function SynthFileViewer(props) {
  return props.path.endsWith('AST Graph') ? (
    <DotGraphViewer path={props.path} content={props.content} />
  ) : props.path.endsWith('Query Shortcuts') ? (
    <QueryShortcutsViewer
      path={props.path}
      content={props.content}
      drawerWidth={props.drawerWidth}
    />
  ) : props.path.endsWith('Script Report') ? (
    <ScriptReportViewer path={props.path} content={props.content} />
  ) : null;
}

export default SynthFileViewer;
