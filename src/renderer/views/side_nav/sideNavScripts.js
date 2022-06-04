import { openSyntheticFile } from '../../assets/js/utils/scripts';

export const toggleSettingsDialog = isSettingsDialogOpen => ({
	isSettingsDialogOpen: !isSettingsDialogOpen,
});

export const handleDrawerToggle = props => ({
	drawerWidth: props.drawerWidth ? 0 : '250px',
});

export const handleTerminalToggle = props => {
	const terminalHeight = props.terminalHeight ? 0 : '468px';
	return { terminalHeight };
};

export const handleOnChange = (e, values) => {
	if (
		e.target.id === 'prefers_dark_mode' ||
		e.target.id === 'prefers_terminal_view'
	) {
		values[e.target.id] = e.target.checked;
	} else {
		values[e.target.id] = e.target.value;
	}
	return { values };
};

export const getSettingsInitialValues = props => {
	const initialSettings = {};

	initialSettings.server_url = props.server?.url;
	initialSettings.server_username = props.server?.auth_username;
	initialSettings.server_password = props.server?.auth_password;

	initialSettings.ws_url = props.websocket?.url;

	initialSettings.prefers_dark_mode = props.prefersDarkMode;
	initialSettings.prefers_terminal_view = props.prefersTerminalView;
	initialSettings.font_size = Number(props.fontSize?.split('px')[0]);
	initialSettings.scripts_dir = props.scriptsDir;
	initialSettings.ui_ignore = props.uiIgnore;

	return initialSettings;
};

export const collectSettingsValues = values => {
	const settings = {
		server: {
			url: values.server_url,
			auth_username: values.server_username,
			auth_password: values.server_password,
		},
		websocket: {
			url: values.ws_url,
		},
		prefersDarkMode: values.prefers_dark_mode,
		prefersTerminalView: values.prefers_terminal_view,
		fontSize: `${values.font_size}px`,
		scriptsDir: values.scripts_dir,
		uiIgnore: values.ui_ignore,
	};

	return settings;
};

export const openShortcutsPage = () => {
	openSyntheticFile('Query Shortcuts', 'Query Shortcuts');
};
