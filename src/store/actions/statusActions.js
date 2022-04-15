export const setStatus = status => {
  console.log('setStatus: ', status);
  return dispatch => {
    dispatch({
      type: 'SET_STATUS',
      payload: status,
    });
  };
};

export const setConnected = connected => {
  console.log('setConnected: ', connected);
  return dispatch => {
    dispatch(setStatus({ connected }));
  };
};

export const setToast = toast => {
  console.log('setToast: ', toast);
  return dispatch => {
    dispatch(setStatus({ toast }));
  };
};
