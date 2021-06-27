import React from 'react';
import MonacoEditor from 'react-monaco-editor';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import {
  goToLine,
  editorDidMount,
  readRecentFile,
  onChange,
} from './editorScripts';

const useStyles = makeStyles(theme => ({
  editorContainerStyle: {
    paddingTop: '1.5em',
    position: 'fixed',
    width: '100%',
    height: '100%',
    backgroundColor: theme.palette.background.paper,
    paddingLeft: props =>
      props.drawerOpen ? props.drawerWidth : props.sideNavWidth,
  },
}));

function EditorWindow(props) {
  const classes = useStyles(props);
  const editorRef = React.useRef(null);

  const [state, setState] = React.useState({
    code: '// type your code...',
  });

  const handleSetState = obj => {
    if (obj) {
      Promise.resolve(obj).then(obj => {
        setState(state => ({ ...state, ...obj }));
      });
    }
  };

  React.useEffect(() => {
    if (editorRef) {
      readRecentFile(props)
        .then(data => {
          handleSetState({ code: data });
          setTimeout(() => goToLine(editorRef.current.editor, 100), 1000);
        })
        .catch(err => {
          console.log(err);
        });
    }
  }, [props.files.recent]);

  const { code } = state;
  const options = {
    selectOnLineNumbers: true,
    roundedSelection: false,
    readOnly: false,
    cursorStyle: 'line',
    automaticLayout: true,
  };

  const { prefersDarkMode } = props;
  return (
    <div className={classes.editorContainerStyle}>
      <MonacoEditor
        ref={editorRef}
        width="100%"
        height="100vh"
        theme={prefersDarkMode ? 'vs-dark' : 'vs-light'}
        language="javascript"
        value={code}
        options={options}
        onChange={onChange}
        editorDidMount={editorDidMount}
      />
    </div>
  );
}

const mapStateToProps = state => {
  return {
    files: state.files,
  };
};

export default connect(mapStateToProps, null)(EditorWindow);
