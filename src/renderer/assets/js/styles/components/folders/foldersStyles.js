const styles = theme => ({
	rootStyle: {
		borderTop: props =>
			`1px solid rgba${
				props.prefersDarkMode ? '(255,255,255,0.2)' : '(0,0,0,0.2)'
			}`,
		overflowY: 'hidden',
		display: 'flex',
		flexDirection: 'column',
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

	titleSectionStyle: {
		display: 'flex',
		alignItems: 'center',
	},
	titleStyle: {
		cursor: 'pointer',
		flexGrow: 1,
		textTransform: 'uppercase',
		fontWeight: 'bold',
		fontSize: '0.8rem',
		marginTop: '0.3em',
		marginBottom: '0.3em',
		color: props =>
			theme.palette.explorer.base[
				props.prefersDarkMode ? 'dark' : 'light'
			],
	},
	foldersSectionStyle: {
		overflowY: 'scroll',
	},
	scrolledStyle: {
		boxShadow: props =>
			`inset 0px 2px 8px 1px ${
				theme.palette.editor.background[
					props.prefersDarkMode ? 'dark' : 'light'
				]
			}`,
	},
	verticalMoreStyle: {
		transform: 'rotate(90deg)',
		marginRight: '1.3em',
	},
	iconStyle: {
		cursor: 'pointer',
		color: props =>
			theme.palette.sideNav.base[
				props.prefersDarkMode ? 'dark' : 'light'
			],
		'&:hover': {
			color: props =>
				props.prefersDarkMode
					? theme.palette.sideNav.hover.dark
					: theme.palette.sideNav.background.light,
		},
	},
	foldersVisible: {
		transition: `mask-position 0.3s, -webkit-mask-position 0.3s,${theme.transitions.create(
			'height',
			{
				easing: theme.transitions.easing.sharp,
				duration: theme.transitions.duration.enteringScreen,
			},
		)}`,
		height: 'auto',
		maxHeight: '100%',
	},
	foldersHidden: {
		transition: theme.transitions.create('height', {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
		height: 0,
	},
});

export default styles;
