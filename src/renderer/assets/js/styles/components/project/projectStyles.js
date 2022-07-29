const styles = theme => ({
	projectInfoTooltipStyles: {
		width: '100%',
	},
	projectInfoContainerStyle: {
		backgroundColor: props =>
			theme.palette.navBar.background[
				props.prefersDarkMode ? 'dark' : 'light'
			],
		color: props =>
			theme.palette.navBar.base[props.prefersDarkMode ? 'dark' : 'light'],
		padding: '0.4em',
		width: '300px',
		maxHeight: '300px',
	},
	projectSectionStyle: {
		cursor: 'context-menu',
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingRight: '0.5em',
		'&:hover': {
			backgroundColor: props =>
				theme.palette.explorer.hover[
					props.prefersDarkMode ? 'dark' : 'light'
				],
		},
		'&:focus': {
			backgroundColor: '#0090F150',
			border: '1px solid #0090F1',
			outline: 'none',
		},
	},
	projectNameStyle: {
		flexGrow: 1,
		color: props =>
			theme.palette.explorer.base[
				props.prefersDarkMode ? 'dark' : 'light'
			],
		textOverflow: 'ellipsis',
		maxWidth: '180px',
		overflow: 'hidden',
		fontSize: '0.9rem',
		fontWeight: 400,
		marginTop: '0.2em',
		marginBottom: '0.2em',
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
		textTransform: 'capitalize',
		paddingRight: '12px',
		paddingLeft: '12px',
		color: props =>
			theme.palette.menu.base[props.prefersDarkMode ? 'dark' : 'light'],
		'& span': {
			color: props =>
				`${
					theme.palette.menu.base[
						props.prefersDarkMode ? 'dark' : 'light'
					]
				} !important`,
			marginRight: '0.5em',
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
	dangerStyle: {
		color: theme.palette.error.main,
		'& svg': {
			fill: theme.palette.error.main,
		},
	},
});

export default styles;
