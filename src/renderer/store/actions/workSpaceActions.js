export const setProjects = payload => {
  console.log('setProjects: ', payload);
  return dispatch => {
    dispatch({
      type: 'SET_PROJECTS',
      payload,
    });
  };
};

export const setWorkSpace = payload => {
  console.log('setWorkSpace: ', payload);
  return dispatch => {
    dispatch({
      type: 'SET_WORKSPACE',
      payload,
    });
  };
};
