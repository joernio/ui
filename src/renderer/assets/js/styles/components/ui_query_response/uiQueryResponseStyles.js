const styles = theme => ({
	uiResponseStyle: {
		display: 'none',
		'&.dropdown': {
			overflow: 'hidden',
			display: 'flex',
			color: props =>
				theme.palette.explorer.base[
					props.prefersDarkMode ? 'dark' : 'light'
				],
		},
	},
	errorStyle: {
		backgroundColor: '#c23030',
		color: props =>
			theme.palette.sideNav.hover[
				props.prefersDarkMode ? 'dark' : 'light'
			],
		padding: '0.1em 0.3em',
		borderRadius: '3px',
		margin: '0 0.5em 0 0',
	},
	contentStyle: {
		flexGrow: 1,
		margin: '0.3em 0',
	},
	listStyle: {
		width: '100%',
		marginLeft: '0.3em',
		padding: '0.5em',
		border: props =>
			`1px solid ${
				theme.palette.sideNav.base[
					props.prefersDarkMode ? 'dark' : 'light'
				]
			}`,
	},
	objectTitleSectionStyle: {
		display: 'flex',
		alignItems: 'center',
		marginBottom: '12px',
	},
	objectTitleStyle: {
		cursor: 'pointer',
		width: 'fit-content',
		backgroundColor: props =>
			theme.palette.sideNav.background[
				props.prefersDarkMode ? 'dark' : 'light'
			],
		color: props =>
			theme.palette.sideNav.hover[
				props.prefersDarkMode ? 'dark' : 'light'
			],
		display: 'inline-block',
		padding: '0.1em 0.3em',
		borderRadius: '3px',
	},
	customIconStyle: {
		padding: '0.2em',
		cursor: 'pointer',
		transform: 'rotate(-90deg)',
		'&.dropdown': {
			transform: 'rotate(0)',
		},
	},
	objectEntryContainerStyle: {
		display: 'none',
		alignItems: 'center',
		justifyContent: 'flex-start',
		'&.dropdown': {
			display: 'flex',
		},
	},
	objectKeyStyle: {
		minWidth: '10em',
	},
});

export default styles;
