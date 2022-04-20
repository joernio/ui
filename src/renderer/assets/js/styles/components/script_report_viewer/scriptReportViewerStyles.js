const styles = theme => ({
	parsedReportStyle: {
		height: '95%',
		width: '100%',
		overflow: 'scroll',
		color: props =>
			props.settings.prefersDarkMode ? '#C3CCCC' : '#616161',
		backgroundColor: props =>
			theme.palette.editor.background[
				props.settings.prefersDarkMode ? 'dark' : 'light'
			],
	},
	propertiesContainerStyle: {
		width: '100%',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'flex-start',
		justifyContent: 'center',
		gap: '1em',
		marginBottom: '2em',
		padding: '0.5em',
	},
	locationsContainerStyle: {
		margin: '0.5em',
		borderCollapse: 'collapse',
		'& td': {
			borderLeft: props =>
				`1px solid rgba${
					props.settings.prefersDarkMode
						? '(255,255,255,0.2)'
						: '(0,0,0,0.2)'
				}`,
			textAlign: 'left',
			padding: '0 0.5em',
			borderCollapse: 'collapse',
			cursor: 'pointer',
		},
		'& td:first-child': {
			borderLeft: '1px solid transparent',
		},
		'& th': {
			border: '1px solid transparent',
			textAlign: 'left',
			padding: '0.5em',
		},
		'& tr:hover': {
			backgroundColor: props =>
				theme.palette.explorer.hover[
					props.settings.prefersDarkMode ? 'dark' : 'light'
				],
		},
		'& tr:nth-child(odd)': {
			backgroundColor: props =>
				theme.palette.explorer.background[
					props.settings.prefersDarkMode ? 'dark' : 'light'
				],
		},
	},
	locationsTableHeadingStyle: {
		width: '20%',
	},
	conditionHeadingStyle: {
		width: '40%',
		minWidth: '20em',
	},
	rawJSONContainerStyle: {
		height: '90%',
		overflow: 'auto',
		marginLeft: '1em',
		paddingTop: '1em',
		color: props =>
			props.settings.prefersDarkMode ? '#C3CCCC' : '#616161',
	},
});

export default styles;
