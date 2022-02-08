export const handleOpenWorkSpaceContextMenu = e => {
  return { workspace_context_anchor_el: e.currentTarget };
};

export const handleCloseWorkSpaceContextMenu = () => {
  return { workspace_context_anchor_el: null };
};

export const handleToggleProjectsVisible = projectsVisible => {
  return { projectsVisible: !projectsVisible };
};
