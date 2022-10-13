import { createSelector } from 'reselect';

export const selectQuery = state => state.query;

export const selectResults = createSelector(
	[selectQuery],
	query => query.results,
);
export const selectScriptsResults = createSelector(
  [selectQuery],
  query => query.scriptsResults,
);
export const selectQueue = createSelector([selectQuery], query => query.queue);
export const selectScriptsQueue = createSelector(
	[selectQuery],
	query => query.scriptsQueue,
);
export const selectQueryShortcut = createSelector(
	[selectQuery],
	query => query.queryShortcut,
);
export const selectWorkerPool = createSelector(
	[selectQuery],
	query => query.workerPool,
);
