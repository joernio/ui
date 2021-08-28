export const handleOpenFile = e => {
  if (e?.target?.files[0]?.path) {
    let path = e.target.files[0].path;
    return path;
  }
};

export const getOpenFileName = props => {
  if (props?.files?.openFilePath) {
    let filename = props.files.openFilePath;
    filename = filename ? filename.split('/') : null;
    filename = filename ? filename[filename.length - 1] : null;

    return filename;
  }
};
