import fs from 'fs';
import { dirPathKey } from '../../assets/js/utils/defaultVariables';

import {
  getDirectories,
  getFolderStructureRootPath,
} from '../../assets/js/utils/scripts';

export const handleRootFolderCollapse = (e, { root_folder_collapsed }) => {
  e.preventDefault();
  root_folder_collapsed = !root_folder_collapsed;
  return { root_folder_collapsed };
};

const fsToJson = (arr, base, isFile) => {
  let nestedObj = base;
  let pathToDir = '';
  arr.forEach((name, index) => {
    if (!nestedObj[name]) {
      if (index === arr.length - 1 && isFile) {
        nestedObj[name] = pathToDir;
      } else {
        nestedObj[name] = { [dirPathKey]: pathToDir };
      }
    }
    pathToDir += `/${name}`;
    nestedObj = nestedObj[name];
  });
};

export const getRoot = (folder_json_model, root) => {
  root = root.split('/');
  root = root[root.length - 1];

  while (typeof folder_json_model === 'object') {
    const keys = Object.keys(folder_json_model);
    if (keys[keys.length - 1] === root) {
      return folder_json_model[keys[keys.length - 1]];
    } else {
      folder_json_model = folder_json_model[keys[keys.length - 1]];
    }
  }
};

export const createFolderJsonModel = async (props, handleSetState) => {
  let { path: root_path } = getFolderStructureRootPath(props.workspace);

  if (root_path) {
    const paths = await getDirectories(root_path).catch(err => {
      console.log('error getting directories: ', err);
    });

    let counter = 0;
    const folder_json_model = {};

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
        }).catch(err => {
          console.log('problem getting path stats: ', err);
        });

        counter += 1;

        const isFile = stats ? stats.isFile() : null;
        const arr = path.split('/').filter(value => (value ? true : false));
        fsToJson(arr, folder_json_model, isFile);

        if (counter === paths.length) {
          const root = getRoot(folder_json_model, root_path);
          handleSetState({ folder_json_model: root });
        }
      });
    }
  }
};

// getDirectories(root_path, (err, paths) => {
//   let counter = 0;
//   if (!err) {
//     const folder_json_model = {};
//     paths.forEach(path => {
//       fs.stat(path, (err, stats) => {
//         counter += 1;

//         if (!err) {
//           const isFile = stats.isFile();
//           const arr = path
//             .split('/')
//             .filter(value => (value ? true : false));
//           fsToJson(arr, folder_json_model, isFile);
//         }

//         if (counter === paths.length) {
//           const root = getRoot(folder_json_model, root_path);

//           handleSetState({ folder_json_model: root });
//         }
//       });
//     });
//   }
// });
// }
