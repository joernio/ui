const defaultState = {
  recent: {},
  folders: [],
  openFileContent: '',
  openFileIsReadOnly: true,
};

const files = (state = defaultState, action) => {
  switch (action.type) {
    case 'SET_RECENT':
      return {
        recent: { ...state.recent, ...action.payload.recent },
        folders: state.folders,
        openFileContent: state.openFileContent,
        openFileIsReadOnly: state.openFileIsReadOnly,
      };
    case 'SET_FOLDERS':
      return {
        recent: state.recent,
        folders: [...action.payload],
        openFileContent: state.openFileContent,
        openFileIsReadOnly: state.openFileIsReadOnly,
      };
    case 'SET_OPEN_FILE_CONTENT':
      return {
        recent: state.recent,
        folders: state.folders,
        openFileContent: action.payload,
        openFileIsReadOnly: state.openFileIsReadOnly,
      };
    case 'SET_OPEN_FILE_IS_READ_ONLY':
      return {
        recent: state.recent,
        folders: state.folders,
        openFileContent: state.openFileContent,
        openFileIsReadOnly: action.payload,
      };
    default:
      return state;
  }
};

export default files;
