/**
 * Open workspace context menu
 * @param {*} e
 * @returns
 */
export const handleOpenWorkSpaceContextMenu = e => {
  console.log('handleOpenWorkSpaceContextMenu: ', e);
  return { workspace_context_anchor_el: e.currentTarget };
};

/**
 * close workspace context menu
 * @returns
 */
export const handleCloseWorkSpaceContextMenu = () => {
  console.log('handleCloseWorkSpaceContextMenu: =>');
  return { workspace_context_anchor_el: null };
};

/**
 * Function to toggle projects dropdown. This allows you to view all
 * the availble projects associated with an opened workspace
 * @param {*} projectsVisible
 * @returns true if the folder is not visible, otherwise false
 */
export const handleToggleProjectsVisible = projectsVisible => {
  console.log('handleToggleProjectsVisible: ', projectsVisible);
  return { projectsVisible: !projectsVisible };
};
