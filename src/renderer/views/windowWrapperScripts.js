/**
 * get open file path
 * @param {*} e
 * @returns
 */
export const handleOpenFile = e => {
  if (e?.target?.files[0]?.path) {
    let path = e.target.files[0].path;
    return path;
  }
};
