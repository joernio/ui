import { nanoid } from 'nanoid';
import glob from 'glob';
import fs from 'fs';
import Mousetrap from 'mousetrap';
import { Tree } from '@blueprintjs/core';
import {
  cpgManagementCommands as manCommands,
  apiErrorStrings,
  syntheticFiles,
  imageFileExtensions,
  filesToIgnore,
} from './defaultVariables';
import {
  deQueueQuery,
  getQueryResult,
  postQuery,
  setResults,
  resetQueue,
  enQueueQuery,
  deQueueScriptsQuery,
  setQueryShortcut,
} from '../../../store/actions/queryActions';
import { setToast } from '../../../store/actions/statusActions';
import { setFiles, setOpenFiles } from '../../../store/actions/filesActions';
import { setHighlightRange } from '../../../store/actions/editorActions';
import { windowActionApi, selectDirApi } from './ipcRenderer';
import { store } from '../../../store/configureStore';
import chokidar from 'chokidar';

import { mouseTrapGlobalBindig } from './extensions';
import { handlePrintable } from '../../../views/terminal_window/terminalWindowScripts';

mouseTrapGlobalBindig(Mousetrap);

/**
 * Function to generates a unique id. The id is used
 * in keeping track of query made in the app
 * @returns a unique id
 */
export const generateRandomID = () => {
  return nanoid();
};

/**
 * Function to adds query to queue. A query is the CPG
 * command run in the terminal. A queue is a collection of
 * all the queries to run.
 * @param {Object} query The new query
 * @param {Object} queue The query collection
 * @returns The updated queue
 */
export const performEnQueueQuery = (query, queue) => {
  const key = `${Object.keys(queue).length}-${generateRandomID()}`;
  queue[key] = query;

  return queue;
};

/**
 * Function to removes the last query from queue
 * @param {Object} queue The query collection
 * @returns The updated queue
 */
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

/**
 * Function to gets the first query in a queue
 * @param {Object} queue The query collection
 * @returns the first query in the queue
 */
export const performPeekQueue = queue => {
  const key = Object.keys(queue)[0];
  const query = queue[key];
  return query ? query : null;
};

/**
 * Function to send message to perform an action on the window
 * It could be to close the window or to reload
 * @param {string} action to be performed by the window
 */
export const sendWindowsMessage = action => {
  windowActionApi.sendWindowAction(action);
};

/**
 * Function to reconnectes web socket to server
 * @param {string} ws_url websocket url
 */
export const wsReconnectToServer = ws_url => {
  windowActionApi.connectToWebSocketAction(ws_url);
};

/**
 * Function to disconnects web socket from server
 */
export const wsDisconnectFromServer = () => {
  windowActionApi.disconnectFromWebSocketAction();
};

/**
 * Function to appends a classname to a node. This can return
 * null if no node exist
 * @param {Object} nodes uploaded folders
 * @param {Function} callback
 * @returns
 */
export const forEachNode = (nodes, callback) => {
  if (nodes === undefined) {
    return;
  }

  for (const node of nodes) {
    callback(node);
    forEachNode(node.childNodes, callback);
  }
};

/**
 * Function to lood through nodes
 * @param {Object} nodes uploaded folders
 * @param {string} path
 * @param {Function} callback
 */
export const forNodeAtPath = (nodes, path, callback) => {
  callback(Tree.nodeFromPath(path, nodes));
};

/**
 * Function to add the result of a query to results collection
 * @param {Object} result A query response
 * @param {Object} results A collection of all query response
 * @returns results. This cannot be more than 500 in a collection
 */
export const performPushResult = (result, results) => {
  results = { ...results };
  const key = Object.keys(result)[0];
  const keys = Object.keys(results);

  if (keys.length >= 500) delete results[keys[0]];

  results[key] = result[key];
  return results;
};

/**
 * Function to searches for result with post-query-key.
 * Post-query is a ...
 * @param {Object} results The result collection from running a query
 * @param {Object} post_query_key The post query key
 * @returns key
 */
export const getResultObjWithPostQueryKey = (results, post_query_key) => {
  for (let key in results) {
    if (key && results[key]['post_query_uuid'] === post_query_key) {
      return key;
    }
  }
};

/**
 * Function to parse projects
 * @param {*} data
 * @returns projects
 */
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

    return projects;
  }
};

/**
 * Function to parse a single project
 * @param {*} data
 * @returns a project
 */
