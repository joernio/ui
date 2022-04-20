export const setEditor = payload => dispatch => {
	dispatch({
		type: 'SET_EDITOR',
		payload,
	});
};

export const setRefs = refs => dispatch => {
	dispatch(setEditor({ refs }));
};

export const setHighlightRange = highlightRange => dispatch => {
	dispatch(setEditor({ highlightRange }));
};
