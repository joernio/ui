import { dispatch } from 'd3-dispatch';
import CpgAPI from '../../api';
import {
  handleAPIQueryError,
  performDeQueueQuery,
  performEnQueueQuery,
  performPeekQueue,
  performPushResult,
} from '../../assets/js/utils/scripts';
import { store } from '../configureStore';

const API = new CpgAPI();

export const setResults = payload => {
  return dispatch => {
    dispatch({
      type: 'SET_RESULTS',
      payload,
    });
  };
};

export const setQueue = payload => {
  return dispatch => {
    return dispatch({
      type: 'SET_QUEUE',
      payload,
    });
  };
};

export const resetQueue = payload => {
  return dispatch => {
    return dispatch({
      type: 'RESET_QUEUE',
      payload,
    });
  };
};

export const setScriptsQueue = payload => {
  return dispatch => {
    return dispatch({
      type: 'SET_SCRIPTS_QUEUE',
      payload,
    });
  };
};

export const resetScriptsQueue = payload => {
  return dispatch => {
    return dispatch({
      type: 'RESET_SCRIPTS_QUEUE',
      payload,
    });
  };
};

export const enQueueQuery = query => {
  return dispatch => {
    const { queue } = store.getState().query;
    const updated_queue = performEnQueueQuery(query, queue);
    dispatch(setQueue(updated_queue));
  };
};

export const deQueueQuery = () => {
  return dispatch => {
    const { queue } = store.getState().query;
    const { queue: updated_queue, query } = performDeQueueQuery(queue);
    dispatch(setQueue(updated_queue));
    return query;
  };
};

export const peekQueue = () => {
  return () => {
    const { queue } = store.getState().query;
    return performPeekQueue(queue);
  };
};

export const enQueueScriptsQuery = query => {
  return dispatch => {
    const { scriptsQueue } = store.getState().query;
    const updated_scripts_queue = performEnQueueQuery(query, scriptsQueue);
    dispatch(setScriptsQueue(updated_scripts_queue));
  };
};

export const deQueueScriptsQuery = () => {
  return dispatch => {
    const { scriptsQueue } = store.getState().query;
    const { queue: updated_scripts_queue, query } =
      performDeQueueQuery(scriptsQueue);
    dispatch(setScriptsQueue(updated_scripts_queue));
    return query;
  };
};

export const peekScriptsQueue = () => {
  return () => {
    const { scriptsQueue } = store.getState().query;
    return performPeekQueue(scriptsQueue);
  };
};

export const pushResult = result => {
  return dispatch => {
    const { results } = store.getState().query;
    const updated_results = performPushResult(result, results);
    dispatch(setResults(updated_results));
  };
};

export const runQuery = query_string => {
  return () => {
    return API.query(query_string).then(data => {
      if (data && data.uuid) {
        return data;
      } else {
        res = Object.keys(res)
          .map(key => res[key])
          .join('\n');
        throw new Error(res);
      }
    });
  };
};

export const getQueryResult = uuid => {
  return () => {
    return API.getQueryResult(uuid)
      .then(data => {
        if (data && data.uuid) {
          return data;
        } else if (data && data.err) {
          throw new Error(data.err);
        } else {
          const err = Object.keys(data)
            .map(key => data[key])
            .join('\n');
          throw new Error(err);
        }
      })
      .catch(err => {
        // handleAPIQueryError(err);
      });
  };
};

export const postQuery = (post_query, main_result_key) => {
  return dispatch => {
    return runQuery(post_query)()
      .then(data => {
        const { results } = store.getState().query;
        const result = results[main_result_key];

        if (result) {
          result['post_query_uuid'] = data.uuid;
          dispatch(setResults(results));
        }
      })
      .catch(err => {
        handleAPIQueryError(err);
      });
  };
};

export const mainQuery = query => {
  return dispatch => {
    return runQuery(query.query)()
      .then(data => {
        const query_result = {
          [data.uuid]: {
            result: { stdout: null, stderr: null },
            t_0: performance.now(),
            t_1: null,
            ...query,
          },
        };
        dispatch(pushResult(query_result));
      })
      .catch(err => {
        handleAPIQueryError(err);
      });
  };
};
