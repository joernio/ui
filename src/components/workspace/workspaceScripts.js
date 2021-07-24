import fs from 'fs';
import {handleSetToast} from '../../assets/js/utils/scripts';

import { selectDirApi } from '../../assets/js/utils/ipcRenderer';

export const handleOpenWorkSpaceContextMenu = e => {
  return { workspace_context_anchor_el: e.currentTarget };
};

export const handleCloseWorkSpaceContextMenu = () => {
  return { workspace_context_anchor_el: null };
};

export const contructQueryWithPath = async type => {

  selectDirApi.selectDir(type === 'importCode' ? 'select-dir' : 'select-file');

  let path = await new Promise((resolve, reject) => {
    selectDirApi.registerListener(type === 'importCode' ?
          'selected-dir' : 'selected-file', value => {
          if (value) {
            resolve(value);
          } else {
            reject();
          }
        });
  }).catch(() => {
    console.log("can't select project path");
  });

  let stats = await new Promise((resolve, reject) => {
    fs.stat(path, (err, stats) => {
      if (!err) {
        resolve(stats);
      } else {
        reject();
      }
    });
  });

  // const isJavaArtifact = path && (path.endsWith(".jar") || path.endsWith(".war") || path.endsWith(".ear"));

  // if (path && stats && stats.isFile() && !isJavaArtifact) {
  //   path = path.split('/');
  //   path = path.slice(0, path.length - 1).join('/');
  // }

  if (path && stats) {
    const query = {
      query: `${type}(inputPath="${path}")`,
      origin: 'workspace',
      ignore: false,
    };

    // if(!isJavaArtifact){
    //   handleSetToast({
    //       icon: 'info-sign',
    //       intent: 'primary',
    //       message: "the whole directory was imported. file imports are only valid for java artifacts",
    //     });
    // }

    return query;
  }
};

export const handleSwitchWorkspace = async () => {
  selectDirApi.selectDir(['openDirectory']);

  const path = await new Promise((resolve, reject) => {
    selectDirApi.registerListener(value => {
      if (value) {
        resolve(value);
      } else {
        reject();
      }
    });
  }).catch(() => {
    console.log("can't select workspace path");
  });

  if (path) {
    const query = {
      query: `switchWorkspace("${path}")`,
      origin: 'workspace',
      ignore: false,
    };

    return query;
  }
};

export const handleToggleProjectsVisible = projectsVisible => {
  return { projectsVisible: !projectsVisible };
};
