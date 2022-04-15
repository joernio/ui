import {
  getDirectories,
  readFile,
  openFile,
  deleteFile,
  generateScriptImportQuery,
  handleSetToast,
  getUIIgnoreArr,
} from '../../assets/js/utils/scripts';
import { selectDirApi } from '../../assets/js/utils/ipcRenderer';

export const chokidarVars = {
  chokidarWatcher: null,
  chokidarConfig: (src, ignore) => ({
    ignored: [...getUIIgnoreArr(src, ignore)],
    awaitWriteFinish: {
      stabilityThreshold: 2000,
      pollInterval: 100,
    },
    ignorePermissionErrors: true,
  }),
};

/**
 * Function to toggle script dropdown. This allows you to view all
 * the availble scripts associated with an opened workspace
 * @param {*} scriptsVisible
 * @returns true if the script is not visible, otherwise false
 */
export const handleToggleScriptsVisible = scriptsVisible => {
  console.log('handleToggleScriptsVisible: ', scriptsVisible);
  return { scriptsVisible: !scriptsVisible };
};

/**
 * Funciton to toggle scripts dialog
 * @param {*} bool
 * @returns
 */
export const toggleScriptsArgsDialog = bool => {
  console.log('toggleScriptsArgsDialog: ', bool);
  return { openDialog: !bool };
};

/**
 * Function to add to script
 * @param {*} query
 * @param {*} props
 */
export const addToScriptsQueue = (query, props) => {
  console.log('addToScriptsQueue: ', query);
  props.enQueueScriptsQuery(query);
};

/**
 * Function to get cpg script
 * @param {*} props
 * @returns
 */
export const getCpgScripts = async props => {
  console.log('getCpgScripts: ', props);
  let path = props.settings.scriptsDir;

  if (path) {
    let scripts = {};
    let organised_scripts = {};

    let scriptsArr = await getDirectories(path).then(paths => {
      return paths.filter(path => (path.endsWith('.sc') ? true : false));
    });

    await Promise.all(
      scriptsArr.map(path => {
        return readFile(path).then(data => {
          let tag, mainFunctionName, mainFunctionArgs;

          if (data.search(/\/\/<tag>(.*?)<\/tag>/g) > -1) {
            tag = extractScriptTagName(data);
          }

          if (data.search(/^(?:\s*)@main|(?:\n\s*)@main/) > -1) {
            [mainFunctionName, mainFunctionArgs] =
              extractScriptMainFunctionNameAndArgs(data);
            scripts[path] = { tag, mainFunctionName, mainFunctionArgs };
          }
        });
      }),
    );

    Object.keys(scripts).forEach(path => {
      if (scripts[path].tag && scripts[path].tag !== ' ') {
        let tag = scripts[path].tag;
        let mainFunctionName = scripts[path].mainFunctionName;
        let mainFunctionArgs = scripts[path].mainFunctionArgs;
        organised_scripts[tag] =
          organised_scripts[tag] === Object(organised_scripts[tag])
            ? {
                ...organised_scripts[tag],
                [path]: { mainFunctionName, mainFunctionArgs },
              }
            : { tag: true, [path]: { mainFunctionName, mainFunctionArgs } };
      }
    });

    Object.keys(scripts).forEach(path => {
      if (!scripts[path].tag || scripts[path].tag === ' ') {
        let mainFunctionName = scripts[path].mainFunctionName;
        let mainFunctionArgs = scripts[path].mainFunctionArgs;
        organised_scripts[path] = { mainFunctionName, mainFunctionArgs };
      }
    });

    return organised_scripts;
  }
};

/**
 * Function to extract script tag name
 * @param {*} data
 * @returns
 */
export const extractScriptTagName = data => {
  console.log('extractScriptTagName: ', data);
  return data.split('<tag>')[1].split('</tag>')[0];
};

/**
 * Function to extract script main function name and args
 * @param {*} data
 * @returns
 */
