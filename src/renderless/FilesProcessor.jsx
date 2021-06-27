import React from 'react';
import { connect } from 'react-redux';
import * as filesActions from '../store/actions/filesActions';
import { openFile } from '../assets/js/utils/scripts';
import { getFilePathToOpen } from './filesProcessorScripts';

function FilesProcessor(props) {
  React.useEffect(async () => {
    if (props?.workspace?.projects) {
      const file_path = await getFilePathToOpen(props.workspace);
      file_path && openFile(file_path, props);
    }
  }, [props.workspace]);

  return null;
}

const mapStateToProps = state => {
  return {
    files: state.files,
    workspace: state.workspace,
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