export const parseProject = data => {
  let inputPath, name, path, cpg, language;
  language = cpg = null;

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

  return { name, inputPath, path, cpg, language };
};

/**
 * Function to perform a postQuery.
 * PostQuery is a ...
 * @param {Object} store
 * @param {Object} results
 * @param {number} key
 */
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

/**
 * Function to print a query result to the terminal
 * @param {Object} data
 * @param {Object} store
 * @param {number} key
 * @param {Object} results
 */
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

/**
 * Function to handles websocket response
 * @param {Object} data
 */
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

/**
 * Function to enable or disable scroll to top
 * @param {Object} e
 * @returns true if scrolled to the top of the window, and false otherwise.
 */
export const handleScrollTop = e => {
  return e.target.scrollTop > 0 ? { scrolled: true } : { scrolled: false };
};

/**
 * discard dialog handler
 * @param {Object} openFiles
 * @param {Object} openFilePath
 * @param {Function} callback
 * @returns
 */

export const discardDialogHandler = (openFiles, openFilePath, callback) => {
  if (openFiles[openFilePath] === false) {
    return { openDiscardDialog: true, discardDialogCallback: callback };
  }

  callback();
};

/**
 * Function to get the name of the open file
 * @param {string} path
 * @returns the file path
 */
export const getOpenFileName = path => {
  if (path) {
    path = path ? path.split('/') : null;
    path = path ? path[path.length - 1] : null;

    return path;
  }
};

/**
 * Function to get extension of a file
 * @param {string} path
 * @returns . if ext is true, otherwise empty space
 */
export const getExtension = path => {
  let ext = path.split('.')[path.split('.').length - 1];
  return ext ? '.' + ext : '';
};

/**
 * Function to open a file
 * @param {string} path
 */
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
    store.dispatch(setHighlightRange({ startLine: null, endLine: null }));
  }
};

/**
 * function to open sythentic files
 * synthetic files are interface that can be opened as file in the editor
 * @param {string} path
 * @param {Object} content
 */
export const openSyntheticFile = async (path, content) => {
  if (path) {
    const files = { ...store.getState().files };

    if (path.endsWith('AST Graph')) {
      files.recent = { ...files.recent };
      files.recent[path] = content;
    }

    if (!Object.keys(files.openFiles).includes(path)) {
      const entries = Object.entries({ ...files.openFiles });
      const new_entries = [];

      if (entries.length === 0) {
        new_entries.push([path, content]);
      }

      entries.forEach((entry, index) => {
        if (entry[0] === files.openFilePath) {
          new_entries.push([...entry], [path, content]);
        } else {
          new_entries.push([...entry]);

          if (index === entries.length - 1) new_entries.push([path, content]);
        }
      });
      files.openFiles = Object.fromEntries(new_entries);
    }

    files.openFilePath = path;
    files.openFileContent = content;
    files.openFileIsReadOnly = true;
    store.dispatch(setFiles(files));
  }
};

/**
 * Function to close a file
 * @param {string} path
 */
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
          if (
            syntheticFiles.filter(type => files.openFilePath.endsWith(type))
              .length > 0
          ) {
            return {
              openFileContent: files.openFiles[files.openFilePath],
              openFileIsReadOnly: true,
            };
          }

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
    store.dispatch(setHighlightRange({ startLine: null, endLine: null }));
  }
};

/**
 * Function to open a new File
 */
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
  store.dispatch(setHighlightRange({ startLine: null, endLine: null }));
};

/**
 * Function to save a file
 * @param {string} path
 * @param {*} base_dir
 */
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

                  const entries = Object.entries({
                    ...files.openFiles,
                  });
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

/**
 * Function to delete a file
 * @param {string} path
 */
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

/**
 * Function to read the content of a file
 * just return the file path instead;
 * @param {string} path the path to the file to read
 * @returns path a media file is found instead
 */

