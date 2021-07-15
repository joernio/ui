import React from 'react';
import { connect } from 'react-redux';
import * as filesActions from '../store/actions/filesActions';
import { openFile, isFilePathInQueryResult } from '../assets/js/utils/scripts';
import {
  getFilePathToOpen,
  isFileInRecentlyOpened,
} from './filesProcessorScripts';

function FilesProcessor(props) {
  React.useEffect(async () => {
    if (props?.workspace?.projects) {
      const file_path = await getFilePathToOpen(props.workspace);
      const fileInRecentlyOpened = isFileInRecentlyOpened(
        file_path,
        props.files.recent,
      );
      file_path && !fileInRecentlyOpened && openFile(file_path, props);
    }
  }, [props.workspace]);

  React.useEffect(() => {
    const file_path = isFilePathInQueryResult(props.query.results);
    file_path && openFile(file_path, props);
  }, [props.query.results]);

  return null;
}

const mapStateToProps = state => {
  return {
    files: state.files,
    workspace: state.workspace,
    query: state.query,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setRecent: files => {
      return dispatch(filesActions.setRecent(files));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FilesProcessor);
