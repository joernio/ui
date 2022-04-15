import { forNodeAtPath, forEachNode } from '../../assets/js/utils/scripts';
import { store } from '../configureStore';

export const setFiles = payload => {
  console.log('setFiles: ', payload);
  return dispatch => {
    dispatch({
      type: 'SET_FILES',
      payload,
    });
  };
};

export const setRecent = payload => {
  console.log('setRecent: ', payload);
  const recent_keys = Object.keys(payload.recent ? payload.recent : {});
  if (recent_keys.length > 50) {
    delete payload.recent[recent_keys[0]];
  }

  return dispatch => {
    dispatch({
      type: 'SET_RECENT',
      payload,
    });
  };
};

export const setFolders = payload => {
  console.log('setFolders: ', payload);
  return dispatch => {
    dispatch({
      type: 'SET_FOLDERS',
      payload,
    });
  };
};

export const setOpenFiles = payload => {
  console.log('setOpenFiles: ', payload);
  return dispatch => {
    dispatch({
      type: 'SET_OPEN_FILES',
      payload,
    });
  };
};

export const setOpenFilePath = payload => {
  console.log('setOpenFilePath: ', payload);
  return dispatch => {
    dispatch({
      type: 'SET_OPEN_FILE_PATH',
      payload,
    });
  };
};

export const setOpenFileContent = payload => {
  console.log('setOpenFileContent: ', payload);
  return dispatch => {
    dispatch({
      type: 'SET_OPEN_FILE_CONTENT',
      payload,
    });
  };
};

export const setOpenFileIsReadOnly = payload => {
  console.log('setOpenFileIsReadOnly: ', payload);
  return dispatch => {
    dispatch({
      type: 'SET_OPEN_FILE_IS_READ_ONLY',
      payload,
    });
  };
};

export const expandOrCollapseFolder = (nodePath, bool) => {
  console.log('expandOrCollapseFolder: ', nodePath, bool);
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

export const setIsSelected = nodePath => {
  console.log('setIsSelected: ', nodePath);
  return dispatch => {
    const updatedFolders = store.getState().files.folders;

    forEachNode(updatedFolders, node => {
      node.className = 'folder';
    });

    forNodeAtPath(updatedFolders, nodePath, node => {
      node.className = 'folder selected';
    });

    dispatch(setFolders(updatedFolders));
  };
};
