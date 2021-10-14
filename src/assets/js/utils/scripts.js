import { nanoid } from 'nanoid';
import glob from 'glob';
import fs from 'fs';
import Mousetrap from 'mousetrap';
import { Tree } from '@blueprintjs/core';
import {
  cpgManagementCommands as manCommands,
  apiErrorStrings,
} from './defaultVariables';
import {
  deQueueQuery,
  getQueryResult,
  postQuery,
  setResults,
  resetQueue,
  enQueueQuery,
  deQueueScriptsQuery,
} from '../../../store/actions/queryActions';
import { setToast } from '../../../store/actions/statusActions';
import { setFiles, setOpenFiles } from '../../../store/actions/filesActions';
import { windowActionApi, selectDirApi } from './ipcRenderer';
import { store } from '../../../store/configureStore';
import chokidar from 'chokidar';

import { mouseTrapGlobalBindig } from './extensions';

mouseTrapGlobalBindig(Mousetrap);

export const performEnQueueQuery = (query, queue) => {
  const key = `${Object.keys(queue).length}-${nanoid()}`;
  queue[key] = query;

  return queue;
};

export const performDeQueueQuery = queue => {
  const key = Object.keys(queue).shift();
  if (key) {
    const query = queue[key];
    delete queue[key];
    return { queue, query };
  } else {
    return { queue, query: null };
  }
};

export const performPeekQueue = queue => {
  const key = Object.keys(queue)[0];
  const query = queue[key];
  return query ? query : null;
};

export const sendWindowsMessage = action => {
  windowActionApi.sendWindowAction(action);
};

export const wsReconnectToServer = ws_url => {
  windowActionApi.connectToWebSocketAction(ws_url);
};

export const wsDisconnectFromServer = () => {
  windowActionApi.disconnectFromWebSocketAction();
};

export const forEachNode = (nodes, callback) => {
  if (nodes === undefined) {
    return;
  }

  for (const node of nodes) {
    callback(node);
    forEachNode(node.childNodes, callback);
  }
};

export const forNodeAtPath = (nodes, path, callback) => {
  callback(Tree.nodeFromPath(path, nodes));
};

export const performPushResult = (result, results) => {
  results = { ...results };
  const key = Object.keys(result)[0];
  const keys = Object.keys(results);

  if (keys.length >= 500) delete results[keys[0]];

  results[key] = result[key];
  return results;
};

export const getResultObjWithPostQueryKey = (results, post_query_key) => {
  for (let key in results) {
    if (key && results[key]['post_query_uuid'] === post_query_key) {
      return key;
    }
  }
};

export const parseProjects = data => {
  if (data.stdout.split('=')[1].trim().startsWith('empty')) {
    return {};
  } else {
    const parsed = data.stdout
      .split('\n')
      .filter(str => (str ? str : false))
      .slice(4)
      .map(str => str.split('|'));
    const projects = {};

    parsed.forEach(arr => {
      projects[arr[1].trim()] = {
        cpg: arr[2].trim(),
        inputPath: arr[3].trim(),
        pathToProject: null,
        open: null,
        language: null,
      };
    });

    console.log(
      'inside parsedProjects: projects is ',
      JSON.stringify(projects),
    );

    return projects;
  }
};

export const parseProject = data => {
  let inputPath, name, path, cpg, language;
  language = null;

  if (data.stdout) {
    console.log('data.stdout: ', data.stdout);
    try {
      [inputPath, name, path] = data.stdout.split('(')[2].split(',');
      inputPath = inputPath.split('"')[1];
      name = name.split('"')[1];
      path = path.split('=')[1].trim();
      cpg = data.stdout.split('(')[3].split('=')[1].split(')')[0].trim();
      console.log(
        'inputPath: ',
        inputPath,
        'name: ',
        name,
        'path: ',
        path,
        'cpg: ',
        cpg,
      );
    } catch {
      [inputPath, name, path] = data.stdout.split('(')[3].split(',');
      inputPath = inputPath.split('"')[1];
      name = name.split('"')[1];
      path = path.split('=')[1].trim();
      cpg = data.stdout.split('(')[3].split('=')[1].split(')')[0].trim();
      console.log(
        'inputPath: ',
        inputPath,
        'name: ',
        name,
        'path: ',
        path,
        'cpg: ',
        cpg,
      );
    }
  } else {
    inputPath = name = path = cpg = null;
  }

  return { name, inputPath, path, cpg, language };
};

