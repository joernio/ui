import { createMuiTheme } from '@material-ui/core/styles/index.js'; // eslint-disable-line import/extensions

const createTheme = mode =>
	createMuiTheme({
		typography: {
			fontFamily: ['Raleway', 'Roboto', 'sans-serif'].join(','),
		},
		palette: {
			type: mode ? 'dark' : 'light',
			sideNav: {
				background: {
					light: '#2C2C2C',
					dark: '#333333',
				},
				base: {
					light: '#7B7B7B',
					dark: '#7B7B7B',
				},
				hover: {
					light: '#FFFFFF',
					dark: '#FFFFFF',
				},
			},
			explorer: {
				background: {
					light: '#F3F3F3',
					dark: '#252526',
				},
				base: {
					light: '#616161',
					dark: '#CCCCCC',
				},
				hover: {
					light: '#E8E8E8',
					dark: '#2A2D2E',
				},
			},
			navBar: {
				background: {
					light: '#E5E5E5',
					dark: '#3C3C3C',
				},
				base: {
					light: '#525252',
					dark: '#B4B4B4',
				},
				hover: {
					light: '#C6C6C6',
					dark: '#505050',
				},
			},
			editorNavBar: {
				background: {
					light: '#ECECEC',
					dark: '#2D2D2D',
				},
				base: {
					light: '#989898',
					dark: '#8B8B8B',
				},
				hover: {
					light: '#DCDCDC',
					dark: '#3B3C3C',
				},
			},
			editor: {
				background: {
					light: '#FFFFFF',
					dark: '#1E1E1E',
				},
				base: {
					light: '#000000',
					dark: '#D4D4C9',
				},
				hover: {
					light: '#A5A5A5',
					dark: '#CBCBCB',
				},
			},
			menu: {
				background: {
					light: '#FFFFFF',
					dark: '#252526',
				},
				base: {
					light: '#737373',
					dark: '#CCCCCC',
				},
				hover: {
					light: '#0060C0',
					dark: '#094771',
				},
			},
			button: {
				background: {
					light: '#007ACC',
					dark: '#0E639C',
				},
				base: {
					light: '#000000',
					dark: '#FFFFFF',
				},
				hover: {
					light: '#0062A3',
					dark: '#1177BB',
				},
			},
			scrollbar: {
				background: {
					light: 'rgba(0,0,0,0)',
					dark: 'rgba(255,255,255,0)',
				},
				base: {
					light: 'rgba(0,0,0,0.24)',
					dark: 'rgba(255, 255, 255, 0.16)',
				},
				hover: {
					light: 'rgba(0,0,0,0.4255)',
					dark: 'rgba(255,255,255,0.22)',
				},
			},
			sarifviewercontainer: {
				background: {
					light: '#FFFFFF',
					dark: '#323130',
				},
				base: {
					light: '#616161',
					dark: '#CCCCCC',
				},
				hover: {
					light: '#FFFFFF',
					dark: '#323130',
				},
			},
		},
	});

export default createTheme;
