import fs from 'fs';

import {
  openFile,
  getDirectories,
  getFolderStructureRootPath,
} from '../../assets/js/utils/scripts';

export const addToQueue = (query, props) => {
  props.enQueueQuery(query);
};

export const handleToggleScriptsVisible = scriptsVisible => {
  return { scriptsVisible: !scriptsVisible };
};

export const runScript = (path, props) => {
  if (path) {
    openFile(path);

    new Promise((resolve, reject) => {
      fs.readFile(path, 'utf8', (err, data) => {
        if (!err) {
          resolve(data);
        } else {
          reject(err);
        }
      });
    }).then(data => {
      const query = {
        query: data,
        origin: 'script',
        ignore: false,
      };

      addToQueue(query, props);
    });
  }
};

export const getJoernScripts = async props => {
  let { path } = getFolderStructureRootPath(props.workspace);

  if (path) {
    const scripts = await getDirectories(path).then(paths => {
      let scripts = {};
      const scriptsArr = paths.filter(path =>
        path.endsWith('.sc') ? true : false,
      );

      scriptsArr.forEach(value => {
        scripts[value] = true;
      });

      return scripts;
    });

    return scripts;
  }
};

export const getJoernScriptsFromRecent = props => {
  if (props.files.recent) {
    let scripts = {};

    let scriptsArr = Object.keys(props.files.recent).reverse();

    scriptsArr = scriptsArr.filter(path =>
      path.endsWith('.sc') ? true : false,
    );

    scriptsArr.forEach(value => {
      scripts[value] = true;
    });

    return scripts;
  }
};
