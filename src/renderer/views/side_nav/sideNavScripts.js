import { openSyntheticFile } from '../../assets/js/utils/scripts';
import { syntheticFiles } from '../../assets/js/utils/defaultVariables';

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
		e.target.id === 'prefers_terminal_view' ||
		e.target.id === 'enable_http'
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
	initialSettings.cert_path = props.server?.cert_path;
	initialSettings.enable_http = props.server?.enable_http;
	initialSettings.cert_passphrase = '';

	initialSettings.ws_url = props.websocket?.url;

	initialSettings.prefers_dark_mode = props.prefersDarkMode;
	initialSettings.prefers_terminal_view = props.prefersTerminalView;
	initialSettings.font_size = Number(props.fontSize?.split('px')[0]);
	initialSettings.scripts_dir = props.scriptsDir;
	initialSettings.rules_config_file_path = props.rulesConfigFilePath;
	initialSettings.ui_ignore = props.uiIgnore;

	initialSettings.cert_path_up_to_date = props.server?.cert_path
		? true
		: false;
	initialSettings.cert_passphrase_up_to_date = props.server?.cert_passphrase
		? true
		: false;

	return initialSettings;
};

export const collectSettingsValues = values => {
	const settings = {
		server: {
			url: values.server_url,
			auth_username: values.server_username,
			auth_password: values.server_password,
			cert_path: values.cert_path,
			cert_passphrase: values.cert_passphrase,
			enable_http: values.enable_http,
		},
		websocket: {
			url: values.ws_url,
		},
		prefersDarkMode: values.prefers_dark_mode,
		prefersTerminalView: values.prefers_terminal_view,
		fontSize: `${values.font_size}px`,
		scriptsDir: values.scripts_dir,
		rulesConfigFilePath: values.rules_config_file_path,
		uiIgnore: values.ui_ignore,
	};

	return settings;
};

export const openShortcutsPage = () => {
	openSyntheticFile(syntheticFiles[1], syntheticFiles[1]);
};

export const openRulesPage = () => {
	openSyntheticFile(syntheticFiles[4], syntheticFiles[4]);
};