const performPostQuery = (store, results, key) => {
  let post_query;
  let result = results[key];

  if (
    result.query.startsWith(manCommands.switchWorkspace) ||
    result.query === 'project'
  ) {
    post_query = 'workspace';
  } else {
    post_query = 'project';
  }

  store.dispatch(postQuery(post_query, key));
};

const setQueryResult = (data, store, key, results) => {
  if (results[key].t_0 && !results[key].t_1) {
    results[key].t_1 = performance.now();
  }

  if (!results[key].result.stdout && !results[key].result.stderr) {
    if (!data) {
      results[key]['result']['stderr'] = 'query failed';
    } else {
      if (data.stdout) {
        results[key]['result']['stdout'] = data.stdout;
      }

      if (data.stderr) {
        results[key]['result']['stderr'] = data.stderr;
      }
    }

    store.dispatch(setResults(results));
  } else if (
    results[key].query.startsWith(manCommands.switchWorkspace) ||
    results[key].query === 'project'
  ) {
    if (!data && !results[key].result.stdout && !results[key].result.stderr) {
      results[key]['result']['stderr'] = 'query failed';
    } else {
      if (data.stdout) {
        const projects = parseProjects(data);
        results[key]['workspace'] = { projects };
      }
    }

    store.dispatch(setResults(results));
  } else {
    if (!data && !results[key].result.stdout && !results[key].result.stderr) {
      results[key]['result']['stderr'] = 'query failed';
    } else {
      results[key]['project'] = parseProject(data);
    }

    store.dispatch(setResults(results));
  }
};

export const handleWebSocketResponse = data => {
  store.dispatch(getQueryResult(data.utf8Data)).then(data => {
    const { results } = store.getState().query;
    let key = data.uuid;
    let result_obj = results[key];

    if (!result_obj) {
      key = getResultObjWithPostQueryKey(results, data.uuid);
      result_obj = results[key];
    }

    if (result_obj) {
      if (!result_obj.result.stdout && !result_obj.result.stderr) {
        setQueryResult(data, store, key, results);
        if (result_obj.origin === 'script') {
          store.dispatch(deQueueScriptsQuery());
          store.dispatch(enQueueQuery(addWorkSpaceQueryToQueue()));
        } else {
          performPostQuery(store, results, key);
        }
      } else {
        setQueryResult(data, store, key, results);
        store.dispatch(deQueueQuery());
      }
    }
  });
};

export const handleScrollTop = e => {
  return e.target.scrollTop > 0 ? { scrolled: true } : { scrolled: false };
};

export const discardDialogHandler = (openFiles, openFilePath, callback) => {
  if (openFiles[openFilePath] === false) {
    return { openDiscardDialog: true, discardDialogCallback: callback };
  }

  callback();
};

export const getOpenFileName = path => {
  if (path) {
    path = path ? path.split('/') : null;
    path = path ? path[path.length - 1] : null;

    return path;
  }
};

export const openFile = async path => {
  if (path) {
    const files = { ...store.getState().files };
    files.recent = { ...files.recent };
    files.recent[path] = true;

    if (!Object.keys(files.openFiles).includes(path)) {
      const entries = Object.entries({ ...files.openFiles });
      const new_entries = [];

      if (entries.length === 0) {
        new_entries.push([path, true]);
      }

      entries.forEach((entry, index) => {
        if (entry[0] === files.openFilePath) {
          new_entries.push([...entry], [path, true]);
        } else {
          new_entries.push([...entry]);

          if (index === entries.length - 1) new_entries.push([path, true]);
        }
      });
      files.openFiles = Object.fromEntries(new_entries);
    }

    files.openFilePath = path;

    const { openFileContent, openFileIsReadOnly } = await readFile(path)
      .then(data => {
        const openFileIsReadOnly =
          path.slice(path.length - 3) === '.sc' ? false : true;

        return { openFileContent: data, openFileIsReadOnly };
      })
      .catch(() => {
        if (!path || path === path.split('/')[path.split('/').length - 1]) {
          return {
            openFileContent: '',
            openFileIsReadOnly:
              path && path.startsWith('untitled') ? false : true,
          };
        } else {
          handleSetToast({
            icon: 'warning-sign',
            intent: 'danger',
            message: 'error opening file',
          });
        }
      });

    files.openFileContent = openFileContent;
    files.openFileIsReadOnly = openFileIsReadOnly;
    store.dispatch(setFiles(files));
  }
};

