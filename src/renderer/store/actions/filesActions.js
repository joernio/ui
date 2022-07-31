import { forNodeAtPath, forEachNode } from '../../assets/js/utils/scripts';
import { store } from '../configureStore';

export const setFiles = payload => dispatch => {
	dispatch({
		type: 'SET_FILES',
		payload,
	});
};

export const setRecent = payload => {
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

export const setFolders = payload => dispatch => {
	dispatch({
		type: 'SET_FOLDERS',
		payload,
	});
};

export const setOpenFiles = payload => dispatch => {
	dispatch({
		type: 'SET_OPEN_FILES',
		payload,
	});
};

export const setOpenFilePath = payload => dispatch => {
	dispatch({
		type: 'SET_OPEN_FILE_PATH',
		payload,
	});
};

export const setOpenFileContent = payload => dispatch => {
	dispatch({
		type: 'SET_OPEN_FILE_CONTENT',
		payload,
	});
};

export const setOpenFileIsReadOnly = payload => dispatch => {
	dispatch({
		type: 'SET_OPEN_FILE_IS_READ_ONLY',
		payload,
	});
};

export const setBinaryViewerCache = payload => dispatch => {
	dispatch({
		type: 'SET_BINARY_VIEWER_CACHE',
		payload,
	});
};

export const expandOrCollapseFolder = (nodePath, bool) => dispatch => {
	const updatedFolders = store.getState().files.folders;
	forNodeAtPath(updatedFolders, nodePath, node => {
		node.isExpanded = bool;
		if (node.hasCaret) {
			node.icon = bool ? 'folder-open' : 'folder-close';
		}
	});

	dispatch(setFolders(updatedFolders));
};

export const setIsSelected = nodePath => dispatch => {
	const updatedFolders = store.getState().files.folders;

	forEachNode(updatedFolders, node => {
		node.className = 'folder';
	});

	forNodeAtPath(updatedFolders, nodePath, node => {
		node.className = 'folder selected';
	});

	dispatch(setFolders(updatedFolders));
};
