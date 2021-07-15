export const getEditorFilesFromRecent = props => {
  if (props.files.recent) {
    let files = {};

    let filesArr = Object.keys(props.files.recent).reverse();

    filesArr.forEach(value => {
      files[value] = true;
    });

    return files;
  }
};

export const handleToggleFilesVisible = filesVisible => {
  return { filesVisible: !filesVisible };
};