export const closeFile = async path => {
  if (path) {
    const files = { ...store.getState().files };

    let openFiles = { ...files.openFiles };
    let openFilesKeys = Object.keys(openFiles);
    openFilesKeys.forEach((key, index) => {
      if (key === path) {
        const prevArr = openFilesKeys.slice(0, index);
        const nextArr = openFilesKeys.slice(index + 1);
        files.openFilePath = nextArr[0] || prevArr.pop() || '';
      }
    });

    const entries = Object.entries(openFiles);
    const new_entries = entries.filter(entry =>
      entry[0] !== path ? true : false,
    );
    files.openFiles = Object.fromEntries(new_entries);

    const { openFileContent, openFileIsReadOnly } = await readFile(
      files.openFilePath,
    )
      .then(data => {
        const openFileIsReadOnly =
          files.openFilePath.slice(files.openFilePath.length - 3) === '.sc'
            ? false
            : true;

        return { openFileContent: data, openFileIsReadOnly };
      })
      .catch(() => {
        if (
          files.openFilePath !== '' &&
          files.openFilePath !==
            files.openFilePath.split('/')[
              files.openFilePath.split('/').length - 1
            ]
        ) {
          handleSetToast({
            icon: 'warning-sign',
            intent: 'danger',
            message: 'error closing file',
          });
        }

        if (
          !files.openFilePath ||
          files.openFilePath ===
            files.openFilePath.split('/')[
              files.openFilePath.split('/').length - 1
            ]
        ) {
          return {
            openFileContent: '',
            openFileIsReadOnly:
              files.openFilePath && files.openFilePath.startsWith('untitled')
                ? false
                : true,
          };
        }
      });

    files.openFileContent = openFileContent;
    files.openFileIsReadOnly = openFileIsReadOnly;

    store.dispatch(setFiles(files));
  }
};

export const openEmptyFile = () => {
  const files = { ...store.getState().files };
  let last_untitled = Object.keys(files.openFiles).filter(file =>
    file.startsWith('untitled') ? true : false,
  );
  let index = 0;
  last_untitled.forEach(file => {
    let count = file.split('(')[1].split(')')[0];
    if (Number(count) > index) index = Number(count);
  });

  const file_name = `untitled (${index + 1})`;

  const entries = Object.entries({ ...files.openFiles });
  const new_entries = [];

  if (entries.length === 0) {
    new_entries.push([file_name, true]);
  }

  entries.forEach((entry, index) => {
    if (entry[0] === files.openFilePath) {
      new_entries.push([...entry], [file_name, true]);
    } else {
      new_entries.push([...entry]);

      if (index === entries.length - 1) new_entries.push([file_name, true]);
    }
  });
  files.openFiles = Object.fromEntries(new_entries);

  files.openFilePath = file_name;

  files.openFileContent = '';
  files.openFileIsReadOnly = false;

  store.dispatch(setFiles(files));
};

