import { homedir } from 'os';

export const default_state = {
	server: {
		url: 'http://localhost:8080',
		auth_username: '',
		auth_password: '',
	},
	websocket: {
		url: 'ws://localhost:8080/connect',
	},
	prefersDarkMode: true,
	prefersTerminalView: false,
	fontSize: '16px',
	scriptsDir: `${homedir()}/bin/joern/joern-cli/scripts`,
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
		case 'SET_SCRIPTSDIR':
			return {
				...state,
				scriptsDir: action.payload,
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
		default:
			return state;
	}
};

export default settings;
