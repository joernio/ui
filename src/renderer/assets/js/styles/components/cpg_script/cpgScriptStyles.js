const styles = theme => ({
	scriptSectionStyle: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingRight: '0.5em',
		cursor: 'context-menu',
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
	taggedScriptSectionStyle: {
		paddingLeft: '0.65em',
	},
	selectedConfigStyle: {
		backgroundColor: '#0090F150',
		'&:hover': {
			backgroundColor: '#0090f16b !important',
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
	menuDividerStyle: {
		borderTop: props =>
			`1px solid ${
				theme.palette.menu.base[
					props.prefersDarkMode ? 'dark' : 'light'
				]
			}50`,
	},
	scriptNameStyle: {
		flexGrow: 1,
		color: props =>
			theme.palette.explorer.base[
				props.prefersDarkMode ? 'dark' : 'light'
			],
		textOverflow: 'ellipsis',
		maxWidth: props => (props.hasTag ? '170px' : '180px'),
		overflow: 'hidden',
		fontSize: '0.9rem',
		fontWeight: 400,
		marginTop: '0.2em',
		marginBottom: '0.2em',
	},
	contextMenuItemStyle: {
		textTransform: 'capitalize',
		backgroundColor: 'rgba(0,0,0,0)',
		paddingRight: '12px',
		paddingLeft: '12px',
		'&:hover': {
			backgroundColor: theme.palette.action.hover,
		},
		'& svg': {
			marginRight: '0.5em',
		},
	},
	dangerStyle: {
		color: theme.palette.error.main,
		'& svg': {
			fill: theme.palette.error.main,
		},
	},
});

export default styles;
