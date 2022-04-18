const styles = () => ({
	windowStyle: {
		display: 'flex',
		width: '100%',
		backgroundColor: '#3C3C3C', // to be removed
		height: args => `${args.windowHeight}px`,
	},
	sideNavAndExplorerSectionStyle: {
		display: 'flex',
		position: 'relative',
		zIndex: 1,
	},
	editorAndTerminalSectionStyle: {
		flexGrow: 1,
		flexShrink: 1,
		position: 'relative',
	},
});

export default styles;
