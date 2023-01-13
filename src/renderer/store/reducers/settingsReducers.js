import { defaultRulesConfigFilePath } from '../../assets/js/utils/defaultVariables';

export const default_state = {
	server: {
		url: 'http://localhost:8080',
		auth_username: '',
		auth_password: '',
		enable_http: true,
	},
	websocket: {
		url: 'ws://localhost:8080/connect',
	},
	prefersDarkMode: true,
	prefersTerminalView: false,
	fontSize: '16px',
	rulesConfigFilePath: defaultRulesConfigFilePath,
	uiIgnore: 'node_modules, vendor, build, .git',
	queryShortcuts: {},
};

const settings = (state = default_state, action) => {
	switch (action.type) {
		case 'SET_SETTINGS':
			return {
				...state,
				...action.payload,
			};
		case 'SET_SERVER':
			return {
				...state,
				server: { ...state.server, ...action.payload },
			};
		case 'SET_WEBSOCKET':
			return {
				...state,
				websocket: { ...state.websocket, ...action.payload },
			};
		case 'SET_PREFERSDARKMODE':
			return {
				...state,
				prefersDarkMode: action.payload,
			};
		case 'SET_PREFERSTERMINALVIEW':
			return {
				...state,
				prefersTerminalView: action.payload,
			};
		case 'SET_FONTSIZE':
			return {
				...state,
				fontSize: action.payload,
			};
		case 'SET_UIIGNORE':
			return {
				...state,
				uiIgnore: action.payload,
			};
		case 'SET_QUERY_SHORTCUTS':
			return {
				...state,
				queryShortcuts: { ...state.queryShortcuts, ...action.payload },
			};
		case 'SET_RULES_CONFIG_FILE_PATH':
			return {
				...state,
				rulesConfigFilePath: action.payload,
			};
		default:
			return state;
	}
};

export default settings;
