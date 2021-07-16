import fs from 'fs';

import {
  getDirectories,
  getFolderStructureRootPath,
} from '../../assets/js/utils/scripts';

export const handleToggleFoldersVisible = foldersVisible => {
  return { foldersVisible: !foldersVisible };
};

const fsToJson = (arr, base, isFile) => {
  let nestedArr = base;
  let pathToDir = '';

  arr.forEach((asset, i) => {
    let index;

    nestedArr &&
      nestedArr.forEach((obj, i) => {
        if (obj.label === asset) {
          index = i;
        }
      });

    if (index === undefined && nestedArr) {
      if (i === arr.length - 1 && isFile) {
        nestedArr.push({
          className: 'folder',
          id: `${pathToDir}/${asset}`,
          icon: 'document',
          label: asset,
        });
      } else {
        nestedArr.push({
          className: 'folder',
          id: `${pathToDir}/${asset}`,
          hasCaret: true,
          isExpanded: true,
          icon: 'folder-open',
          label: asset,
          childNodes: [],
        });
      }
    }

    pathToDir += `/${asset}`;
    nestedArr = nestedArr ? nestedArr[index === undefined ? 0 : index]?.childNodes : [];
  });
};

export const getRoot = (folder_json_model, root) => {
  root = root.split('/');
  root = root[root.length - 1];

  while (Array.isArray(folder_json_model)) {
    const lastNode = folder_json_model[folder_json_model.length - 1];

    if (lastNode?.label === root) {
      return lastNode;
    } else {
      folder_json_model = lastNode?.childNodes;
    }
  }
};

export const createFolderJsonModel = async (workspace, callback) => {
  let { path: root_path } = getFolderStructureRootPath(workspace);

  if (root_path) {
    const paths = await getDirectories(root_path).catch(err => {});

    let counter = 0;
    const folder_json_model = [];

    if (Array.isArray(paths)) {
      paths.forEach(async path => {
        const stats = await new Promise((resolve, reject) => {
          fs.stat(path, (err, stats) => {
            if (!err) {
              resolve(stats);
            } else {
              reject(err);
            }
          });
        });

        counter += 1;

        const isFile = stats ? stats.isFile() : null;
        const arr = path.split('/').filter(value => (value ? true : false));
        fsToJson(arr, folder_json_model, isFile);

        if (counter === paths.length) {
          const root = getRoot(folder_json_model, root_path);
          callback([root]);
        }
      });
    }
  }
};
