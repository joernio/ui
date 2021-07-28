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
    if (refs.editorEl.current) {
      const { openFileContent, isReadOnly } = await handleFileAddedToRecent(
        refs,
        props,
      );
      props.setOpenFileContent(openFileContent);
      props.setOpenFileIsReadOnly(isReadOnly);
    }
  }, [props.files.recent]);

  const { settings, files } = props;

  const options = {
    selectOnLineNumbers: true,
    roundedSelection: false,
    readOnly: files.openFileIsReadOnly,
    cursorStyle: 'line',
    automaticLayout: true,
  };

  return (
    <div
      className={clsx(
        classes.editorContainerStyle,
        props.drawerWidth ? classes.drawerOpenStyle : classes.drawerCloseStyle,
      )}
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
