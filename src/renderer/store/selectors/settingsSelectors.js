import { createSelector } from 'reselect';

export const selectSettings = state => state.settings;

export const selectServer = createSelector(
	[selectSettings],
	settings => settings.server,
);
export const selectWebSocket = createSelector(
	[selectSettings],
	settings => settings.websocket,
);
export const selectPrefersDarkMode = createSelector(
	[selectSettings],
	settings => settings.prefersDarkMode,
);
export const selectPrefersTerminalView = createSelector(
	[selectSettings],
	settings => settings.prefersTerminalView,
);
export const selectFontSize = createSelector(
	[selectSettings],
	settings => settings.fontSize,
);
export const selectScriptsDir = createSelector(
	[selectSettings],
	settings => settings.scriptsDir,
);
export const selectUiIgnore = createSelector(
	[selectSettings],
	settings => settings.uiIgnore,
);
export const selectQueryShortcuts = createSelector(
	[selectSettings],
	settings => settings.queryShortcuts,
);

export const selectRulesConfigFilePath = createSelector(
	[selectSettings],
	settings => settings.rulesConfigFilePath,
);
