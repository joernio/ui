import React from 'react';
import { connect } from 'react-redux';
import { usePrevious } from '../assets/js/utils/hooks';
import * as queryActions from '../store/actions/queryActions';
import { shouldRunQuery } from './queryProcessorScripts';

function QueryProcessor(props) {
  const prev_queue = usePrevious(props.query.queue);

  React.useEffect(() => {
    const query = props.peekQueue();
    const run_query = shouldRunQuery(prev_queue, props.query.queue, query);
    if (run_query) {
      props.mainQuery(query);
    }
  }, [props.query.queue]);

  // React.useEffect(() => {
  //   const prev_queue_count = prev_queue ? Object.keys(prev_queue).length : 0;
  //   const queue_count = Object.keys(props.query.queue).length;
  //   const query = props.peekQueue();

  //   if (query && queue_count === 1) {
  //     runQuery(query, props);
  //   } else if (query && prev_queue_count > queue_count && queue_count > 0) {
  //     runQuery(query, props);
  //   }
  // }, [props.query.queue]);

  return null;
}

const mapStateToProps = state => {
  return {
    query: state.query,
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
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(QueryProcessor);
