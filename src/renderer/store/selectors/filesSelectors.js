import { createSelector } from 'reselect';

export const selectFiles = state => state.files;

export const selectRecent = createSelector(
	[selectFiles],
	files => files.recent,
);
export const selectFolders = createSelector(
	[selectFiles],
	files => files.folders,
);
export const selectOpenFiles = createSelector(
	[selectFiles],
	files => files.openFiles,
);
export const selectOpenFilePath = createSelector(
	[selectFiles],
	files => files.openFilePath,
);
export const selectOpenFileContent = createSelector(
	[selectFiles],
	files => files.openFileContent,
);
export const selectOpenFileIsReadOnly = createSelector(
	[selectFiles],
	files => files.openFileIsReadOnly,
);
