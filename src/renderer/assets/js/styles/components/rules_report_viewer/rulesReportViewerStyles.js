import indexStyles from '../..';

const styles = theme => ({
	rootStyle: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		width: '100%',
		height: '100%',
		overflowY: 'hidden',
		position: 'relative',
		paddingTop: '2.3em',
		marginTop: '0.6em',
		paddingBottom: props =>
			`calc(${props.terminalHeight ? props.terminalHeight : '0px'} + ${
				props.statusBarHeight ? props.statusBarHeight : '0px'
			} * 2)`,
		'& > div': {
			backgroundColor: props =>
				theme.palette.editor.background[
					props.prefersDarkMode ? 'dark' : 'light'
				],
			...indexStyles(theme).scrollBarStyle, // couldn't change sarif viewer component scrollbar style from
			...indexStyles(theme).scrollBarDarkStyle, // the component, so doing it here
			'& .swcShim': {
				backgroundColor: props =>
					theme.palette.editor.background[
						props.prefersDarkMode ? 'dark' : 'light'
					],
			},
		},
	},
	controlsContainerStyle: {
		width: '100%',
		position: 'absolute',
		top: '5px',
		zIndex: '3',
		padding: '0 2em 0 2em',
		height: '3em',
	},
	secondControlsContainerStyle: {
		boxShadow: '0px 3px 9px -3px rgb(0, 0, 0, 0.3)',
		height: '100%',
		width: '100%',
		display: 'flex',
		alignItems: 'center',
		backgroundColor: props =>
			theme.palette.sarifviewercontainer.background[
				props.prefersDarkMode ? 'dark' : 'light'
			],
	},
	controlsContainerBodyStyle: {
		flexGrow: 1,
		color: props =>
			theme.palette.explorer.background[
				props.prefersDarkMode ? 'light' : 'dark'
			],
	},
	exportButtonStyle: {
		margin: '0.3em 1em 0.3em 1em',
		cursor: 'pointer',
		padding: '0.5em',
		color: theme.palette.button.base.dark,
		backgroundColor: props =>
			theme.palette.button.background[
				props.prefersDarkMode ? 'dark' : 'light'
			],
		'&:hover': {
			backgroundColor: props =>
				theme.palette.button.hover[
					props.prefersDarkMode ? 'dark' : 'light'
				],
		},
	},
	messageStyle: {
		color: props =>
			theme.palette.explorer.background[
				props.prefersDarkMode ? 'light' : 'dark'
			],
		fontSize: '1.5rem',
	},
	loadingContainerStyle: {
		height: '100%',
		width: '100%',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'column',
		color: props =>
			theme.palette.sideNav.base[
				props.prefersDarkMode ? 'dark' : 'light'
			],
	},
	loadingIconStyle: {
		margin: '1em',
		'&:hover': {
			color: props =>
				props.prefersDarkMode
					? theme.palette.sideNav.hover.dark
					: theme.palette.sideNav.background.light,
		},
	},
	buttonStyle: {
		padding: '0.5em',
		margin: '1em',
	},
	primaryButtonStyle: {
		border: '0px',
		outline: '0px',
		cursor: 'pointer',
		color: theme.palette.button.base.dark,
		backgroundColor: props =>
			theme.palette.button.background[
				props.prefersDarkMode ? 'dark' : 'light'
			],
		'&:hover': {
			backgroundColor: props =>
				theme.palette.button.hover[
					props.prefersDarkMode ? 'dark' : 'light'
				],
		},
	},
	secondaryButtonStyle: {
		outline: '0px',
		cursor: 'pointer',
		border: props =>
			`1px solid ${
				theme.palette.sideNav.base[
					props.prefersDarkMode ? 'dark' : 'light'
				]
			}`,
		backgroundColor: props =>
			theme.palette.navBar.background[
				props.prefersDarkMode ? 'dark' : 'light'
			],
		color: props =>
			theme.palette.navBar.base[props.prefersDarkMode ? 'dark' : 'light'],
		'&:hover': {
			backgroundColor: props =>
				theme.palette.navBar.hover[
					props.prefersDarkMode ? 'dark' : 'light'
				],
		},
	},
	menuStyle: {
		backgroundColor: props =>
			theme.palette.menu.background[
				props.prefersDarkMode ? 'dark' : 'light'
			],
		borderRadius: 0,
	},
	menuItemStyle: {
		borderRadius: 0,
		color: props =>
			theme.palette.menu.base[props.prefersDarkMode ? 'dark' : 'light'],
		'& span': {
			color: props =>
				`${
					theme.palette.menu.base[
						props.prefersDarkMode ? 'dark' : 'light'
					]
				} !important`,
		},
		'&:hover': {
			backgroundColor: props =>
				theme.palette.menu.hover[
					props.prefersDarkMode ? 'dark' : 'light'
				],
			color: '#FFFFFF',
			'& span': {
				color: '#FFFFFF !important',
			},
		},
	},
	verticalMoreStyle: {
		transform: 'rotate(90deg)',
		marginLeft: '1em',
		marginRight: '1em',
	},
	sarifFindingPathStyle: {
		WebkitLineClamp: 1,
		overflow: 'hidden',
		display: '-webkit-box',
		WebkitBoxOrient: 'vertical',
		color: '#98c6ff',
		'&:hover': {
			color: '#b8d8ff',
		},
	},
	controlElementsStyle: {
		display: 'flex',
	},
	chevLeftStyle: {
		transform: 'rotate(90deg)',
		marginLeft: '0.5em',
		marginRight: '0.5em',
	},
	chevRightStyle: {
		transform: 'rotate(-90deg)',
		marginLeft: '0.5em',
		marginRight: '0.5em',
	},
});

export default styles;
