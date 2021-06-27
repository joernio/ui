import React from 'react';
import { connect } from 'react-redux';
import * as queryActions from '../store/actions/queryActions';
import * as workSpaceActions from '../store/actions/workSpaceActions';
import {
  processQueryResult,
  shouldProcessQueryResult,
} from './workspaceProcessorScripts';

function WorkspaceProcessor(props) {
  React.useEffect(() => {
    const latest = shouldProcessQueryResult(props.query.results);
    if (latest) {
      processQueryResult(latest, props);
    }
  }, [props.query.results]);

  return null;
}

const mapStateToProps = state => {
  return {
    query: state.query,
    workspace: state.workspace,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    enQueueQuery: query => {
      return dispatch(queryActions.enQueueQuery(query));
    },
    setProjects: projects => {
      return dispatch(workSpaceActions.setProjects(projects));
    },
    setWorkSpace: workspace => {
      return dispatch(workSpaceActions.setWorkSpace(workspace));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(WorkspaceProcessor);
