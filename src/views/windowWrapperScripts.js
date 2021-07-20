export const handleOpenFile = e => {
  if (e?.target?.files[0]?.path) {
    let path = e.target.files[0].path;
    return path;
  }
};

export const getOpenFileName = props => {
  if (props.files.recent) {
    let filename = Object.keys(props.files.recent);
    filename = filename ? filename.pop() : null;
    filename = filename ? filename.split('/') : null;
    filename = filename ? filename[filename.length - 1] : null;

    return filename;
  }
};
