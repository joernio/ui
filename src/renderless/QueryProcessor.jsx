import React from 'react';
import { connect } from 'react-redux';
// import { usePrevious } from '../assets/js/utils/hooks';
import * as queryActions from '../store/actions/queryActions';
import {
  shouldRunQuery,
  shouldAlertScriptRunSuccessful,
} from './queryProcessorScripts';
import {
  addToQueue,
  addWorkSpaceQueryToQueue,
  handleSetToast,
} from '../assets/js/utils/scripts';

function QueryProcessor(props) {
  const [state, setState] = React.useState({
    prev_queue: {},
    prev_scripts_queue: {},
    prev_results: {},
  });

  React.useEffect(() => {
    const query = props.peekQueue();
    const run_query = shouldRunQuery(
      state.prev_queue,
      props.query.queue,
      query,
    );

    if (run_query) {
      props.mainQuery(query);

      if (
        query.query.startsWith('open') ||
        query.query.startsWith('import') ||
        query.query.startsWith('workspace')
      ) {
        console.log('enQueuing cpg.metaData.language.l');
        props.enQueueQuery({
          query: 'cpg.metaData.language.l',
          origin: 'workspace',
          ignore: true,
        });
      }
    }

    handleSetState({
      prev_queue: props.query.queue
        ? JSON.parse(JSON.stringify(props.query.queue))
        : {},
    });
  }, [props.query.queue]);

  React.useEffect(() => {
    const query = props.peekScriptsQueue();
    const run_query = shouldRunQuery(
      state.prev_scripts_queue,
      props.query.scriptsQueue,
      query,
    );
    run_query && props.mainQuery(query);
    handleSetState({
      prev_scripts_queue: props.query.scriptsQueue
        ? JSON.parse(JSON.stringify(props.query.scriptsQueue))
        : {},
    });
  }, [props.query.scriptsQueue]);

  React.useEffect(() => {
    props.status.connected && addToQueue(addWorkSpaceQueryToQueue(), props);
  }, [props.status.connected, props.settings.server, props.settings.websocket]);

  React.useEffect(() => {
    const script_result = shouldAlertScriptRunSuccessful(
      state.prev_results,
      props.query.results,
    );

    script_result &&
      handleSetToast({
        icon: 'info-sign',
        intent: 'success',
        message: 'script ran successfully',
      });

    handleSetState({
      prev_results: props.query.results
        ? JSON.parse(JSON.stringify(props.query.results))
        : {},
    });
  }, [props.query.results]);

  const handleSetState = obj => {
    if (obj) {
      Promise.resolve(obj).then(obj => {
        setState(state => ({ ...state, ...obj }));
      });
    }
  };

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
    peekScriptsQueue: () => {
      return dispatch(queryActions.peekScriptsQueue());
    },
    enQueueQuery: query => {
      return dispatch(queryActions.enQueueQuery(query));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(QueryProcessor);