export const extractScriptMainFunctionNameAndArgs = data => {
  console.log('extractScriptMainFunctionNameAndArgs: ', data);
  let mainFunctionArgs;
  let mainFunctionName = data.split('@main')[1].split('def')[1];
  mainFunctionName = mainFunctionName.trim();
  [mainFunctionName, mainFunctionArgs] = mainFunctionName.split('(');
  mainFunctionArgs = mainFunctionArgs.split(')')[0];
  mainFunctionArgs = mainFunctionArgs
    .split(',')
    .filter(arg => (arg && arg !== ' ' ? true : false))
    .map(arg => arg.split(':')[0].trim());

  return [mainFunctionName, mainFunctionArgs];
};

/**
 * Function to collect args values
 * @param {*} dialogEl
 * @param {*} dialogFields
 * @returns
 */
export const collectArgsValues = (dialogEl, dialogFields) => {
  console.log('collectArgsValues: ', dialogEl);
  dialogFields = dialogFields.map(script => ({
    path: script.path,
    filename: script.filename,
    mainFunctionName: script.mainFunctionName,
    mainFunctionArgs: script.mainFunctionArgs.map(arg => {
      const value = dialogEl.current.querySelector(
        `#${script.filename.replaceAll('.', '-')}-${
          script.mainFunctionName
        }-${arg}`,
      ).value;
      return value;
    }),
  }));
  return dialogFields;
};

/**
 * Function for running script
 * @param {*} path
 * @param {*} args
 * @param {*} mainFunctionName
 * @param {*} props
 */
export const runScript = async (path, args, mainFunctionName, props) => {
  console.log('runScript: ', { path, args, mainFunctionName, props });

  let workspace_path = props.workspace.path;
  if (path && workspace_path) {
    openFile(path);

    let query_string = await generateScriptImportQuery(path, workspace_path);

    if (query_string) {
      let filename = query_string.split('.');
      filename = filename[filename.length - 1];

      const importScriptQuery = {
        query: query_string,
        origin: 'script',
        ignore: true,
      };

      const runScriptQuery = {
        query: `${filename}.${mainFunctionName}(${formatArgs(args)})`,
        origin: 'script',
        ignore: true,
      };

      addToScriptsQueue(importScriptQuery, props);
      addToScriptsQueue(runScriptQuery, props);
      handleSetToast({
        icon: 'info-sign',
        intent: 'success',
        message: 'script running ...',
      });
    } else {
      handleSetToast({
        icon: 'warning-sign',
        intent: 'danger',
        message: 'an error occured while running script',
      });
    }
  } else {
    handleSetToast({
      icon: 'warning-sign',
      intent: 'danger',
      message: 'an error occured while running script',
    });
  }
};

/**
 * Function to handle cpg tag click
 * @param {*} e
 * @param {*} value
 * @param {*} scripts
 * @param {*} selected
 * @returns
 */
export const handleCPGScriptTagClick = (e, value, scripts, selected) => {
  console.log('handleCPGScriptTagClick: ', { e, value, scripts, selected });

  const tag_scripts_paths = Object.keys(scripts[value]);
  if (Array.isArray(tag_scripts_paths) && tag_scripts_paths.length > 1) {
    openFile(tag_scripts_paths[1]);

    if (!e.ctrlKey) {
      selected = {};
    }

    tag_scripts_paths.forEach(path => {
      if (scripts[value][path] !== true) {
        selected[path] = true;
      }
    });

    return { selected };
  }
};

/**
 * Run
 * @param {*} selected
 * @param {*} scripts
 * @param {*} props
 * @returns
 */
export const handleRun = (selected, scripts, props) => {
  console.log('handleRun: ', { selected, scripts, props });

  if (mainScriptsFunctionsTakeArgs(Object.keys(selected), scripts)) {
    return {
      dialogFields: populateArgsDialogFields(Object.keys(selected), scripts),
      openDialog: true,
      selected,
    };
  } else {
    runSelected([], selected, scripts, props);
    return { selected };
  }
};

/**
 * Function to format args
 * @param {*} args
 * @returns
 */
export const formatArgs = args => {
  console.log('formatArgs: ', args);
  if (args.length < 1) {
    return args.join(',');
  } else {
    args = args.map(arg => (isNaN(Number(arg)) ? '"' + arg + '"' : arg));
    return args.join(',');
  }
};

