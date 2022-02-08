export const setProjects = payload => {
  return dispatch => {
    dispatch({
      type: 'SET_PROJECTS',
      payload,
    });
  };
};

export const setWorkSpace = payload => {
  return dispatch => {
    dispatch({
      type: 'SET_WORKSPACE',
      payload,
    });
  };
};
