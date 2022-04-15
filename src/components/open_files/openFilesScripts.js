/**
 * Function to display open files on the editor
 * @param {*} props
 * @returns
 */
export const getEditorFilesFromOpenFiles = props => {
  console.log('getEditorFilesFromOpenFiles: ', props);
  if (props.files.openFiles) {
    return Object.fromEntries(Object.entries(props.files.openFiles).reverse());
  }
};

/**
 * Function to handle toggle files visible
 * @param {*} filesVisible
 * @returns true if the files not visible otherwise false
 */
export const handleToggleFilesVisible = filesVisible => {
  console.log('handleToggleFilesVisible: ', filesVisible);
  return { filesVisible: !filesVisible };
};
