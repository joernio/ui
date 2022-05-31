export const getEditorFilesFromOpenFiles = openFiles => {
	if (openFiles) {
		return Object.fromEntries(Object.entries(openFiles).reverse());
	}
};

export const handleToggleFilesVisible = filesVisible => ({
	filesVisible: !filesVisible,
});
