import { nanoid } from 'nanoid';
import glob from 'glob';
import fs from 'fs';
import Mousetrap from 'mousetrap';
import { Tree } from '@blueprintjs/core';
import {
  joernManagementCommands as manCommands,
  apiErrorStrings,
} from './defaultVariables';
import {
  deQueueQuery,
  getQueryResult,
  postQuery,
  setResults,
  resetQueue,
  enQueueQuery,
} from '../../../store/actions/queryActions';
import { setToast } from '../../../store/actions/statusActions';
import { setRecent } from '../../../store/actions/filesActions';
import { windowActionApi, selectDirApi } from './ipcRenderer';
import { store } from '../../../store/configureStore';
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
  const key = Object.keys(result)[0];
  results[key] = result[key];
  return results;
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
        inputPath: arr[3].trim(),
        pathToProject: null,
        open: null,
      };
    });

    return projects;
  }
};

export const parseProject = data => {
  let inputPath, name, path;

  if (data.stdout) {
    try {
      [inputPath, name, path] = data.stdout.split('(')[2].split(',');

      inputPath = inputPath.split('"')[1];
      name = name.split('"')[1];
      path = path.split('=')[1].trim();
    } catch {
      [inputPath, name, path] = data.stdout.split('(')[3].split(',');

      inputPath = inputPath.split('"')[1];
      name = name.split('"')[1];
      path = path.split('=')[1].trim();
    }
  } else {
    inputPath = name = path = null;
  }

  return { name, inputPath, path };
};

const performPostQuery = (store, result) => {
  let post_query;

  if (
    result.query.startsWith(manCommands.switchWorkspace) ||
    result.query === 'project'
  ) {
    post_query = 'workspace';
  } else {
    post_query = 'project';
  }

  store.dispatch(postQuery(post_query));
};

const setQueryResult = (data, store, key, results) => {
  if (!results[key].result.stdout && !results[key].result.stderr) {
    if (data.stdout) {
      results[key]['result']['stdout'] = data.stdout;
    }

    if (data.stderr) {
      results[key]['result']['stderr'] = data.stderr;
    }

    store.dispatch(setResults(results));
  } else if (
    results[key].query.startsWith(manCommands.switchWorkspace) ||
    results[key].query === 'project'
  ) {
    if (data.stdout) {
      const projects = parseProjects(data);
      results[key]['workspace'] = { projects };
      store.dispatch(setResults(results));
    }
  } else {
    results[key]['project'] = parseProject(data);
    store.dispatch(setResults(results));
  }
};

export const handleWebSocketResponse = data => {
  store.dispatch(getQueryResult(data.utf8Data)).then(async data => {
    const { results } = store.getState().query;
    const key = Object.keys(results)[Object.keys(results).length - 1];
    const latest = results[key];

    if (!latest.result.stdout && !latest.result.stderr) {
      setQueryResult(data, store, key, results);
      performPostQuery(store, results[key]);
    } else {
      setQueryResult(data, store, key, results);
      store.dispatch(deQueueQuery());
    }
  });
};

export const handleScrollTop = e => {
  return e.target.scrollTop > 0 ? { scrolled: true } : { scrolled: false };
};

export const openFile = (path, props) => {
  if (path) {
    const files = props.files;
    delete files.recent[path];
    files.recent[path] = true;
    props.setRecent(files);
  }
};

export const openEmptyFile = () => {
  const files = store.getState().files;
  let last_untitled = Object.keys(files).filter(file =>
    file.startsWith('untitled') ? true : false,
  );
  let index = 0;
  last_untitled.forEach(file => {
    let count = file.split('(')[1].split(')')[0];
    if (Number(count) > index) index = Number(count);
  });

  files.recent[`untitled (${index + 1})`] = true;
  store.dispatch(setRecent(files));
};

