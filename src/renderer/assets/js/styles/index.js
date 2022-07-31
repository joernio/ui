const styles = theme => ({
	titleStyles: {
		color: 'blue',
	},
	insetScrolledStyle: {
		boxShadow: props =>
			`inset 0px 30px 8px -30px ${
				props.prefersDarkMode
					? theme.palette.button.base.light
					: theme.palette.navBar.base.dark
			}`,
	},
	scrolledStyle: {
		boxShadow: props =>
			`0px 3px 8px 0px ${
				props.prefersDarkMode
					? theme.palette.button.base.light
					: theme.palette.navBar.base.dark
			}`,
	},
	scrollBarStyle: {
		'&::-webkit-scrollbar': {
			width: '12px',
		},

		'&::-webkit-scrollbar-corner': {
			backgroundColor: props =>
				theme.palette.editor.background[
					props.prefersDarkMode ? 'dark' : 'light'
				],
		},

		'&::-webkit-scrollbar-thumb': {
			backgroundColor: props =>
				theme.palette.scrollbar.background[
					props.prefersDarkMode ? 'dark' : 'light'
				],
		},

		'&:hover::-webkit-scrollbar-thumb': {
			backgroundColor: props =>
				theme.palette.scrollbar.base[
					props.prefersDarkMode ? 'dark' : 'light'
				],
		},

		'&::-webkit-scrollbar-thumb:hover': {
			backgroundColor: props =>
				theme.palette.scrollbar.hover[
					props.prefersDarkMode ? 'dark' : 'light'
				],
		},
	},
	scrollBarLightStyle: {
		'&::-webkit-scrollbar-track': {
			backgroundColor: props =>
				theme.palette.editor.background[
					props.prefersDarkMode ? 'dark' : 'light'
				],
		},
	},
	scrollBarDarkStyle: {
		'&::-webkit-scrollbar-track': {
			backgroundColor: props =>
				theme.palette.scrollbar.background[
					props.prefersDarkMode ? 'dark' : 'light'
				],
		},
	},
	scrollBarHorizontalStyle: {
		'&::-webkit-scrollbar': {
			width: 'unset',
			height: '4px',
		},
	},
	iconStyle: {
		color: props =>
			theme.palette.sideNav.base[
				props.prefersDarkMode ? 'dark' : 'light'
			],
		'&:hover': {
			color: props =>
				props.prefersDarkMode
					? theme.palette.sideNav.hover.dark
					: theme.palette.sideNav.background.light,
		},
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
	floatRight: { float: 'right' },
	floatLeft: { float: 'left' },
	marginTop1em: {
		marginTop: '1em',
	},
	marginBottom1em: {
		marginBottom: '1em',
	},
	marginLeft1em: {
		marginLeft: '1em',
	},
	marginRight1em: {
		marginRight: '1em',
	},
	textDecorationNone: {
		textDecoration: 'none',
	},
	colorRed: {
		color: 'red',
	},
	positionRelative: {
		position: 'relative',
	},
	positionAbsolute: {
		position: 'absolute',
	},
	displayNone: {
		display: 'none !important',
	},
	displayInlineBlock: {
		display: 'inline-block !important',
	},
	displayInlineFlex: {
		display: 'inline-flex !important',
	},
	displayFlex: {
		display: 'flex !important',
	},
	alignCenter: {
		alignItems: 'center',
	},
	addOnSmallScreen: {
		[theme.breakpoints.up('555')]: {
			display: 'none',
		},
	},
	removeOnSmallScreen: {
		[theme.breakpoints.down('555')]: {
			display: 'none',
		},
	},
	topMinus20PX: {
		top: '-20px',
	},
	left15PX: {
		left: '15px',
	},
	width100Percent: {
		width: '100%',
	},
	cursorPointer: {
		cursor: 'pointer',
	},
});

export default styles;