export const saveFile = async (path, base_dir) => {
  const file_content = store.getState().files.openFileContent;
  const files = { ...store.getState().files };

  const readOnly = path && path.slice(path.length - 3) === '.sc' ? false : true;

  if (!readOnly || path.startsWith('untitled')) {
    path &&
      (await new Promise((resolve, reject) => {
        fs.stat(path, (err, stats) => {
          if (
            !err &&
            stats.isFile() &&
            path !== path.split('/')[path.split('/').length - 1]
          ) {
            resolve(stats);
          } else {
            reject(err);
          }
        });
      })
        .then(() =>
          new Promise((res, rej) => {
            fs.writeFile(path, file_content, err => {
              if (!err) {
                res();
              } else {
                rej();
              }
            });
          })
            .then(() => {
              handleSetToast({
                icon: 'info-sign',
                intent: 'success',
                message: 'saved successfully',
              });

              const openFiles = { ...files.openFiles };
              openFiles[path] = true;
              store.dispatch(setOpenFiles(openFiles));
            })
            .catch(() => {
              handleSetToast({
                icon: 'warning-sign',
                intent: 'danger',
                message: 'error saving file',
              });

              const openFiles = { ...files.openFiles };
              openFiles[path] = true;
              store.dispatch(setOpenFiles(openFiles));
            }),
        )
        .catch(async () => {
          let new_path;

          if (base_dir) {
            new_path = `${base_dir}/${path}`;
          } else if (store.getState().workspace.path) {
            new_path = `${store.getState().workspace.path}/${path}`;
          } else {
            new_path = `/${path}`;
          }

          selectDirApi.createFile(new_path);

          const file = await new Promise((resolve, reject) => {
            selectDirApi.registerCreatedFileListener(file => {
              if (file) {
                resolve(file);
              } else {
                reject();
              }
            });
          }).catch(() => {
            handleSetToast({
              icon: 'warning-sign',
              intent: 'danger',
              message: "couldn't create file",
            });
          });

          if (file && !file.canceled) {
            const readOnly =
              file.filePath
                .toString()
                .slice(file.filePath.toString().length - 3) === '.sc'
                ? false
                : true;

            if (!readOnly) {
              await new Promise((res, rej) => {
                fs.writeFile(file.filePath.toString(), file_content, err => {
                  if (err) {
                    rej();
                  } else {
                    res();
                  }
                });
              })
                .then(() => {
                  handleSetToast({
                    icon: 'info-sign',
                    intent: 'success',
                    message: 'saved successfully',
                  });

                  files.recent[file.filePath.toString()] = true;
                  files.openFilePath = file.filePath.toString();

                  const entries = Object.entries({ ...files.openFiles });
                  const new_entries = [];
                  entries.forEach(entry => {
                    if (entry[0] === path) {
                      new_entries.push([files.openFilePath, true]);
                    } else {
                      new_entries.push([...entry]);
                    }
                  });

                  files.openFiles = Object.fromEntries(new_entries);

                  store.dispatch(setFiles(files));
                  store.dispatch(enQueueQuery(addWorkSpaceQueryToQueue()));
                })
                .catch(() => {
                  handleSetToast({
                    icon: 'warning-sign',
                    intent: 'danger',
                    message: "can't save to file",
                  });
                });
            } else {
              handleSetToast({
                icon: 'warning-sign',
                intent: 'danger',
                message: 'can only save .sc files',
              });
            }
          } else {
            console.log('file creation was cancelled');
          }
        }));
  } else {
    handleSetToast({
      icon: 'warning-sign',
      intent: 'danger',
      message: 'can only save .sc files',
    });
  }
};

export const deleteFile = async path => {
  if (path) {
    const readOnly =
      path && path.slice(path.length - 3) === '.sc' ? false : true;

    if (!readOnly) {
      (await path) &&
        new Promise((resolve, reject) => {
          fs.stat(path, (err, stats) => {
            if (!err && stats.isFile()) {
              resolve(stats);
            } else {
              reject(err);
            }
          });
        })
          .then(() =>
            new Promise((res, rej) => {
              fs.unlink(path, err => {
                if (!err) {
                  res();
                } else {
                  rej();
                }
              });
            })
              .then(async () => {
                handleSetToast({
                  icon: 'info-sign',
                  intent: 'success',
                  message: 'file deleted successfully',
                });
                await closeFile(path);
                await refreshRecent();
              })
              .catch(() => {
                handleSetToast({
                  icon: 'warning-sign',
                  intent: 'danger',
                  message: 'file cannot be deleted',
                });
              }),
          )
          .catch(() => {
            handleSetToast({
              icon: 'warning-sign',
              intent: 'danger',
              message: 'file not found',
            });
          });
    } else {
      handleSetToast({
        icon: 'warning-sign',
        intent: 'danger',
        message: 'can only delete .sc files',
      });
    }
  }
};

export const readFile = path => {
  return new Promise((resolve, reject) => {
    if (path) {
      fs.readFile(path, 'utf8', (err, data) => {
        if (!err) {
          resolve(data);
        } else {
          reject(err);
        }
      });
    } else {
      reject();
    }
  });
};