export const saveFile = path => {
  const file_content = store.getState().files.openFileContent;
  const files = store.getState().files;

  if (!path) {
    path = Object.keys(files.recent);
    path = path[path.length - 1];
  }

  const readOnly = path && path.slice(path.length - 3) === '.sc' ? false : true;

  if (!readOnly || path.startsWith('untitled')) {
    path &&
      new Promise((resolve, reject) => {
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
        .then(() => {
          fs.writeFile(path, file_content, err => {
            if (!err) {
              store.dispatch(
                setToast({
                  icon: 'info-sign',
                  intent: 'success',
                  message: 'saved successfully',
                }),
              );
            } else {
              store.dispatch(
                setToast({
                  icon: 'warning-sign',
                  intent: 'danger',
                  message: 'error saving file',
                }),
              );
            }
          });
        })
        .catch(async () => {
          const workspace_path = store.getState().workspace.path;
          let new_path;
          if (workspace_path) {
            new_path = `${workspace_path}/${path}`;
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
            store.dispatch(
              setToast({
                icon: 'warning-sign',
                intent: 'danger',
                message: "couldn't create file",
              }),
            );
          });

          if (file && !file.canceled) {
            const readOnly =
              file.filePath
                .toString()
                .slice(file.filePath.toString().length - 3) === '.sc'
                ? false
                : true;

            if (!readOnly) {
              fs.writeFile(file.filePath.toString(), file_content, err => {
                if (err) {
                  store.dispatch(
                    setToast({
                      icon: 'warning-sign',
                      intent: 'danger',
                      message: "can't save to file",
                    }),
                  );
                } else {
                  store.dispatch(
                    setToast({
                      icon: 'info-sign',
                      intent: 'success',
                      message: 'saved successfully',
                    }),
                  );

                  delete files.recent[path];

                  files.recent[file.filePath.toString()] = true;

                  store.dispatch(setRecent(files.recent));
                  store.dispatch(enQueueQuery(addWorkSpaceQueryToQueue()));
                }
              });
            } else {
              store.dispatch(
                setToast({
                  icon: 'warning-sign',
                  intent: 'danger',
                  message: 'can only save .sc files',
                }),
              );
            }
          } else {
            console.log('file creation was cancelled');
          }
        });
  } else {
    store.dispatch(
      setToast({
        icon: 'warning-sign',
        intent: 'danger',
        message: 'can only save .sc files',
      }),
    );
  }
};

export const deleteFile = path => {
  const files = store.getState().files;

  if (!path) {
    path = Object.keys(files.recent);
    path = path[path.length - 1];
  }

  const readOnly = path && path.slice(path.length - 3) === '.sc' ? false : true;

  if (!readOnly || path.startsWith('untitled')) {
    path &&
      new Promise((resolve, reject) => {
        fs.stat(path, (err, stats) => {
          if (!err && stats.isFile()) {
            resolve(stats);
          } else {
            reject(err);
          }
        });
      })
        .then(() => {
          fs.unlink(path, err => {
            if (!err) {
              store.dispatch(
                setToast({
                  icon: 'info-sign',
                  intent: 'success',
                  message: 'file deleted successfully',
                }),
              );
              delete files.recent[path];
              store.dispatch(setRecent(files.recent));
              store.dispatch(enQueueQuery(addWorkSpaceQueryToQueue()));
            } else {
              store.dispatch(
                setToast({
                  icon: 'warning-sign',
                  intent: 'danger',
                  message: 'file cannot be deleted',
                }),
              );
            }
          });
        })
        .catch(() => {
          store.dispatch(
            setToast({
              icon: 'warning-sign',
              intent: 'danger',
              message: 'file not found',
            }),
          );
        });
  } else {
    store.dispatch(
      setToast({
        icon: 'warning-sign',
        intent: 'danger',
        message: 'can only delete .sc files',
      }),
    );
  }
};

export const isFilePathInQueryResult = results => {
  const latest = results[Object.keys(results)[Object.keys(results).length - 1]];

  if (latest?.result.stdout && latest.result.stdout.includes('filename')) {
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

export const getDirectories = src =>
  new Promise((resolve, reject) => {
    glob(src + '/**/*', (err, path) => {
      if (!err) {
        resolve(path);
      } else {
        reject(err);
      }
    });
  });

export const getFolderStructureRootPath = workspace => {
  const { projects } = workspace;
  let path = null;

  projects &&
    Object.keys(projects).forEach(name => {
      if (projects[name].open) {
        path = projects[name].inputPath;
      }
    });

  path = path
    ? path
        .split('/')
        .slice(0, path.split('/').length - 1)
        .join('/')
    : null;
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

export const handleAPIQueryError = err => {
  if (err === apiErrorStrings.ws_not_connected) {
    const ws_url = store.getState().settings.websocket.url;
    store.dispatch(
      setToast({
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
      }),
    );
  } else if (err.message.includes('401')) {
    store.dispatch(
      setToast({
        icon: 'warning-sign',
        intent: 'danger',
        message: 'authentication error. Your server requires authentication',
      }),
    );
  }

  store.dispatch(resetQueue({}));
};

export const initShortcuts = () => {
  Mousetrap.bindGlobal(['command+s', 'ctrl+s'], function () {
    saveFile();
  });
};

export const removeShortcuts = () => {
  Mousetrap.unbind(['command+s', 'ctrl+s']);
};
