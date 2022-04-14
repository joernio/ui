const styles = theme => ({
	rootStyle: {
		width: '100%',
		height: '100%',
		position: 'relative',
		overflowX: 'hidden',
		overflowY: 'auto',
		backgroundColor: props =>
			theme.palette.editor.background[
				props.settings.prefersDarkMode ? 'dark' : 'light'
			],
		'& > div': {
			width: '100%',
			height: 'auto',
			position: 'absolute',
			left: '0',
			top: '0',
			color: props =>
				props.settings.prefersDarkMode ? '#C3CCCC' : '#616161',
		},
	},
	iconContainerStyle: {
		display: 'flex',
		gap: '1em',
		padding: '0.2em 0',
	},
	iconStyle: {
		color: props =>
			theme.palette.sideNav.base[
				props.settings.prefersDarkMode ? 'dark' : 'light'
			],
		'&:hover': {
			color: props =>
				props.settings.prefersDarkMode
					? theme.palette.sideNav.hover.dark
					: theme.palette.sideNav.background.light,
		},
	},
	editQueryShortCutIconStyle: {
		margin: '0 1em 0 0.5em',
	},
	frame0Style: {
		transform: 'translateX(0)',
		backgroundColor: props =>
			theme.palette.editor.background[
				props.settings.prefersDarkMode ? 'dark' : 'light'
			],
		'& div': {
			borderLeft: 'none',
		},
		'& .heading': {
			'& div': {
				visibility: 'hidden',
			},
		},
	},
	frame1Style: {
		transform: 'translateX(100px)',
		backgroundColor: props =>
			theme.palette.editor.background[
				props.settings.prefersDarkMode ? 'dark' : 'light'
			],
	},
	frame2Style: {
		transform: 'translateX(400px)',
		backgroundColor: props =>
			theme.palette.editor.background[
				props.settings.prefersDarkMode ? 'dark' : 'light'
			],
	},
	frame3Style: {
		transform: 'translateX(700px)',
		backgroundColor: props =>
			theme.palette.editor.background[
				props.settings.prefersDarkMode ? 'dark' : 'light'
			],
	},
	frame4Style: {
		transform: 'translateX(1000px)',
		backgroundColor: props =>
			theme.palette.editor.background[
				props.settings.prefersDarkMode ? 'dark' : 'light'
			],
	},
	dragStyle: {
		width: '4px',
		position: 'absolute',
		left: '-1px',
		top: '0',
		height: '100%',
		transition: 'all 0.2s',
		cursor: 'col-resize',
		backgroundColor: 'transparent',
		'&:hover': {
			backgroundColor: props =>
				props.settings.prefersDarkMode
					? 'rgba(255, 255, 255, 0.5)'
					: 'rgba(0,0,0,0.5)',
		},
	},
	contentStyle: {
		width: '100%',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'flex-start',
		justifyContent: 'center',
		'& *': {
			'user-select': 'none',
		},
	},
	innerContentStyle: {
		width: '100%',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'flex-start',
		justifyContent: 'center',
		position: 'relative',
		borderLeft: props =>
			props.settings.prefersDarkMode
				? '1px solid rgba(255, 255, 255, 0.5)'
				: '1px solid rgba(0,0,0,0.5)',
	},
	itemStyle: {
		width: '100%',
		padding: '0 1.5em',
		height: '24px',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'flex-start',
		color: props =>
			props.settings.prefersDarkMode ? '#C3CCCC' : '#616161',
	},
	headingStyle: {
		width: '100%',
		position: 'sticky',
		zIndex: 10,
		top: 0,
		backgroundColor: props =>
			theme.palette.explorer.background[
				props.settings.prefersDarkMode ? 'dark' : 'light'
			],
		padding: '0.5em 1.5em',
		fontWeight: 'bold',
		color: props =>
			theme.palette.editor.base[
				props.settings.prefersDarkMode ? 'dark' : 'light'
			],
	},
	evenStyle: {
		backgroundColor: props =>
			theme.palette.explorer.background[
				props.settings.prefersDarkMode ? 'dark' : 'light'
			],
	},
	oddStyle: {
		backgroundColor: 'transparent',
	},
	hoverStyle: {
		backgroundColor: props =>
			theme.palette.explorer.hover[
				props.settings.prefersDarkMode ? 'dark' : 'light'
			],
	},
	tagSeparationStyle: {
		margin: '0 0.4em',
	},
});

export default styles;
