export const handleRootFolderCollapse = (e, { root_folder_collapsed }) => {
  e.preventDefault();
  root_folder_collapsed = !root_folder_collapsed;
  return { root_folder_collapsed };
};

export const contructFilePath = (folder_json_model, root) => {
  if (typeof folder_json_model[root] === 'string') {
    const path = `${folder_json_model[root]}/${root}`;
    return path;
  }
};