export const readFile = path => {
  return new Promise((resolve, reject) => {
    if (path) {
      //avoid reading media files (images, etc) into memory. just return the file path instead;
      if (
        imageFileExtensions.includes(getExtension(path)) ||
        syntheticFiles.filter(type => path.endsWith(type)).length > 0 ||
        filesToIgnore.includes(getExtension(path))
      ) {
        resolve(path);
      }

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
            if (
              syntheticFiles.filter(type => entry[0].endsWith(type)).length > 0
            ) {
              return r(entry);
            } else {
              return r(false);
            }
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

/**
 * Function to refresh open files
 */
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
            if (
              syntheticFiles.filter(type => entry[0].endsWith(type)).length > 0
            ) {
              return r(entry);
            } else {
              return r(false);
            }
          }
        });
      });
    });

    open_files_entries = await Promise.all(open_files_entries);
    open_files_entries = open_files_entries.filter(entry =>
      entry !== false ? true : false,
    );
    files.openFiles = Object.fromEntries(open_files_entries);
    store.dispatch(setFiles(files));

    if (
      !files.openFilePath ||
      (files.openFilePath ===
        files.openFilePath.split('/')[
          files.openFilePath.split('/').length - 1
        ] &&
        syntheticFiles.filter(type => files.openFilePath.endsWith(type))
          .length === 0)
    ) {
      const path = Object.keys(files.openFiles ? files.openFiles : {})[0];
      openFile(path);
    }
  }
};

/**
 * Function to check if a file path is contained in a query result
 * @param {Object} results
 * @returns
 */
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

/**
 * Function to check if a query result can open a synthetic file
 * @param {Object} results
 * @returns
 */
export const isQueryResultToOpenSynthFile = results => {
  const latest = results[Object.keys(results)[Object.keys(results).length - 1]];
  let synth_file_path = false,
    content = false;

  if (
    latest?.result?.stdout &&
    typeof latest.result.stdout === 'string' &&
    latest.result.stdout.includes('"""') &&
    latest.query.search('dotAst.l') > -1
  ) {
    try {
      let methodName = latest.query.split('("')[1].split('")')[0];
      synth_file_path = `${methodName} - AST Graph`;
      content = latest.result.stdout.split('"""');
      content = `${content[1]}`;
      content = content.split('\\"').join("'");
    } catch {
      synth_file_path = false;
      content = false;
    }
  }

  return { synth_file_path, content };
};

/**
 * Function to check if a script query result can open a synthetic file
 * @param {*} result
 * @returns
 */

