/**
 * Function to display open files on the editor
 * @param {*} props
 * @returns
 */
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
