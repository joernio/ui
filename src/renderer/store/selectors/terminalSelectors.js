import { createSelector } from 'reselect';

export const selectTerminal = state => state.terminal;

export const selectTerm = createSelector(
	[selectTerminal],
	terminal => terminal.term,
);
export const selectRefs = createSelector(
	[selectTerminal],
	terminal => terminal.refs,
);
export const selectFitAddon = createSelector(
	[selectTerminal],
	terminal => terminal.fitAddon,
);
export const selectPrevResults = createSelector(
	[selectTerminal],
	terminal => terminal.prev_results,
);
export const selectPrevProjects = createSelector(
	[selectTerminal],
	terminal => terminal.prev_projects,
);
export const selectHistory = createSelector(
	[selectTerminal],
	terminal => terminal.history,
);
export const selectIsMaximized = createSelector(
	[selectTerminal],
	terminal => terminal.isMaximized,
);
export const selectBusy = createSelector(
	[selectTerminal],
	terminal => terminal.busy,
);
export const selectQuerySuggestions = createSelector(
	[selectTerminal],
	terminal => terminal.query_suggestions,
);
export const selectSuggestionDialogOpen = createSelector(
  [selectTerminal],
  terminal => terminal.suggestion_dialog_open
);
export const selectCircuitUiResponses = createSelector(
	[selectTerminal],
	terminal => terminal.circuit_ui_responses,
);
