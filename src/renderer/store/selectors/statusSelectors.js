import { createSelector } from 'reselect';

export const selectStatus = state => state.status;

export const selectConnected = createSelector(
	[selectStatus],
	status => status.connected,
);
export const selectToast = createSelector(
	[selectStatus],
	status => status.toast,
);

export const selectSettingsDialogIsOpen = createSelector(
	[selectStatus],
	status => status.settingsDialogIsOpen,
);

export const selectDiscardDialog = createSelector(
	[selectStatus],
	status => status.discardDialog,
);
