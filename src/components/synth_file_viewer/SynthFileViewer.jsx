import React from 'react';
import DotGraphViewer from '../../components/dot_graph_viewer/DotGraphViewer';
import QueryShortcutsViewer from '../../components/query_shortcuts_viewer/QueryShortcutsViewer';

function SynthFileViewer(props) {
  console.log('synthfileviewer: props.path: ', props.path);
  return props.path === 'AST Graph' ? (
    <DotGraphViewer path={props.path} content={props.content} />
  ) : props.path === 'Query Shortcuts' ? (
    <QueryShortcutsViewer path={props.path} content={props.content} />
  ) : null;
}

export default SynthFileViewer;
