import { createSelector } from 'reselect';

export const selectEditor = state => state.editor;

export const selectRefs = createSelector([selectEditor], editor => editor.refs);
export const selectHighlightRange = createSelector(
	[selectEditor],
	editor => editor.highlightRange,
);
