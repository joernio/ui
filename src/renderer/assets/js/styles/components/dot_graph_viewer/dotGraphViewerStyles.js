const styles = theme => ({
	rawStringContainerStyle: {
		height: '90%',
		overflow: 'auto',
		marginLeft: '1em',
		paddingTop: '1em',
		color: props => (props.prefersDarkMode ? '#C3CCCC' : '#616161'),
	},
	synthFileViewerStyle: {
		width: '100%',
		height: '90%',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		'& svg': {
			height: '100% !important',
			width: '100% !important',
		},
		'& div': {
			height: '100%',
			width: '100%',
		},
		backgroundColor: props =>
			theme.palette.editor.background[
				props.prefersDarkMode ? 'dark' : 'light'
			],
		color: props =>
			theme.palette.editor.base[props.prefersDarkMode ? 'dark' : 'light'],
		'& > div': {
			stroke: props =>
				theme.palette.editor.background[
					props.prefersDarkMode ? 'light' : 'dark'
				],
			backgroundColor: props =>
				theme.palette.editor.background[
					props.prefersDarkMode ? 'dark' : 'light'
				],
			'& polygon': {
				fill: 'transparent',
			},
			'& .node ellipse': {
				stroke: props =>
					theme.palette.editor.background[
						props.prefersDarkMode ? 'light' : 'dark'
					],
			},
			'& .edge *': {
				stroke: props =>
					theme.palette.editor.background[
						props.prefersDarkMode ? 'light' : 'dark'
					],
			},
		},
		overflow: 'scroll',
	},

	zoomInStyle: {
		cursor: '-webkit-zoom-in',
	},

	zoomOutStyle: {
		cursor: '-webkit-zoom-out',
	},
});

export default styles;
