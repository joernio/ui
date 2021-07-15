import { forNodeAtPath } from '../../assets/js/utils/scripts';
import { store } from '../configureStore';

export const setRecent = payload => {
  return dispatch => {
    dispatch({
      type: 'SET_RECENT',
      payload,
    });
  };
};

export const setFolders = payload => {
  return dispatch => {
    dispatch({
      type: 'SET_FOLDERS',
      payload,
    });
  };
};

export const setOpenFileContent = payload => {
  return dispatch => {
    dispatch({
      type: 'SET_OPEN_FILE_CONTENT',
      payload,
    });
  };
};

export const setOpenFileIsReadOnly = payload => {
  return dispatch => {
    dispatch({
      type: 'SET_OPEN_FILE_IS_READ_ONLY',
      payload,
    });
  };
};

export const expandOrCollapseFolder = (nodePath, bool) => {
  return dispatch => {
    const updatedFolders = store.getState().files.folders;
    forNodeAtPath(updatedFolders, nodePath, node => {
      node.isExpanded = bool;
      if (node.hasCaret) {
        node.icon = bool ? 'folder-open' : 'folder-close';
      }
    });

    dispatch(setFolders(updatedFolders));
  };
};
