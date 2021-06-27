export const setRecent = payload => {
  return dispatch => {
    dispatch({
      type: 'SET_RECENT',
      payload,
    });
  };
};
