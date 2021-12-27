import React from 'react';
import { connect } from 'react-redux';
import { refreshRecent, refreshOpenFiles } from '../assets/js/utils/scripts';

import { processFiles } from './filesProcessorScripts';

function FilesProcessor(props) {
  React.useEffect(() => {
    refreshRecent();
    refreshOpenFiles();
  }, []);

  React.useEffect(() => {
    processFiles(props);
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
