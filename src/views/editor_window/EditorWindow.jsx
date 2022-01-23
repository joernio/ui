import React from 'react';
import clsx from 'clsx';
import MonacoEditor from 'react-monaco-editor';
import ImageViewer from '../../components/image_viewer/ImageViewer';
import SynthFileViewer from '../../components/synth_file_viewer/SynthFileViewer';
import EditorTabs from '../../components/editor_tabs/EditorTabs';
import EditorWindowBanner from '../../components/editor_window_banner/EditorWindowBanner';
import { connect } from 'react-redux';
import * as filesActions from '../../store/actions/filesActions';
import * as editorActions from '../../store/actions/editorActions';
import { makeStyles } from '@material-ui/core';
import {
  editorDidMount,
  handleEditorOnChange,
  handleEditorGoToLineAndHighlight,
} from './editorScripts';
import styles from '../../assets/js/styles/views/editor_window/editorWindowStyles';
import {
  imageFileExtensions,
  syntheticFiles,
} from '../../assets/js/utils/defaultVariables';
import { getExtension } from '../../assets/js/utils/scripts';

const useStyles = makeStyles(styles);

function EditorWindow(props) {
  const classes = useStyles(props);

  const refs = {
    editorEl: React.useRef(null),
  };

  React.useEffect(() => {
    props.setRefs(refs);
  }, []);

  React.useEffect(() => {
    refs.editorEl.current &&
      setTimeout(
        () =>
          handleEditorGoToLineAndHighlight(refs, props.editor.highlightRange),
        1000,
      );
  }, [props.editor.highlightRange]);

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
      <EditorTabs />
      {imageFileExtensions.includes(getExtension(files.openFilePath)) ? (
        <ImageViewer src={files.openFilePath} />
      ) : syntheticFiles.filter(type => files.openFilePath.endsWith(type))
          .length > 0 ? (
        <SynthFileViewer
          path={files.openFilePath}
          content={files.openFileContent}
          drawerWidth={props.drawerWidth}
        />
      ) : (
        <>
          <EditorWindowBanner
            message={
              files.openFileIsReadOnly
                ? 'Read-only Mode'
                : 'Scripts Development Mode'
            }
          />
          <MonacoEditor
            ref={refs.editorEl}
            width="100%"
            height="90%"
            theme={settings.prefersDarkMode ? 'vs-dark' : 'vs-light'}
            language="typescript"
            value={files?.openFileContent}
            options={options}
            onChange={(newValue, _) => handleEditorOnChange(newValue, props)}
            editorDidMount={editorDidMount}
          />
        </>
      )}
    </div>
  );
}

const mapStateToProps = state => {
  return {
    editor: state.editor,
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
    setOpenFiles: openFiles => {
      return dispatch(filesActions.setOpenFiles(openFiles));
    },
    setRefs: refs => {
      return dispatch(editorActions.setRefs(refs));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditorWindow);
