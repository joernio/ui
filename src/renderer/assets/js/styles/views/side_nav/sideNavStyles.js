const styles = theme => ({
	rootStyle: {
		height: '100%',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		backgroundColor: props =>
			theme.palette.sideNav.background[
				props.prefersDarkMode ? 'dark' : 'light'
			],
		width: props => props.sideNavWidth,
		'& ul': {
			display: 'flex',
			flexDirection: 'column',
			height: '100%',
		},
		'& .nav-upper-section': {
			flexGrow: 1,
		},
	},

	topIconsContainerStyle: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
	},

	toolTipStyle: {
		'& .bp3-popover2-content': {
			backgroundColor: props =>
				theme.palette.navBar.background[
					props.prefersDarkMode ? 'dark' : 'light'
				],
		},
		'& .bp3-popover2-arrow-fill': {
			fill: props =>
				theme.palette.navBar.background[
					props.prefersDarkMode ? 'dark' : 'light'
				],
		},
	},
	toolTipTextStyle: {
		backgroundColor: props =>
			theme.palette.navBar.background[
				props.prefersDarkMode ? 'dark' : 'light'
			],
		color: props =>
			theme.palette.navBar.base[props.prefersDarkMode ? 'dark' : 'light'],
	},
	settingsDialogStyle: {
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
					'& h4': {
						color: props =>
							props.prefersDarkMode ? '#FFFFFF' : '#000000',
						outline: props =>
							`1px solid ${
								theme.palette.menu.background[
									props.prefersDarkMode ? 'dark' : 'light'
								]
							}`,
						borderBottom: props =>
							`1px solid ${
								theme.palette.menu.base[
									props.prefersDarkMode ? 'dark' : 'light'
								]
							}50`,
						paddingBottom: '0.8em',
					},
				},
			},
		},
	},
	settingsDialogContentStyle: {
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
				width: '50%',
				margin: '0.6em 0',
				color: theme.palette.sideNav.base.light,
			},
			'& input': {
				height: '2em',
				width: '50%',
				border: props =>
					`1px solid rgba(206, 206, 206, ${
						props.prefersDarkMode ? '0' : '1'
					})`,
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
				'&:disabled': {
					backgroundColor: props =>
						`rgba(60, 60, 60, ${
							props.prefersDarkMode ? '0.5' : '0.05'
						})`,
				},
			},
		},
	},
	switchStyle: {
		display: 'flex',
		alignItems: 'center',
		marginBottom: 0,
		'& > span': {
			outline: 'none !important',
		},
	},
	submitSectionStyle: {
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
	menuDividerStyle: {
		borderTop: props =>
			`1px solid ${
				theme.palette.menu.base[
					props.prefersDarkMode ? 'dark' : 'light'
				]
			}50`,
	},
	iconStyle: {
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
		margin: '1em 0',
	},
	shortcutsIconStyle: {
		transform: 'rotate(180deg)',
	},
});

export default styles;
