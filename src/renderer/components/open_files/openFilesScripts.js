/**
 * Function to get open files on the editor
 * @param {*} props
 * @returns all the editor open files
 */
export const getEditorFilesFromOpenFiles = props => {
	if (props.files.openFiles) {
		return Object.fromEntries(
			Object.entries(props.files.openFiles).reverse(),
		);
	}
};

/**
 * Checks if files will be visible
 * @param {boolean} filesVisible 
 * @returns true if folder is visible, otherwise false
 */
export const handleToggleFilesVisible = filesVisible => ({
	filesVisible: !filesVisible,
});
