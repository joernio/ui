const styles = theme => ({
	rootStyle: {
		width: '100%',
		height: '100%',
		overflowY: 'hidden',
		paddingBottom: props =>
			`calc(${props.terminalHeight ? props.terminalHeight : '0px'} + ${
				props.statusBarHeight ? props.statusBarHeight : '0px'
			} * 2)`,
		display: 'flex',
		alignItems: 'center',
		backgroundColor: props =>
			theme.palette.editor.background[
				props.prefersDarkMode ? 'dark' : 'light'
			],
		color: props =>
			theme.palette.editor.base[props.prefersDarkMode ? 'dark' : 'light'],
	},
	methodSearchDrawerStyle: {
		height: '100%',
		position: 'relative',
		zIndex: 1,
		border: props =>
			`1px solid ${
				theme.palette.navBar.background[
					props.prefersDarkMode ? 'dark' : 'light'
				]
			}`,
	},
	methodSearchContainerStyle: {
		margin: '0.5em',
		display: 'flex',
		flexDirection: 'column',
		height: '100%',
	},
	methodSearchInputContainerStyle: {
		paddingBottom: '0.5em',
	},
	methodSearchInputStyle: {
		height: '2em',
		width: '100%',
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
	},
	methodSearchResultContainerStyle: {
		flexGrow: 1,
		overflowX: 'scroll',
		'&::-webkit-scrollbar-track': {
			marginTop: '10px',
		},
		color: props =>
			theme.palette.explorer.base[
				props.prefersDarkMode ? 'dark' : 'light'
			],
	},
	loadingContainerStyle: {
		height: '100%',
		width: '100%',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'column',
		color: props =>
			theme.palette.sideNav.base[
				props.prefersDarkMode ? 'dark' : 'light'
			],
	},
	loadingIconStyle: {
		margin: '1em',
		'&:hover': {
			color: props =>
				props.prefersDarkMode
					? theme.palette.sideNav.hover.dark
					: theme.palette.sideNav.background.light,
		},
	},
	noResultStyle: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		height: '100%',
		justifyContent: 'center',
	},
	methodNameStyle: {
		width: 'calc(100% - 14px)!important', // neccessary because react-virtualized it setting width inline
		textOverflow: 'ellipsis',
		overflow: 'hidden',
		fontSize: '0.9rem',
		fontWeight: 400,
		marginTop: 0,
		paddingTop: '0.4em',
		paddingBottom: '0.4em',

		cursor: 'pointer',
		'&:hover': {
			backgroundColor: props =>
				theme.palette.explorer.hover[
					props.prefersDarkMode ? 'dark' : 'light'
				],
		},
	},
	methodNameFocusedStyle: {
		backgroundColor: '#0090F150',
		border: '1px solid #0090F1',
		outline: 'none',
	},
	binaryEditorsContainerStyle: {
		flexGrow: 1,
		height: '100%',
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'flex-end',
		position: 'relative',
		flexWrap: 'wrap',
	},
	loadingIconAbsolutePositionStyle: {
		position: 'absolute',
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
		margin: 'auto',
		height: 'fit-content',
		width: 'fit-content',
	},
	binaryContainerStyle: {
		width: '100%',
		height: props => `calc(100% - 5px - ${props.methodContainerHeight})`,
	},
	binaryContainerOpenStyle: {
		height: props => props.binaryContainerHeight,
	},
	methodContainerStyle: {
		width: '100%',
		position: 'relative',
		paddingTop: '10px',
		borderTop: props =>
			`5px solid ${
				theme.palette.navBar.background[
					props.prefersDarkMode ? 'dark' : 'light'
				]
			}`,
		backgroundColor: props =>
			props.prefersDarkMode ? '#1e1e1e' : '#fffffe',
	},
	methodContainerOpenStyle: {
		height: props => props.methodContainerHeight,
	},
	methodSearchDrawerOpenStyle: {
		backgroundColor: props =>
			theme.palette.explorer.background[
				props.prefersDarkMode ? 'dark' : 'light'
			],
		width: props => props.methodSearchDrawerWidth,
	},
	methodSearchDrawerCloseStyle: {
		backgroundColor: props =>
			theme.palette.navBar.background[
				props.prefersDarkMode ? 'dark' : 'light'
			],
		width: 0,
	},
	methodSearchDrawerResizeHandleStyle: {
		position: 'absolute',
		height: '100%',
		width: '5px',
		cursor: 'col-resize',
		right: '-5px',
		backgroundColor: 'transparent',
		'&:hover': {
			backgroundColor: props =>
				props.prefersDarkMode
					? 'rgba(255, 255, 255, 0.5)'
					: 'rgba(0,0,0,0.5)',
		},
	},
	methodContainerResizeHandleStyle: {
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
	methodSearchClosedTooltipContainerStyle: {
		padding: '0 5px',
		height: 'fit-content',
		width: 'fit-content',
		transform: 'translateY(50px)',
		boxShadow: '1px 0px 7px 1px rgb(0, 0, 0, 0.3)',
		backgroundColor: props =>
			theme.palette.explorer.background[
				props.prefersDarkMode ? 'dark' : 'light'
			],
		borderTop: props =>
			`1px solid ${
				theme.palette.navBar.background[
					props.prefersDarkMode ? 'light' : 'dark'
				]
			}`,
		borderRight: props =>
			`1px solid ${
				theme.palette.navBar.background[
					props.prefersDarkMode ? 'light' : 'dark'
				]
			}`,
		borderBottom: props =>
			`1px solid ${
				theme.palette.navBar.background[
					props.prefersDarkMode ? 'light' : 'dark'
				]
			}`,
	},
});

export default styles;
