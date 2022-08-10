const styles = theme => ({
	discardDialogStyle: {
		'& > div > div:nth-child(1)': {
			backgroundColor: 'rgba(0, 0, 0, 0)',
		},
		'& > div > div.bp3-dialog-container': {
			alignItems: 'normal',
			minHeight: 'fit-content',
			'&:focus': {
				outline: 'none',
				border: 'none',
			},
			'& > div': {
				paddingBottom: 0,
				backgroundColor: props =>
					theme.palette.menu.background[
						props.prefersDarkMode ? 'dark' : 'light'
					],
				borderRadius: 0,
				'& > div:nth-child(1)': {
					borderRadius: 0,
					backgroundColor: props =>
						theme.palette.menu.background[
							props.prefersDarkMode ? 'dark' : 'light'
						],
					color: theme.palette.sideNav.base.light,
					margin: '1em',
					padding: 0,
					minHeight: 0,
				},
			},
		},
	},
	discardDialogContentStyle: {
		margin: ' 1em',
		backgroundColor: props =>
			theme.palette.menu.background[
				props.prefersDarkMode ? 'dark' : 'light'
			],
		'& div': {
			display: 'flex',
			justifyContent: 'space-between',
			alignItems: 'center',
			flexWrap: 'wrap',
			'& h3': {
				width: '100%',
				margin: '0.6em 0',
				color: theme.palette.sideNav.base.light,
			},
			'& h4': {
				width: '100%',
				margin: '0.6em 0',
				borderBottom: 0,
				color: theme.palette.sideNav.base.light,
			},
		},
	},
	actionSectionStyle: {
		display: 'flex',
		justifyContent: 'flex-end',
		paddingBottom: '0.2em',
		'& h3': {
			color: props =>
				theme.palette.button.base[
					props.prefersDarkMode ? 'dark' : 'light'
				],
			backgroundColor: props =>
				theme.palette.navBar.hover[
					props.prefersDarkMode ? 'dark' : 'light'
				],
			cursor: 'pointer',
			margin: '0.3em',
			padding: '0.5em 0.8em',
		},
		'& h3.save': {
			margin: '0.3em 1em',
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
	},
});

export default styles;
