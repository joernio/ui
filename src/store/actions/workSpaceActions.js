export const setProjects = payload => {
  return dispatch => {
    console.log('workSpaceActions: setProjects: payload is ', payload);
    dispatch({
      type: 'SET_PROJECTS',
      payload,
    });
  };
};

export const setWorkSpace = payload => {
  return dispatch => {
    console.log('workSpaceActions: setWorkSpace: payload is ', payload);
    dispatch({
      type: 'SET_WORKSPACE',
      payload,
    });
  };
};