export const isScriptQueryResultToOpenSynthFile = async result => {
  let synth_file_path = false,
    content = false;

  if (
    result?.result?.stdout &&
    typeof result.result.stdout === 'string' &&
    !result.query.startsWith('import') &&
    result.result.stdout.includes('.json')
  ) {
    try {
      synth_file_path = `${
        result.query.split('`').join('').split('.')[0]
      }.sc - Script Report`;
      content = result.result.stdout.split('=')[1].split('"')[1];
      content = await readFile(content).catch(() => {
        synth_file_path = false;
        handleSetToast({
          icon: 'warning-sign',
          intent: 'danger',
          message:
            "script report file path returned by script run doesn't exist",
        });

        return false;
      });
    } catch (e) {
      synth_file_path = false;
      content = false;
    }
  }

  return { synth_file_path, content };
};

/**
 * Function to get ingnore array
 * @param {string} src
 * @param {string} uiIgnore
 * @returns
 */
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

/**
 * Function to get directories
 * @param {string} src
 * @returns a promise
 */
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

/**
 * Function to get folder structure root-path from workspace
 * @param {Object} workspace
 * @returns path and root
 */
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

export const debounceLeading = (callback, timeout = 300) => {
  let timer;
  return function (...args) {
    const context = this;
    if (!timer) {
      callback.apply(context, args);
    }
    clearTimeout(timer);
    timer = setTimeout(() => {
      timer = undefined;
    }, timeout);
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
    debounceLeading(doResize, 100)(e);
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

/**
 * Function to compare if results are equal
 * @param {Object} prev_results
 * @param {Object} results
 * @returns true if equal otherwise false
 */
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

/**
 * Function to check if there are open projects
 * @param {Object} workspace
 * @returns open projects length, otherwise null
 */
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

/**
 * Function to check if queue is empty
 * @param {Object} queue
 * @returns true if queue is empty otherwise false
 */
export const queueEmpty = queue => {
  if (queue && Object.keys(queue).length === 0) {
    return true;
  } else if (!queue) {
    return true;
  } else {
    return false;
  }
};

/**
 * Function to add query to the queue
 * @param {Object} query
 * @param {Object} props
 */
export const addToQueue = (query, props) => {
  if (query) {
    props.enQueueQuery(query);
  }
};

/**
 * Function to add workspace query to queue
 * @returns
 */
export const addWorkSpaceQueryToQueue = () => {
  const query = {
    query: 'workspace',
    origin: 'workspace',
    ignore: true,
  };

  return query;
};

/**
 * Function to contruct query with path
 * @param {string} query_name
 * @param {string} type
 * @returns
 */
export const contructQueryWithPath = async (query_name, type) => {
  selectDirApi.selectDir(type === 'select-dir' ? 'select-dir' : 'select-file');

  let path = await new Promise((resolve, reject) => {
    selectDirApi.registerListener(
      type === 'select-dir' ? 'selected-dir' : 'selected-file',
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

  if (path && stats) {
    const query = {
      query: `${query_name}(inputPath="${path}")`,
      origin: 'workspace',
      ignore: false,
    };

    return query;
  }
};

/**
 * Function to switch workspace
 * @returns
 */

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

/**
 * Function to handle api query error
 * @param {Object} err
 */
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

/**
 * Function to handle shortcut
 * @param {Object} shortcutObj
 */
export const handleShortcut = shortcutObj => {
  if (shortcutObj.query.includes('\\0')) {
    store.dispatch(setQueryShortcut(shortcutObj));
  } else if (shortcutObj.behaviour === 'paste to terminal') {
    const { term, refs } = store.getState().terminal;
    const { busy } = store.getState().terminal;
    !busy && handlePrintable(term, refs, { key: shortcutObj.query });
    busy &&
      handleSetToast({
        icon: 'warning-sign',
        intent: 'primary',
        message:
          "Can't paste to terminal because the terminal is busy. You can either wait for the terminal to be done with previous task or change the behaviour of the shortcut and try again later",
      });
  } else if (shortcutObj.behaviour === 'run as soon as possible') {
    const query = {
      query: shortcutObj.query,
      origin: 'workspace',
      ignore: shortcutObj.background,
    };
    store.dispatch(enQueueQuery(query));
  }
};

/**
 * Function to register query shortcut
 * @param {*} keybinding
 */
export const registerQueryShortcut = keybinding => {
  const shortcutObj = store.getState().settings.queryShortcuts[keybinding];
  const callback = debounceLeading(handleShortcut, 1000);
  Mousetrap.bindGlobal([keybinding], () => callback(shortcutObj));
};

/**
 * Function to unRegister query shortcut
 * @param {*} keybinding
 */
export const unRegisterQueryShortcut = keybinding => {
  Mousetrap.unbind([keybinding]);
};

/**
 * Function to initialize shortcuts
 */
export const initShortcuts = () => {
  const { queryShortcuts } = store.getState().settings;

  const handleSaveFileShortcut = () => {
    saveFile(
      store.getState().files.openFilePath,
      store.getState().settings.scriptsDir,
    );
  };

  const callback = debounceLeading(handleSaveFileShortcut, 1000);

  Mousetrap.bindGlobal(['command+s', 'ctrl+s'], callback);

  Object.keys(queryShortcuts).map(keybinding => {
    registerQueryShortcut(keybinding);
  });
};

/**
 * Function to remove shortcuts
 */
export const removeShortcuts = () => {
  const { queryShortcuts } = store.getState().settings;

  Mousetrap.unbind(['command+s', 'ctrl+s']);

  Object.keys(queryShortcuts).map(keybinding => {
    unRegisterQueryShortcut(keybinding);
  });
};

/**
 * Funtion to set a toast
 * @param {Object} toast
 */
export const handleSetToast = toast => {
  store.dispatch(setToast(toast));
};

/**
 * Function to format number to a given unit
 * @param {number} num
 * @returns formatted number
 */
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

/**
 * Function to handle fontsize change
 * @param {HTMLCollection} doc
 * @param {string} fontSize
 */
export const handleFontSizeChange = (doc, fontSize) => {
  doc.children[0].style.fontSize = fontSize;
  doc.children[0].children[1].style.fontSize = fontSize;
};

/**
 * Function to get script result
 * @param {number} uuids
 * @param {Object} results
 * @returns result
 */
export const getScriptResult = (uuids, results) => {
  let result;

  for (let i = uuids.length - 1; i >= 0; i--) {
    if (results[uuids[i]].origin === 'script') {
      result = results[uuids[i]];
      break;
    }
  }

  return result;
};

/**
 * Function to generate script-import query
 * @param {string} path_to_script
 * @param {string} path_to_workspace
 * @returns true if error, otherwise undefined
 */

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
