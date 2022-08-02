const styles = theme => ({
	imageViewerStyle: {
		width: '100%',
		height: '90%',
		display: 'flex',
		backgroundColor: props =>
			theme.palette.editor.background[
				props.prefersDarkMode ? 'dark' : 'light'
			],
		color: props =>
			theme.palette.editor.base[props.prefersDarkMode ? 'dark' : 'light'],
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
