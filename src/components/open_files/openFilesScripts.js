export const getEditorFilesFromOpenFiles = props => {
  if (props.files.openFiles) {
    let files = {};

    let filesArr = Object.keys(props.files.openFiles).reverse();

    filesArr.forEach(value => {
      files[value] = true;
    });

    return files;
  }
};

export const handleToggleFilesVisible = filesVisible => {
  return { filesVisible: !filesVisible };
};
