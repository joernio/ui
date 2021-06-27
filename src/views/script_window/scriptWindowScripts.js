import fs from 'fs';

import {
  openFile,
  getDirectories,
  getFolderStructureRootPath,
} from '../../assets/js/utils/scripts';

export const addToQueue = (query, props) => {
  props.enQueueQuery(query);
};

export const runScript = (path, props) => {
  if (path) {
    openFile(path, props);

    new Promise((resolve, reject) => {
      fs.readFile(path, 'utf8', (err, data) => {
        if (!err) {
          resolve(data);
        } else {
          reject(err);
        }
      });
    })
      .then(data => {
        const query = {
          query: data,
          origin: 'script',
          ignore: false,
        };

        addToQueue(query, props);
      })
      .catch(err => {
        console.log('error running script', err);
      });
  }
};

export const getJoernScripts = async (state, props) => {
  let { path } = getFolderStructureRootPath(props.workspace);


  if (path) {
    const scripts = await getDirectories(path)
      .then(paths => {
        let scripts = {};
        const scriptsArr = paths.filter(path =>
          path.endsWith('.sc') ? true : false,
        );

        scriptsArr.forEach(value => {
          scripts[value] = true;
        });

        return { ...state.scripts, ...scripts };
      })
      .catch(err => console.log('error getting directories', err));

    return scripts;

    // getDirectories(path, (err, paths) => {
    //   let scripts = {};
    //   const scriptsArr = paths.filter(path =>
    //     path.endsWith('.sc') ? true : false,
    //   );
    //   scriptsArr.forEach(value => {
    //     scripts[value] = true;
    //   });
    //   scripts = { ...state.scripts, ...scripts };

    //   handleSetState({ scripts });
    // });
  }
};

export const getJoernScriptsFromRecent = (state, props) => {
  if (props.files.recent) {
    let scripts = {};

    let scriptsArr = Object.keys(props.files.recent);

    scriptsArr.forEach(value => {
      scripts[value] = true;
    });

    scripts = { ...state.scripts, ...scripts };
    return scripts;
  }
};
