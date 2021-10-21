import React from 'react';
import { connect } from 'react-redux';
import {
  openFile,
  isFilePathInQueryResult,
  refreshRecent,
  refreshOpenFiles,
} from '../assets/js/utils/scripts';

function FilesProcessor(props) {
  React.useEffect(() => {
    refreshRecent();
    refreshOpenFiles();
  }, []);

  React.useEffect(() => {
    const file_path = isFilePathInQueryResult(props.query.results);
    file_path && openFile(file_path);
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

export default connect(mapStateToProps, null)(FilesProcessor);
