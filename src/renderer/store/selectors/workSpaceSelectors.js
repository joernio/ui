import { createSelector } from 'reselect';

export const selectWorkSpace = state => state.workspace;

export const selectPath = createSelector(
	[selectWorkSpace],
	workspace => workspace.path,
);
export const selectProjects = createSelector(
	[selectWorkSpace],
	workspace => workspace.projects,
);
