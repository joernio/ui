export const getEditorFilesFromOpenFiles = props => {
	if (props.files.openFiles) {
		return Object.fromEntries(
			Object.entries(props.files.openFiles).reverse(),
		);
	}
};

export const handleToggleFilesVisible = filesVisible => ({
	filesVisible: !filesVisible,
});
