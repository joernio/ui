export const setProjects = payload => dispatch => {
	dispatch({
		type: 'SET_PROJECTS',
		payload,
	});
};

export const setWorkSpace = payload => dispatch => {
	dispatch({
		type: 'SET_WORKSPACE',
		payload,
	});
};
