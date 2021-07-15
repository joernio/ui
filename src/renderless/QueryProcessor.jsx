import React from 'react';
import { connect } from 'react-redux';
import { usePrevious } from '../assets/js/utils/hooks';
import * as queryActions from '../store/actions/queryActions';
import { shouldRunQuery } from './queryProcessorScripts';
import {
  addToQueue,
  addWorkSpaceQueryToQueue,
} from '../assets/js/utils/scripts';

function QueryProcessor(props) {
  const prev_queue = usePrevious(props.query.queue);

  React.useEffect(() => {
    const query = props.peekQueue();
    const run_query = shouldRunQuery(prev_queue, props.query.queue, query);
    run_query && props.mainQuery(query);
  }, [props.query.queue]);

  React.useEffect(() => {
    props.status.connected && addToQueue(addWorkSpaceQueryToQueue(), props);
  }, [props.status.connected, props.settings.server, props.settings.websocket]);

  return null;
}

const mapStateToProps = state => {
  return {
    query: state.query,
    status: state.status,
    settings: state.settings,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    mainQuery: query => {
      return dispatch(queryActions.mainQuery(query));
    },
    peekQueue: () => {
      return dispatch(queryActions.peekQueue());
    },
    enQueueQuery: query => {
      return dispatch(queryActions.enQueueQuery(query));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(QueryProcessor);
