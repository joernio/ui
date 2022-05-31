const styles = theme => ({
	titleBarStyle: {
		width: '100vw',
		height: '35px',
		backgroundColor: props =>
			theme.palette.navBar.background[
				props.prefersDarkMode ? 'dark' : 'light'
			],
		display: 'flex',
		alignItems: 'center',
	},
	titleBarRightStyle: {
		flexGrow: 1,
		display: 'flex',
	},
	statusBarStyle: {
		height: '28px',
		width: '100%',
		display: 'flex',
		backgroundColor: props =>
			theme.palette.navBar.background[
				props.prefersDarkMode ? 'dark' : 'light'
			],
		color: props =>
			theme.palette.navBar.base[props.prefersDarkMode ? 'dark' : 'light'],
	},
	statusBarRightStyle: {
		height: '100%',
		flexGrow: 1,
		display: 'flex',
		alignItems: 'center',
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
	menuDividerStyle: {
		borderTop: props =>
			`1px solid ${
				theme.palette.menu.base[
					props.prefersDarkMode ? 'dark' : 'light'
				]
			}50`,
	},
	controlButtonStyle: {
		color: props =>
			theme.palette.navBar.base[props.prefersDarkMode ? 'dark' : 'light'],
		fontSize: '1em',
		display: 'flex',
		width: '3em',
		height: '100%',
		justifyContent: 'center',
		alignItems: 'center',
		border: 'none',
		cursor: 'pointer',
		backgroundColor: 'rgba(0,0,0,0)',
		'&:focus': {
			outline: 'none',
		},
		'&:hover': {
			backgroundColor: props =>
				theme.palette.navBar.hover[
					props.prefersDarkMode ? 'dark' : 'light'
				],
		},
		'&.close:hover': {
			backgroundColor: theme.palette.secondary.light,
		},
	},
	navItemStyle: {
		height: '2.5em',
	},
	toolNameContainerStyle: {
		display: 'flex',
		flexGrow: 1,
		justifyContent: 'center',
		'& h1': {
			fontSize: '1em',
			color: props =>
				theme.palette.navBar.base[
					props.prefersDarkMode ? 'dark' : 'light'
				],
		},
	},
	windowActionIconStyle: {
		fill: props =>
			theme.palette.navBar.base[props.prefersDarkMode ? 'dark' : 'light'],
		width: '0.6em',
		height: '0.6em',
	},
	connectionStatusStyle: {
		height: '100%',
		width: 'fit-content',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-around',
		cursor: 'context-menu',
		padding: '0 1em',
		'&:hover': {
			backgroundColor: props =>
				theme.palette.navBar.hover[
					props.prefersDarkMode ? 'dark' : 'light'
				],
		},
		'& h3': {
			marginRight: '1em',
		},
	},
	conStatContextContentStyle: {
		padding: '0.5em',
		cursor: 'pointer',
		'&:hover': {
			backgroundColor: theme.palette.navBar.hover.light,
		},
	},
	hiddenStyle: {
		display: 'none',
		width: 0,
		height: 0,
	},
});

export default styles;
