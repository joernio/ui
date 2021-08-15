import React from 'react';
import clsx from 'clsx';
import MonacoEditor from 'react-monaco-editor';
import { connect } from 'react-redux';
import * as filesActions from '../../store/actions/filesActions';
import { makeStyles } from '@material-ui/core';
import { editorDidMount, handleFileAddedToRecent } from './editorScripts';
import styles from '../../assets/js/styles/views/editor_window/editorWindowStyles';

const useStyles = makeStyles(styles);

function EditorWindow(props) {
  const classes = useStyles(props);

  const refs = {
    editorContainerEl: React.useRef(null),
    editorEl: React.useRef(null),
  };

  React.useEffect(async () => {
    let is_open_project =
      props.workspace?.projects &&
      Object.keys(props.workspace.projects).filter(name =>
        props.workspace.projects[name].open ? true : false,
      );
    is_open_project = is_open_project && is_open_project.length;
    if (refs.editorEl.current && is_open_project) {
      const { openFileContent, isReadOnly } = await handleFileAddedToRecent(
        refs,
        props,
      );
      props.setOpenFileContent(openFileContent);
      props.setOpenFileIsReadOnly(isReadOnly);
    } else {
      props.setOpenFileContent('');
      props.setOpenFileIsReadOnly(true);
    }
  }, [props.files.recent, props.workspace.projects]);

  const { settings, files } = props;

  const options = {
    selectOnLineNumbers: true,
    roundedSelection: false,
    readOnly: files.openFileIsReadOnly,
    cursorStyle: 'line',
    automaticLayout: true,
    fontSize: settings?.fontSize
      ? Number(settings.fontSize.split('px')[0])
      : 16,
  };

  return (
    <div
      className={clsx(
        classes.editorContainerStyle,
        props.drawerWidth ? classes.drawerOpenStyle : classes.drawerCloseStyle,
      )}
      data-test="editor-window"
    >
      <MonacoEditor
        ref={refs.editorEl}
        width="100%"
        height="100%"
        theme={settings.prefersDarkMode ? 'vs-dark' : 'vs-light'}
        language="typescript"
        value={files?.openFileContent}
        options={options}
        onChange={(newValue, _) => props.setOpenFileContent(newValue)}
        editorDidMount={editorDidMount}
      />
    </div>
  );
}

const mapStateToProps = state => {
  return {
    files: state.files,
    query: state.query,
    workspace: state.workspace,
    settings: state.settings,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setOpenFileContent: content => {
      return dispatch(filesActions.setOpenFileContent(content));
    },
    setOpenFileIsReadOnly: bool => {
      return dispatch(filesActions.setOpenFileIsReadOnly(bool));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditorWindow);
