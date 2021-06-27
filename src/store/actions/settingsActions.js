import JoernAPI from '../../api';
const API = new JoernAPI();

export const set_domain = domain => {
  return dispatch => {
    dispatch({
      type: 'SET_SERVER_AUTH',
      payload: { domain: domain },
    });
  };
};
