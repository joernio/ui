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
		cursor: 'pointer',
	},
	titleStyle: {
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
	filesSectionStyle: {
		paddingLeft: '1.3em',
		overflowY: 'scroll',
	},
	fileSectionStyle: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingRight: '0.5em',
		cursor: 'pointer',
		'& > .unsaved-cross-icon': {
			display: 'none',
		},
		'& > .unsaved-icon': {
			display: 'block',
		},
		'&:hover': {
			'& > .unsaved-cross-icon': {
				display: 'block',
			},
			'& > .unsaved-icon': {
				display: 'none',
			},
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
	fileNameStyle: {
		flexGrow: 1,
		// maxWidth: '180px',
		color: props =>
			theme.palette.explorer.base[
				props.prefersDarkMode ? 'dark' : 'light'
			],
		textOverflow: 'ellipsis',
		overflow: 'hidden',
		fontSize: '0.9rem',
		fontWeight: 400,
		marginTop: '0.2em',
		marginBottom: '0.2em',
	},
	filesVisible: {
		transition: `mask-position 0.3s, -webkit-mask-position 0.3s,${theme.transitions.create(
			'height',
			{
				easing: theme.transitions.easing.sharp,
				duration: theme.transitions.duration.enteringScreen,
			},
		)}`,
		height: 'auto',
		maxHeight: '12em',
	},
	filesHidden: {
		transition: theme.transitions.create('height', {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
		height: 0,
	},
});

export default styles;
