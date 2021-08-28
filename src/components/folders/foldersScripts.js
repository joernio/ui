import fs from 'fs';

import { getDirectories, handleSetToast } from '../../assets/js/utils/scripts';
import { foldersToIgnore } from '../../assets/js/utils/defaultVariables';
import { selectDirApi } from '../../assets/js/utils/ipcRenderer';
import { setFolders } from '../../store/actions/filesActions';
import { store } from '../../store/configureStore';
import chokidar from 'chokidar';

const vars = {
  chokidarWatcher: null,
  chokidarConfig: src => ({
    ignored: [src + '/**/node_modules/**', src + '/**/vendor/**'],
    awaitWriteFinish: {
      stabilityThreshold: 2000,
      pollInterval: 100,
    },
    ignorePermissionErrors: true,
  }),
};

export const handleToggleFoldersVisible = foldersVisible => {
  return { foldersVisible: !foldersVisible };
};

export const shouldSwitchFolder = (prev_workspace, workspace) => {
  if (
    Object.keys(workspace?.projects ? workspace?.projects : {}).length ===
    Object.keys(prev_workspace?.projects ? prev_workspace?.projects : {}).length
  ) {
    let notEqual = false;

    Object.keys(workspace?.projects ? workspace?.projects : {}).forEach(
      name => {
        if (
          workspace.projects[name]?.open !== prev_workspace.projects[name]?.open
        ) {
          notEqual = true;
        }
      },
    );

    Object.keys(
      prev_workspace?.projects ? prev_workspace?.projects : {},
    ).forEach(name => {
      if (
        workspace.projects[name]?.open !== prev_workspace.projects[name]?.open
      ) {
        notEqual = true;
      }
    });

    return notEqual;
  } else {
    return true;
  }
};

export const watchFolderPath = path => {
  if (vars.chokidarWatcher) {
    vars.chokidarWatcher.close().then(() => {
      if (path) {
        vars.chokidarWatcher = chokidar.watch(path, vars.chokidarConfig(path));

        vars.chokidarWatcher.on('all', () => {
          createFolderJsonModel({ path }, folders => {
            store.dispatch(setFolders(folders));
          });
        });
      }
    });
  } else {
    if (path) {
      vars.chokidarWatcher = chokidar.watch(path, vars.chokidarConfig(path));

      vars.chokidarWatcher.on('all', () => {
        createFolderJsonModel({ path }, folders => {
          store.dispatch(setFolders(folders));
        });
      });
    }
  }
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
    nestedArr = nestedArr
      ? nestedArr[index === undefined ? 0 : index]?.childNodes
      : [];
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

export const selectFolderStructureRootPath = async () => {
  selectDirApi.selectDir('select-dir');

  const path = await new Promise((resolve, reject) => {
    selectDirApi.registerListener('selected-dir', value => {
      if (value) {
        resolve(value);
      } else {
        reject();
      }
    });
  }).catch(() => {
    console.log("can't select workspace path");
  });

  return { path };
};

export const createFolderJsonModel = async (obj, callback) => {
  let { path: root_path } = obj;
  if (root_path) {
    const paths = await getDirectories(root_path).catch(err => {});

    let counter = 0;
    const folder_json_model = [];
    let failed;

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
          failed = true;
        });

        counter += 1;

        const isFile = stats ? stats.isFile() : null;
        const arr = path.split('/').filter(value => (value ? true : false));

        if (
          isFile ||
          !(
            foldersToIgnore.includes(arr[arr.length - 1]) &&
            arr[arr.length - 1].startsWith('.')
          )
        ) {
          fsToJson(arr, folder_json_model, isFile);
        }

        if (counter === paths.length) {
          const root = getRoot(folder_json_model, root_path);
          callback([root], root_path);
        }
      });

      if (failed) {
        handleSetToast({
          icon: 'warning-sign',
          intent: 'danger',
          message:
            'error opening folder. Make sure that this folder is healthy then try again.',
        });
      }
    }
  }
};