export const refreshRecent = async () => {
  const files = { ...store.getState().files };
  if (
    typeof files.recent === 'object' &&
    Object.keys(files.recent).length > 0
  ) {
    const recent = { ...files.recent };
    let recent_entries = Object.entries(recent);

    recent_entries = recent_entries.map(entry => {
      return new Promise(r => {
        fs.stat(entry[0], err => {
          if (!err) {
            return r(entry);
          } else {
            return r(false);
          }
        });
      });
    });

    recent_entries = await Promise.all(recent_entries);

    recent_entries = recent_entries.filter(entry =>
      entry !== false ? true : false,
    );

    files.recent = Object.fromEntries(recent_entries);
    store.dispatch(setFiles(files));
  }
};

export const refreshOpenFiles = async () => {
  const files = { ...store.getState().files };
  if (
    typeof files.openFiles === 'object' &&
    Object.keys(files.openFiles).length > 0
  ) {
    const openFiles = { ...files.openFiles };
    let open_files_entries = Object.entries(openFiles);

    open_files_entries = open_files_entries.map(entry => {
      return new Promise(r => {
        fs.stat(entry[0], (err, stats) => {
          if (!err && stats.isFile()) {
            return r(entry);
          } else {
            return r(false);
          }
        });
      }).then(value => value);
    });

    open_files_entries = await Promise.all(open_files_entries);
    open_files_entries = open_files_entries.filter(entry =>
      entry !== false ? true : false,
    );
    files.openFiles = Object.fromEntries(open_files_entries);
    store.dispatch(setFiles(files));

    if (
      !files.openFilePath ||
      files.openFilePath ===
        files.openFilePath.split('/')[files.openFilePath.split('/').length - 1]
    ) {
      openFile(Object.keys(files.openFiles ? files.openFiles : {})[0]);
    }
  }
};

export const isFilePathInQueryResult = results => {
  const latest = results[Object.keys(results)[Object.keys(results).length - 1]];

  if (
    latest?.result.stdout &&
    typeof latest.result.stdout === 'string' &&
    latest.result.stdout.includes('filename')
  ) {
    let file_path;

    try {
      file_path = latest.result.stdout.split('filename -> "')[1];
      file_path = file_path.split('"')[0];
      return file_path;
    } catch (e) {
      try {
        file_path = latest.result.stdout.split('filename = "')[1];
        file_path = file_path.split('"')[0];
        return file_path;
      } catch (e) {
        return false;
      }
    }
  } else {
    return false;
  }
};

export const getUIIgnoreArr = (src, uiIgnore) => {
  if (uiIgnore && typeof uiIgnore === 'string') {
    return uiIgnore
      .split(',')
      .filter(str => (str && str !== ' ' ? true : false))
      .map(str => `${src}/**/${str.trim()}/**`);
  } else {
    return [];
  }
};

export const getDirectories = src => {
  return new Promise((resolve, reject) => {
    glob(
      src + '/**/*',
      {
        ignore: [...getUIIgnoreArr(src, store.getState()?.settings?.uiIgnore)],
      },
      (err, path) => {
        if (!err) {
          resolve(path);
        } else {
          reject(err);
        }
      },
    );
  });
};

export const watchFolderPath = (path, vars, callback) => {
  const ignore = store.getState()?.settings?.uiIgnore;
  if (vars.chokidarWatcher) {
    vars.chokidarWatcher.close().then(() => {
      if (path) {
        vars.chokidarWatcher = chokidar.watch(
          path,
          vars.chokidarConfig(path, ignore),
        );

        vars.chokidarWatcher.on('ready', () => {
          vars.chokidarWatcher.on('all', callback);
        });
      }
    });
  } else {
    if (path) {
      vars.chokidarWatcher = chokidar.watch(
        path,
        vars.chokidarConfig(path, ignore),
      );

      vars.chokidarWatcher.on('ready', () => {
        vars.chokidarWatcher.on('all', callback);
      });
    }
  }
};

export const getFolderStructureRootPathFromWorkspace = workspace => {
  const { projects } = workspace;
  let path = null;

  projects &&
    Object.keys(projects).forEach(name => {
      if (projects[name].open) {
        path = projects[name].inputPath;
      }
    });

  // path = path
  //   ? path
  //       .split('/')
  //       .slice(0, path.split('/').length - 1)
  //       .join('/')
  //   : null;

  let root = path ? path.split('/') : null;
  root = root ? root[root.length - 1] : null;

  return { path, root };
};

