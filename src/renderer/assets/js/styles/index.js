const styles = theme => ({
	titleStyles: {
		color: 'blue',
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
		display: 'none',
	},
	displayInlineBlock: {
		display: 'inline-block',
	},
	displayInlineFlex: {
		display: 'inline-flex',
	},
	displayFlex: {
		display: 'flex',
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
});

export default styles;
