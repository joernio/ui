const styles = theme => ({
	rootStyle: {
		borderTop: props =>
			`1px solid rgba${
				props.prefersDarkMode ? '(255,255,255,0.2)' : '(0,0,0,0.2)'
			}`,
		borderBottom: props =>
			`1px solid rgba${
				props.prefersDarkMode ? '(0,0,0,0.2)' : '(255,255,255,0.2)'
			}`,
		'&:focus': {
			border: '1px solid #0090F1',
			outline: 'none',
		},
	},
	titleSectionStyle: {
		display: 'flex',
		alignItems: 'center',
	},
	titleStyle: {
		flexGrow: 1,
		textTransform: 'uppercase',
		fontWeight: 'bold',
		fontSize: '0.8rem',
		marginTop: '0.3em',
		marginBottom: '0.3em',
		cursor: 'pointer',
		color: props =>
			theme.palette.explorer.base[
				props.prefersDarkMode ? 'dark' : 'light'
			],
	},
	emptyWorkspaceElementStyle: {
		fontSize: '1rem',
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
		cursor: 'pointer',
		margin: '0.3em 0.3em 0.3em 0.3em',
		padding: '0.5em 0.5em 0.5em 0.7em',
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
	projectsSectionStyle: {
		marginLeft: '1.3em',
		overflowY: 'scroll',
	},
	projectsVisible: {
		transition: theme.transitions.create('height', {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
		height: 'auto',
		maxHeight: '12em',
	},
	projectsHidden: {
		transition: theme.transitions.create('height', {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
		height: 0,
	},
	verticalMoreStyle: {
		transform: 'rotate(90deg)',
		marginRight: '1.3em',
	},
	warningStyle: {
		color: theme.palette.warning.main,
		'& svg': {
			fill: theme.palette.warning.main,
		},
	},
	hidden: {
		display: 'none',
		width: 0,
		height: 0,
	},
});

export default styles;