export const handleOpenContextMenu = (e, projectRef) => {
  e.preventDefault();
  let shouldOpenContext = false;

  if (projectRef?.current && projectRef.current === e.target) {
    shouldOpenContext = true;
  } else if (projectRef?.current) {
    for (let node of projectRef.current.children) {
      if (node === e.target) {
        shouldOpenContext = true;
        break;
      }
    }
  }

  if (shouldOpenContext) {
    return {
      context: {
        mouseX: e.clientX - 2,
        mouseY: e.clientY - 4,
      },
    };
  }

  return {
    context: {
      mouseX: null,
      mouseY: null,
    },
  };
};

export const handleCloseContextMenu = e => {
  return {
    context: {
      mouseX: null,
      mouseY: null,
    },
  };
};

export const debounce = (callback, args, delay) => {
  let timeout;
  return () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => callback(...args), delay);
  };
};

export const throttle = (callback, limit) => {
  let inThrottle;
  return function (args) {
    const context = this;
    if (!inThrottle) {
      callback.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

export const initResize = (resizeHandle, type, resizeHandler) => {
  let startX_Y, currentWidth_Height;
  resizeHandle.addEventListener('mousedown', initDrag, false);

  function initDrag(e) {
    startX_Y = type === 'col' ? e.clientX : e.clientY;
    currentWidth_Height =
      type === 'col'
        ? resizeHandle.parentElement.offsetWidth
        : resizeHandle.parentElement.offsetHeight;

    e.target.ownerDocument.addEventListener('mousemove', resize, false);
    e.target.ownerDocument.addEventListener('mouseup', stopResize, false);
  }

  function resize(e) {
    throttle(doResize, 25)([e]);
  }

  function doResize(e) {
    const diff = type === 'col' ? e.clientX - startX_Y : startX_Y - e.clientY;
    resizeHandler(currentWidth_Height + diff + 'px', diff);
  }

  function stopResize(e) {
    e.target.ownerDocument.removeEventListener('mousemove', resize, false);
    e.target.ownerDocument.removeEventListener('mouseup', stopResize, false);
  }

  return initDrag;
};

export const areResultsEqual = (prev_results, results) => {
  if (results) {
    let prev_latest_uuid = Object.keys(prev_results ? prev_results : {});
    prev_latest_uuid = prev_latest_uuid[prev_latest_uuid.length - 1];

    let latest_uuid = Object.keys(results);
    latest_uuid = latest_uuid[latest_uuid.length - 1];

    return prev_latest_uuid === latest_uuid && latest_uuid !== undefined
      ? true
      : false;
  } else {
    return true; //this is a trick to force the code not to perform the action that depends on this function.
  }
};

export const openProjectExists = workspace => {
  let is_open_project =
    workspace?.projects &&
    Object.keys(workspace.projects).filter(name =>
      workspace.projects[name].open ? true : false,
    );
  return is_open_project && is_open_project.length;
};

export const latestIsManCommand = results => {
  let isManCommand = false;

  if (!results) return false;

  let latest = Object.keys(results);
  latest = results[latest[latest.length - 1]];

  if (!latest?.query) return false;

  if (latest.query === 'workspace' || latest.query === 'project') return true;

  Object.keys(manCommands).forEach(command => {
    if (latest.query.startsWith(command)) {
      isManCommand = true;
    }
  });

  return isManCommand;
};

export const queueEmpty = queue => {
  if (queue && Object.keys(queue).length === 0) {
    return true;
  } else if (!queue) {
    return true;
  } else {
    return false;
  }
};

export const addToQueue = (query, props) => {
  if (query) {
    props.enQueueQuery(query);
  }
};

export const addWorkSpaceQueryToQueue = () => {
  const query = {
    query: 'workspace',
    origin: 'workspace',
    ignore: true,
  };

  return query;
};

export const contructQueryWithPath = async type => {
  selectDirApi.selectDir(type === 'importCode' ? 'select-dir' : 'select-file');

  let path = await new Promise((resolve, reject) => {
    selectDirApi.registerListener(
      type === 'importCode' ? 'selected-dir' : 'selected-file',
      value => {
        if (value) {
          resolve(value);
        } else {
          reject();
        }
      },
    );
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

  if (path) {
    const query = {
      query: `switchWorkspace("${path}")`,
      origin: 'workspace',
      ignore: false,
    };

    return query;
  }
};

export const handleAPIQueryError = err => {
  if (err === apiErrorStrings.ws_not_connected) {
    const ws_url = store.getState().settings.websocket.url;
    handleSetToast({
      action: {
        onClick: () => {
          wsReconnectToServer(ws_url);
          wsReconnectToServer(ws_url); //hack: somehow calling wsReconnectToServer once doesn't connect to the websocket
        },
        text: 'Connect Now',
      },
      icon: 'warning-sign',
      intent: 'danger',
      message: 'Not connected to websocket',
    });
  } else if (err.message.includes('401')) {
    handleSetToast({
      icon: 'warning-sign',
      intent: 'danger',
      message: 'authentication error. Your server requires authentication',
    });
  } else if (err.message === apiErrorStrings.no_result_for_uuid) {
    handleSetToast({
      icon: 'warning-sign',
      intent: 'danger',
      message: `${err.message}. Ensure that no other program is subscribed to the websocket`,
    });
  }

  store.dispatch(resetQueue({}));
};

export const initShortcuts = () => {
  Mousetrap.bindGlobal(['command+s', 'ctrl+s'], function () {
    saveFile(
      store.getState().files.openFilePath,
      store.getState().settings.scriptsDir,
    );
  });
};

export const removeShortcuts = () => {
  Mousetrap.unbind(['command+s', 'ctrl+s']);
};

export const handleSetToast = toast => {
  store.dispatch(setToast(toast));
};

export const nFormatter = num => {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'G';
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return num;
};

export const handleFontSizeChange = (doc, fontSize) => {
  doc.children[0].style.fontSize = fontSize;
  doc.children[0].children[1].style.fontSize = fontSize;
};

export const generateScriptImportQuery = async (
  path_to_script,
  path_to_workspace,
) => {
  if (!path_to_script || !path_to_script.endsWith('.sc')) {
    handleSetToast({
      icon: 'warning-sign',
      intent: 'danger',
      message: 'script path is not valid',
    });

    return;
  }

  if (!path_to_workspace || !path_to_workspace.endsWith('workspace')) {
    handleSetToast({
      icon: 'warning-sign',
      intent: 'danger',
      message: 'workspace path is invalid',
    });

    return;
  }

  let error = await new Promise((res, rej) => {
    fs.stat(path_to_script, err => {
      if (!err) {
        res();
      } else {
        rej();
      }
    });
  }).catch(() => {
    handleSetToast({
      icon: 'warning-sign',
      intent: 'danger',
      message: 'script path does not exist',
    });

    return true;
  });

  error = await new Promise((res, rej) => {
    fs.stat(path_to_workspace, err => {
      if (!err) {
        res();
      } else {
        rej();
      }
    });
  }).catch(() => {
    handleSetToast({
      icon: 'warning-sign',
      intent: 'danger',
      message: 'workspace path does not exist',
    });

    return true;
  });

  if (error) return;

  let modified_path_to_script = path_to_script;
  path_to_workspace = path_to_workspace.split('/workspace').join('');
  path_to_workspace.split('/').forEach(folder => {
    if (modified_path_to_script.split('/' + folder + '/').length > 1) {
      modified_path_to_script = modified_path_to_script.split(folder);
      modified_path_to_script.splice(0, 1);
      modified_path_to_script = modified_path_to_script.join(folder);
    } else {
      modified_path_to_script = '.^' + modified_path_to_script;
    }
  });

  modified_path_to_script = modified_path_to_script.slice(
    0,
    modified_path_to_script.length - 3,
  );

  modified_path_to_script = modified_path_to_script
    .split('/')
    .filter(value => (value ? true : false))
    .map(value => (value.startsWith('.^') ? value : '.`' + value + '`'))
    .join('');

  if (
    modified_path_to_script.split('.').length ===
    path_to_workspace.split('/').length + path_to_script.split('/').length
  ) {
    //if workspace and script are not in the same drive
    handleSetToast({
      icon: 'warning-sign',
      intent: 'danger',
      message: 'an error occured while trying to run script',
    });
  } else {
    return 'import $file' + modified_path_to_script;
  }
};
