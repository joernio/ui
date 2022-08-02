export const handleOpenWorkSpaceContextMenu = e => ({
	workspace_context_anchor_el: e.currentTarget,
});

export const handleCloseWorkSpaceContextMenu = () => ({
	workspace_context_anchor_el: null,
});

export const handleToggleProjectsVisible = projectsVisible => ({
	projectsVisible: !projectsVisible,
});
