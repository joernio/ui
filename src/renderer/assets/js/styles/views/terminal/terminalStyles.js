const styles = theme => ({
	terminalStyle: {
		width: '100%',
		zIndex: 2,
		backgroundColor: props =>
			props.prefersDarkMode
				? props.prefersTerminalView
					? '#000000'
					: theme.palette.explorer.background.dark
				: props.prefersTerminalView
				? '#ffffff'
				: theme.palette.explorer.background.light,
		borderTop: props =>
			`1px solid ${
				theme.palette.navBar.background[
					props.prefersDarkMode ? 'dark' : 'light'
				]
			}`,
		borderRight: props =>
			`1px solid ${
				theme.palette.navBar.background[
					props.prefersDarkMode ? 'dark' : 'light'
				]
			}`,
		borderLeft: props =>
			`1px solid ${
				theme.palette.navBar.background[
					props.prefersDarkMode ? 'dark' : 'light'
				]
			}`,
		position: 'absolute',
		bottom: 0,
		'& .xterm': {
			display: props => (props.prefersTerminalView ? 'block' : 'none'),
		},
		'& .xterm .xterm-viewport': {
			overflowY: 'scroll',
		},
	},
	circuitUIStyle: {
		display: props => (props.prefersTerminalView ? 'none' : 'flex'),
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
						props.prefersDarkMode ? 'light' : 'dark'
					],
				fontWeight: 'bolder',
				fontSize: '5em',
				margin: 0,
			},
			'& p': {
				color: props =>
					theme.palette.explorer.background[
						props.prefersDarkMode ? 'light' : 'dark'
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
				'& .toggle-bar': {
					minWidth: '6px',
					background: 'gray',
					cursor: 'pointer',
				},
				'& #circuit-ui-results': {
					width: '100%',
					height: '100%',
					marginLeft: '0.3em',
				},
			},
			'& .query': {
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
			},
			'& .response': {
				display: 'none',
			},
			'& .response.dropdown': {
				overflow: 'hidden',
				display: 'flex',
				color: props =>
					theme.palette.explorer.base[
						props.prefersDarkMode ? 'dark' : 'light'
					],
				'& .error': {
					backgroundColor: '#c23030',
					color: props =>
						theme.palette.sideNav.hover[
							props.prefersDarkMode ? 'dark' : 'light'
						],
					padding: '0.1em 0.3em',
					borderRadius: '3px',
					margin: '0 0.5em 0 0',
				},
				'& .content': {
					flexGrow: 1,
					margin: '0.3em 0',
				},
				'& .list': {
					width: '100%',
					marginLeft: '0.3em',
					padding: '0.5em',
					border: props =>
						`1px solid ${
							theme.palette.sideNav.base[
								props.prefersDarkMode ? 'dark' : 'light'
							]
						}`,
					'& .object-title': {
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
						marginBottom: '12px',
					},
					'& img': {
						marginLeft: '8px',
						cursor: 'pointer',
						transform: 'rotate(-90deg)',
						'&.dropdown': {
							transform: 'rotate(0)',
						},
					},
					'& .object-entry-container': {
						display: 'none',
						alignItems: 'center',
						justifyContent: 'flex-start',
						'&.dropdown': {
							display: 'flex',
						},
					},
					'& .object-key': {
						minWidth: '10em',
					},
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
							props.prefersDarkMode ? 'dark' : 'light'
						]
					}`,
				outline: 0,
				backgroundColor: props =>
					theme.palette.sideNav.background[
						props.prefersDarkMode ? 'dark' : 'light'
					],
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
				'&:focus': {
					color: props =>
						theme.palette.sideNav.hover[
							props.prefersDarkMode ? 'dark' : 'light'
						],
				},
			},
			'& button': {
				height: '100%',
				width: '12%',
				border: props =>
					`1px solid ${
						theme.palette.sideNav.base[
							props.prefersDarkMode ? 'dark' : 'light'
						]
					}`,
				borderLeft: 0,
				outline: 0,
				backgroundColor: props =>
					theme.palette.navBar.background[
						props.prefersDarkMode ? 'dark' : 'light'
					],
				color: props =>
					theme.palette.navBar.base[
						props.prefersDarkMode ? 'dark' : 'light'
					],
				'&:hover': {
					backgroundColor: props =>
						theme.palette.navBar.hover[
							props.prefersDarkMode ? 'dark' : 'light'
						],
				},
			},
			'& #suggestion-box-tracker': {
				position: 'absolute',
				visibility: 'hidden',
			},
		},
	},
	querySuggestionPopoverStyle: {
		position: 'absolute',
	},
	querySuggestionPopoverPortalStyle: {
		'& > div > div:nth-child(1)': {
			display: 'none',
		},
	},
  querySuggestionsStyle: {
		backgroundColor: props =>
			theme.palette.navBar.background[
				props.prefersDarkMode ? 'dark' : 'light'
			],
		color: props =>
			theme.palette.navBar.base[
				props.prefersDarkMode ? 'dark' : 'light'
			],
		padding: '0.2em 0',
		paddingLeft: '12px',
		maxHeight: '20em',
		overflowY: 'scroll',
		'& .query-suggestion-selected': {
			color: props =>
				theme.palette.sideNav.hover[
					props.prefersDarkMode ? 'dark' : 'light'
				],
			backgroundColor: '#0090F150',
			border: '1px solid #0090F1',
			outline: 'none',
			'&:hover': {
				backgroundColor: '#0090f16b !important',
			},
		},
	},
	querySuggestionStyle: {
		width: '100%',
		minWidth: '20em',
		padding: '0.5em',
		cursor: 'pointer',
		'&:hover': {
			backgroundColor: props =>
				theme.palette.explorer.hover[
					props.prefersDarkMode ? 'dark' : 'light'
				],
		},
	},
	querySuggestionMatchStyle: {
		color: '#0090F1',
	},
	querySuggestionOriginIconStyle: {
		marginRight: '0.5em',
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
			props.prefersDarkMode
				? props.prefersTerminalView
					? '#000000'
					: theme.palette.explorer.background.dark
				: props.prefersTerminalView
				? '#ffffff'
				: theme.palette.explorer.background.light,
		zIndex: 5,
		width: '100%',
		height: '2em',
		display: 'flex',
		justifyContent: 'flex-end',
		alignItems: 'center',
		position: 'absolute',
		top: 0,
	},
	terminalControlItemsStyle: {
		color: props =>
			props.prefersDarkMode
				? props.prefersTerminalView
					? '#ffffff'
					: theme.palette.explorer.base.dark
				: props.prefersTerminalView
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
				props.prefersDarkMode
					? 'rgba(255, 255, 255, 0.5)'
					: 'rgba(0,0,0,0.5)',
		},
	},
});

export default styles;
