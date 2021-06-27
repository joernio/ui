export const handleOpenProjectContextMenu = e => {
  return { project_context_anchor_el: e.currentTarget };
};

export const handleCloseProjectContextMenu = () => {
  return { project_context_anchor_el: null };
};
