export const default_state = {
	recent: {},
	folders: [],
	openFiles: {},
	openFilePath: '',
	openFileContent: '',
	openFileIsReadOnly: true,
  binaryViewerCache: {
    filePath: '',
    methods : [],
    methodsNameIndexMapping: {},
    selectedMethodIndex: null,
    methodBinaries: {},
    textSelectionRange: {startLine: null, endLine: null}
  }
};

const files = (state = default_state, action) => {
	switch (action.type) {
		case 'SET_FILES':
			return { ...state, ...action.payload, folders: state.folders };
		case 'SET_RECENT':
			return {
				recent: { ...action.payload.recent },
				folders: state.folders,
				openFiles: state.openFiles,
				openFilePath: state.openFilePath,
				openFileContent: state.openFileContent,
				openFileIsReadOnly: state.openFileIsReadOnly,
        binaryViewerCache: state.binaryViewerCache
			};
		case 'SET_FOLDERS':
			return {
				recent: state.recent,
				folders: [...action.payload],
				openFiles: state.openFiles,
				openFilePath: state.openFilePath,
				openFileContent: state.openFileContent,
				openFileIsReadOnly: state.openFileIsReadOnly,
        binaryViewerCache: state.binaryViewerCache
			};
		case 'SET_OPEN_FILES':
			return {
				recent: state.recent,
				folders: state.folders,
				openFiles: { ...action.payload },
				openFilePath: state.openFilePath,
				openFileContent: state.openFileContent,
				openFileIsReadOnly: state.openFileIsReadOnly,
        binaryViewerCache: state.binaryViewerCache
			};
		case 'SET_OPEN_FILE_PATH':
			return {
				recent: state.recent,
				folders: state.folders,
				openFiles: state.openFiles,
				openFilePath: action.payload,
				openFileContent: state.openFileContent,
				openFileIsReadOnly: state.openFileIsReadOnly,
        binaryViewerCache: state.binaryViewerCache
			};
		case 'SET_OPEN_FILE_CONTENT':
			return {
				recent: state.recent,
				folders: state.folders,
				openFiles: state.openFiles,
				openFilePath: state.openFilePath,
				openFileContent: action.payload,
				openFileIsReadOnly: state.openFileIsReadOnly,
        binaryViewerCache: state.binaryViewerCache
			};
		case 'SET_OPEN_FILE_IS_READ_ONLY':
			return {
				recent: state.recent,
				folders: state.folders,
				openFiles: state.openFiles,
				openFilePath: state.openFilePath,
				openFileContent: state.openFileContent,
				openFileIsReadOnly: action.payload,
        binaryViewerCache: state.binaryViewerCache
			};
    case 'SET_BINARY_VIEWER_CACHE':
      return {
        recent: state.recent,
				folders: state.folders,
				openFiles: state.openFiles,
				openFilePath: state.openFilePath,
				openFileContent: state.openFileContent,
				openFileIsReadOnly: action.payload,
        binaryViewerCache: action.payload
      }
		default:
			return state;
	}
};

export default files;
