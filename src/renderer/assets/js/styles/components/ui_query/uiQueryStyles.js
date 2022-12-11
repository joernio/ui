const styles = theme => ({
	uiQueryStyle: {
		padding: '0.4em',
		margin: '0 0 0.5em 0',
		backgroundColor: props =>
			theme.palette.navBar.background[
				props.prefersDarkMode ? 'dark' : 'light'
			],
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'flex-end',
		flexDirection: 'row-reverse',
	},
	customIconStyle: {
		padding: '0.2em',
		cursor: 'pointer',
		transform: 'rotate(-90deg)',
		'&.hide-icon': {
			display: 'none',
		},
		'&.dropdown': {
			transform: 'rotate(0)',
		},
	},
	contentStyle: {
		width: 'fit-content',
		backgroundColor: props =>
			theme.palette.sideNav.background[
				props.prefersDarkMode ? 'dark' : 'light'
			],
		color: props =>
			theme.palette.sideNav.hover[
				props.prefersDarkMode ? 'dark' : 'light'
			],
		padding: '0.1em 0.3em',
		borderRadius: '3px',
		marginRight: '0.5em',
		marginTop: 0,
		marginBottom: 0,
	},
});

export default styles;