/**
 * Function to run selected
 * @param {*} dialogFields
 * @param {*} selected
 * @param {*} organised_scripts
 * @param {*} props
 */
export const runSelected = async (
  dialogFields,
  selected,
  organised_scripts,
  props,
) => {
  console.log('runSelected: ', {
    dialogFields,
    selected,
    organised_scripts,
    props,
  });
  const paths = Object.keys(selected);
  const scripts = organisedScriptsToScripts(organised_scripts);

  for (let i = 0; i < paths.length; i++) {
    const args = dialogFields.filter(script =>
      script.path === paths[i] ? true : false,
    )[0]?.mainFunctionArgs;
    const { mainFunctionName } = scripts[paths[i]];
    await runScript(paths[i], args ? args : [], mainFunctionName, props);
  }
};

/**
 * Function to deleteAll
 * @param {*} scripts
 */
export const deleteAll = scripts => {
  console.log('deleteAll: ', scripts);
  const selected = organisedScriptsToScripts(scripts);
  deleteSelected(selected);
};

/**
 * Function to deleteSelected
 * @param {*} selected
 */
export const deleteSelected = async selected => {
  console.log('deleteSelected: ', selected);
  const paths = Object.keys(selected);

  for (let i = 0; i < paths.length; i++) {
    await deleteFile(paths[i]);
    await new Promise(r => setTimeout(r, 50));
  }
};

/**
 * Function to switch between different scripts folders
 * @param {Object} props
 */
export const switchDefaultScriptsFolder = async props => {
  console.log('switchDefaultScriptsFolder: ', props);
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
    console.log("can't select scripts path");
  });

  if (path) {
    const values = JSON.parse(JSON.stringify(props.settings));
    values['scriptsDir'] = path;
    props.setSettings(values);
  }
};

export const mainScriptsFunctionsTakeArgs = (pathsArr, organised_scripts) => {
  console.log('mainScriptsFunctionsTakeArgs: ', {
    pathsArr,
    organised_scripts,
  });
  let scripts = {};
  let takesArgs = false;

  scripts = organisedScriptsToScripts(organised_scripts);

  pathsArr.forEach(path => {
    if (scripts[path].mainFunctionArgs.length > 0) {
      takesArgs = true;
    }
  });

  return takesArgs;
};

export const populateArgsDialogFields = (pathsArr, organised_scripts) => {
  console.log('populateArgsDialogFields: ', {
    pathsArr,
    organised_scripts,
  });
  let scripts = {};
  let fieldsArr = [];

  scripts = organisedScriptsToScripts(organised_scripts);

  pathsArr.forEach(path => {
    if (scripts[path]) {
      let filename = path.split('/');
      filename = filename[filename.length - 1];

      fieldsArr.push({
        path,
        filename,
        mainFunctionName: scripts[path].mainFunctionName,
        mainFunctionArgs: [...scripts[path].mainFunctionArgs],
      });
    }
  });

  return fieldsArr;
};

export const organisedScriptsToScripts = organised_scripts => {
  console.log('athsArr, organised_scripts: ', organised_scripts);

  let scripts = {};

  Object.keys(organised_scripts).forEach(key => {
    if (organised_scripts[key].tag !== true) {
      scripts[key] = organised_scripts[key];
    } else if (organised_scripts[key].tag === true) {
      Object.keys(organised_scripts[key]).forEach(path => {
        if (organised_scripts[key][path] !== true) {
          scripts[path] = organised_scripts[key][path];
        }
      });
    }
  });

  return scripts;
};

// export const readFirstLine = path => {
//   return new Promise((resolve, reject) => {
//     let rs = fs.createReadStream(path, { encoding: 'utf8' });
//     let acc = '';
//     let pos = 0;
//     let index;
//     rs.on('data', chunk => {
//       index = chunk.indexOf('\n');
//       acc += chunk;
//       index !== -1 ? rs.close() : (pos += chunk.length);
//     })
//       .on('close', () => {
//         resolve(acc.slice(0, pos + index));
//       })
//       .on('error', err => {
//         reject(err);
//       });
//   });
// };
