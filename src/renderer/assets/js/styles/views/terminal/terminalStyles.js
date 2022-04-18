const styles = theme => ({
	terminalStyle: {
		width: '100%',
		zIndex: 0,
		backgroundColor: props =>
			props.settings.prefersDarkMode
				? props.settings.prefersTerminalView
					? '#000000'
					: theme.palette.explorer.background.dark
				: props.settings.prefersTerminalView
				? '#ffffff'
				: theme.palette.explorer.background.light,
		borderTop: props =>
			`1px solid ${
				theme.palette.navBar.background[
					props.settings.prefersDarkMode ? 'dark' : 'light'
				]
			}`,
		borderRight: props =>
			`1px solid ${
				theme.palette.navBar.background[
					props.settings.prefersDarkMode ? 'dark' : 'light'
				]
			}`,
		borderLeft: props =>
			`1px solid ${
				theme.palette.navBar.background[
					props.settings.prefersDarkMode ? 'dark' : 'light'
				]
			}`,
		position: 'absolute',
		bottom: 0,
		'& .xterm': {
			display: props =>
				props.settings.prefersTerminalView ? 'block' : 'none',
		},
		'& .xterm .xterm-viewport': {
			overflowY: 'scroll',
		},
	},
	circuitUIStyle: {
		display: props =>
			props.settings.prefersTerminalView ? 'none' : 'flex',
		height: '100%',
		width: '100%',
		flexDirection: 'column',
		justifyContent: 'flex-end',
		overflow: 'hidden',
		'& #circuit-ui-welcome-screen-container': {
			width: '100%',
			height: '100%',
			flexGrow: 1,
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'center',
			'& h1': {
				color: props =>
					theme.palette.explorer.background[
						props.settings.prefersDarkMode ? 'light' : 'dark'
					],
				fontWeight: 'bolder',
				fontSize: '5em',
				margin: 0,
			},
			'& p': {
				color: props =>
					theme.palette.explorer.background[
						props.settings.prefersDarkMode ? 'light' : 'dark'
					],
				fontSize: '1.3rem',
			},
		},
		'& #circuit-ui-results-container': {
			maxHeight: '95%',
			overflowY: 'scroll',
			paddingLeft: '1em',
			flexGrow: 1,
			'& #circuit-ui-results-and-toggler': {
				width: '100%',
				display: 'flex',
				justifyContent: 'flex-start',
				alignItems: 'stretch',
				gap: '0.25em',
				'& .toggle-bar': {
					width: '4px',
					background: 'gray',
					cursor: 'pointer',
				},
				'& #circuit-ui-results': {
					width: '100%',
				},
			},
			'& .query': {
				padding: '0.4em',
				backgroundColor: props =>
					theme.palette.navBar.background[
						props.settings.prefersDarkMode ? 'dark' : 'light'
					],
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'flex-end',
				flexDirection: 'row-reverse',
				gap: '1em',
				'& img': {
					cursor: 'pointer',
					transform: 'rotate(-90deg)',
					'&.hide-icon': {
						display: 'none',
					},
				},
				'&.dropdown': {
					'& img': {
						transform: 'rotate(0)',
					},
				},
				'& .content': {
					width: 'fit-content',
					backgroundColor: props =>
						theme.palette.sideNav.background[
							props.settings.prefersDarkMode ? 'dark' : 'light'
						],
					color: props =>
						theme.palette.sideNav.hover[
							props.settings.prefersDarkMode ? 'dark' : 'light'
						],
					padding: '0.1em 0.3em',
					borderRadius: '3px',
					margin: 0,
				},
			},
			'& .response': {
				maxHeight: '0px',
				overflow: 'hidden',
				display: 'flex',
				margin: '0.5em 0',
				color: props =>
					theme.palette.explorer.base[
						props.settings.prefersDarkMode ? 'dark' : 'light'
					],
				'&.dropdown': {
					maxHeight: '1000000vh',
				},
				'& .error': {
					backgroundColor: '#c23030',
					color: props =>
						theme.palette.sideNav.hover[
							props.settings.prefersDarkMode ? 'dark' : 'light'
						],
					padding: '0.1em 0.3em',
					borderRadius: '3px',
					margin: 0,
				},
				'& .value-wrapper': {
					display: 'flex',
					justifyContent: 'flex-start',
					alignItems: 'stretch',
					width: '100%',
					height: 'auto',
					gap: '0.25em',
				},
				'& .value-container': {
					width: '100%',
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'flex-start',
					justifyContent: 'center',
					gap: '1em',
				},
				'& .object-title': {
					cursor: 'pointer',
					width: 'fit-content',
					backgroundColor: props =>
						theme.palette.sideNav.background[
							props.settings.prefersDarkMode ? 'dark' : 'light'
						],
					color: props =>
						theme.palette.sideNav.hover[
							props.settings.prefersDarkMode ? 'dark' : 'light'
						],
					display: 'inline-block',
					padding: '0.1em 0.3em',
					borderRadius: '3px',
					marginBottom: '12px',
				},
				'& .object-container': {
					maxHeight: '40px',
					overflowX: 'auto',
					overflowY: 'hidden',
					width: '100%',
					padding: '0.5em',
					border: props =>
						`1px solid ${
							theme.palette.sideNav.base[
								props.settings.prefersDarkMode
									? 'dark'
									: 'light'
							]
						}`,
					'& img': {
						marginLeft: '8px',
						cursor: 'pointer',
						transform: 'rotate(-90deg)',
					},
					'&.dropdown': {
						maxHeight: '100vh',
						'& img': {
							transform: 'rotate(0)',
						},
					},
				},
				'& .object-entry-container': {
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'flex-start',
					gap: '1em',
				},
				'& .object-key': {
					minWidth: '10em',
				},
			},
		},
		'& #circuit-ui-input-container': {
			height: '3em',
			minHeight: '3em',
			width: '100%',
			display: 'flex',
			fontFamily: 'monospace',
			'& input': {
				height: '100%',
				width: '88%',
				paddingLeft: '1em',
				border: props =>
					`1px solid ${
						theme.palette.sideNav.base[
							props.settings.prefersDarkMode ? 'dark' : 'light'
						]
					}`,
				outline: 0,
				backgroundColor: props =>
					theme.palette.sideNav.background[
						props.settings.prefersDarkMode ? 'dark' : 'light'
					],
				color: props =>
					theme.palette.sideNav.base[
						props.settings.prefersDarkMode ? 'dark' : 'light'
					],
				'&:hover': {
					color: props =>
						theme.palette.sideNav.hover[
							props.settings.prefersDarkMode ? 'dark' : 'light'
						],
				},
				'&:focus': {
					color: props =>
						theme.palette.sideNav.hover[
							props.settings.prefersDarkMode ? 'dark' : 'light'
						],
				},
			},
			'& button': {
				height: '100%',
				width: '12%',
				border: props =>
					`1px solid ${
						theme.palette.sideNav.base[
							props.settings.prefersDarkMode ? 'dark' : 'light'
						]
					}`,
				borderLeft: 0,
				outline: 0,
				backgroundColor: props =>
					theme.palette.navBar.background[
						props.settings.prefersDarkMode ? 'dark' : 'light'
					],
				color: props =>
					theme.palette.navBar.base[
						props.settings.prefersDarkMode ? 'dark' : 'light'
					],
				'&:hover': {
					backgroundColor: props =>
						theme.palette.navBar.hover[
							props.settings.prefersDarkMode ? 'dark' : 'light'
						],
				},
			},
			'& #suggestion-box-tracker': {
				position: 'absolute',
				visibility: 'hidden',
			},
		},
	},
	querySelectionTooltipStyle: {
		position: 'absolute',
	},
	querySelectionToolTipPortalStyle: {
		'& > div > div:nth-child(1)': {
			display: 'none',
		},
	},
	querySuggestionsStyle: {
		backgroundColor: props =>
			theme.palette.navBar.background[
				props.settings.prefersDarkMode ? 'dark' : 'light'
			],
		color: props =>
			theme.palette.navBar.base[
				props.settings.prefersDarkMode ? 'dark' : 'light'
			],
		padding: '0.4em',
		maxHeight: '50vh',
		overflowY: 'scroll',
		'&:hover::-webkit-scrollbar-thumb': {
			transition: theme.transitions.create('background-color', {
				easing: theme.transitions.easing.linear,
				duration: 1000,
			}),
		},
	},
	querySuggestionStyle: {
		display: 'flex',
		width: '100%',
		padding: '0.5em',
		justifyContent: 'space-between',
		cursor: 'pointer',
		'&:hover': {
			color: props =>
				theme.palette.sideNav.hover[
					props.settings.prefersDarkMode ? 'dark' : 'light'
				],
		},
	},
	terminalOpen: {
		transition: theme.transitions.create('height', {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
		height: props => props.terminalHeight,
	},
	terminalClose: {
		transition: theme.transitions.create('height', {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
		height: 0,
		visibility: 'hidden',
	},
	terminalControlContainerStyle: {
		backgroundColor: props =>
			props.settings.prefersDarkMode
				? props.settings.prefersTerminalView
					? '#000000'
					: theme.palette.explorer.background.dark
				: props.settings.prefersTerminalView
				? '#ffffff'
				: theme.palette.explorer.background.light,
		zIndex: 5,
		width: '100%',
		height: '2em',
		paddingTop: '0.5em',
		display: 'flex',
		justifyContent: 'flex-end',
		alignItems: 'center',
		position: 'absolute',
		top: 0,
	},
	terminalControlItemsStyle: {
		color: props =>
			props.settings.prefersDarkMode
				? props.settings.prefersTerminalView
					? '#ffffff'
					: theme.palette.explorer.base.dark
				: props.settings.prefersTerminalView
				? '#000000'
				: theme.palette.explorer.base.light,
		marginRight: '1.5em',
		zIndex: 4,
		cursor: 'pointer',
	},
	resizeHandleStyle: {
		position: 'absolute',
		height: '5px',
		width: '100%',
		cursor: 'row-resize',
		top: '-5px',
		backgroundColor: 'transparent',
		'&:hover': {
			backgroundColor: props =>
				props.settings.prefersDarkMode
					? 'rgba(255, 255, 255, 0.5)'
					: 'rgba(0,0,0,0.5)',
		},
	},
});

export default styles;
