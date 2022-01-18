import { dispatch } from 'd3-dispatch';

export const setEditor = payload => {
  return dispatch => {
    dispatch({
      type: 'SET_EDITOR',
      payload,
    });
  };
};

export const setRefs = refs => {
  return dispatch => {
    dispatch(setEditor({ refs }));
  };
};

export const setHighlightRange = highlightRange => {
  return dispatch => {
    dispatch(setEditor({ highlightRange }));
  };
};
