const styles = theme => ({
	rootStyle: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		width: '100%',
		height: '100%',
		overflowY: 'hidden',
		paddingBottom: props =>
			`calc(${props.terminalHeight ? props.terminalHeight : '0px'} + ${
				props.statusBarHeight ? props.statusBarHeight : '0px'
			} * 2)`,
		color: theme.palette.sideNav.base.light,
	},
	messageStyle: {
		color: props =>
			theme.palette.explorer.background[
				props.prefersDarkMode ? 'light' : 'dark'
			],
		fontSize: '1.5rem',
		maxWidth: '80%',
	},
	buttonStyle: {
		padding: '0.5em',
		margin: '1em',
		fontSize: '1rem',
	},
	smallButtonStyle: {
		margin: '0.2em',
		padding: '0.2em',
		fontSize: '1rem',
	},
	configsFooterButtonStyle: {
		minWidth: '10em',
	},
	configButtonStyle: {
		height: 'fit-content',
		minWidth: '5em',
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
	configTagSectionStyle: {
		display: 'flex',
		width: '100%',
		flexWrap: 'wrap',
	},
	configsSectionStyle: {
		width: '100%',
		height: '100%',
		display: 'flex',
		flexDirection: 'column',
		padding: '0 1em 1em 1em',
	},
	configsFilterSectionStyle: {
		width: '100%',
		display: 'flex',
	},
	configsFilterLabelStyle: {
		display: 'flex !important',
		alignItems: 'center',
		marginRight: '2em',
	},
	selectInputStyle: {
		minWidth: '8em',
		marginLeft: '0.8em',
		height: '2em',
		border: props =>
			`1px solid rgba(206, 206, 206, ${
				props.prefersDarkMode ? '0' : '1'
			})`,
		backgroundColor: props =>
			`rgba(60, 60, 60, ${props.prefersDarkMode ? '1' : '0'})`,
		'& select': {
			backgroundColor: props =>
				`rgba(60, 60, 60, ${props.prefersDarkMode ? '1' : '0'})`,
			color: props => (props.prefersDarkMode ? '#C3CCCC' : '#616161'),
			'&:focus': {
				outline: '0',
				border: props =>
					`1px solid ${
						theme.palette.menu.hover[
							props.prefersDarkMode ? 'dark' : 'light'
						]
					}`,
			},
		},
		'& span': {
			color: props =>
				theme.palette.sideNav.base[
					props.prefersDarkMode ? 'dark' : 'light'
				],
			'&:hover': {
				color: props =>
					theme.palette.sideNav.hover[
						props.prefersDarkMode ? 'dark' : 'light'
					],
			},
		},
	},
	configsBodyStyle: {
		display: 'flex',
		marginBottom: '1.5em',
		overflowY: 'scroll',
		flexWrap: 'wrap',
	},
	configsFilterNotFoundStyle: {
		width: '100%',
		height: '100%',
		padding: '1em',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: props =>
			theme.palette.explorer.background[
				props.prefersDarkMode ? 'dark' : 'light'
			],
		border: props =>
			`1px solid ${
				theme.palette.navBar.background[
					props.prefersDarkMode ? 'dark' : 'light'
				]
			}`,
	},
	rulesFilterResultStyle: {
		width: '100%',
		backgroundColor: props =>
			theme.palette.explorer.background[
				props.prefersDarkMode ? 'dark' : 'light'
			],
	},
	configsFilterNotFoundIconStyle: {
		position: 'relative',
		margin: '1em',
	},
	iconStyle: {
		color: props =>
			theme.palette.explorer.background[
				props.prefersDarkMode ? 'light' : 'dark'
			],
	},
	crossIconStyle: {
		position: 'absolute',
		top: '10%',
		right: '30%',
	},
	configsFooterStyle: {
		width: '100%',
		display: 'flex',
		justifyContent: 'flex-end',
		marginTop: 'auto',
	},
	filteredConfigContainerStyle: {
		boxSizing: 'border-box',
		padding: '0.5em',
		width: props => `${100 / Math.ceil(props.configs_body_width / 1000)}%`,
	},
	selectedConfigStyle: {
		border: props =>
			`1px solid ${
				theme.palette.navBar.base[
					props.prefersDarkMode ? 'dark' : 'light'
				]
			} !important`,
	},
	configToolTipStyle: {
		height: '100%',
		width: '100%',
	},
	configStyle: {
		cursor: 'pointer',
		display: 'flex',
		width: '100%',
		minHeight: '10em',
		height: '100%',
		backgroundColor: props =>
			theme.palette.explorer.background[
				props.prefersDarkMode ? 'dark' : 'light'
			],
		border: props =>
			`1px solid ${
				theme.palette.navBar.background[
					props.prefersDarkMode ? 'dark' : 'light'
				]
			}`,
		'&:hover': {
			border: props =>
				`1px solid ${
					theme.palette.navBar.base[
						props.prefersDarkMode ? 'dark' : 'light'
					]
				}`,
		},
	},
	configCheckboxStyle: {
		margin: '1em 0 0.5em 0.5em',
		'& input:focus ~ span': {
			outline: 'none !important',
		},
	},
	configBodyStyle: {
		margin: '0.5em',
		flexGrow: 1,
		display: 'flex',
		flexDirection: 'column',
	},
	configTitleStyle: {
		margin: '0 0 0.5em 0',
	},
	configDescStyle: {
		flexGrow: 1,
	},
});

export default styles;
