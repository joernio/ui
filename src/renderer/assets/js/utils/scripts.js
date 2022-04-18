import { nanoid } from 'nanoid';
import glob from 'glob';
import fs from 'fs';
import Mousetrap from 'mousetrap';
import { Tree } from '@blueprintjs/core';
import chokidar from 'chokidar';
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

import { mouseTrapGlobalBindig } from './extensions';
import { handlePrintable } from '../../../views/terminal_window/terminalWindowScripts';

mouseTrapGlobalBindig(Mousetrap);

export const generateRandomID = () => nanoid();

export const handleSetToast = toast => {
	store.dispatch(setToast(toast));
};

export const queueEmpty = queue => {
	if (queue && Object.keys(queue).length === 0) {
		return true;
	}
	if (!queue) {
		return true;
	}
	return false;
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

export const performEnQueueQuery = (query, queue) => {
	const key = `${Object.keys(queue).length}-${generateRandomID()}`;
	queue[key] = query;

	return queue;
};

export const performDeQueueQuery = queue => {
	const key = Object.keys(queue).shift();
	if (key) {
		const query = queue[key];
		delete queue[key];
		return { queue, query };
	}
	return { queue, query: null };
};

export const performPeekQueue = queue => {
	const key = Object.keys(queue)[0];
	const query = queue[key];
	return query || null;
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

	nodes.forEach(node => {
		callback(node);
		forEachNode(node.childNodes, callback);
	});
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
	let res;
	Object.keys(results).some(key => {
		if (key && results[key].post_query_uuid === post_query_key) {
			res = key;
			return true;
		}
		return false;
	});

	return res;
};

export const parseProjects = data => {
	if (data.stdout.split('=')[1].trim().startsWith('empty')) {
		return {};
	}
	const parsed = data.stdout
		.split('\n')
		.filter(str => str || false)
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
};

export const parseProject = data => {
	let inputPath;
	let name;
	let path;
	const cpg = null;
	const language = null;

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
		inputPath = null;
		name = null;
		path = null;
	}

	return { name, inputPath, path, cpg, language };
};

const performPostQuery = (store, results, key) => {
	let post_query;
	const result = results[key];

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
			results[key].result.stderr = 'query failed';
		} else {
			if (data.stdout) {
				results[key].result.stdout = data.stdout;
			}

			if (data.stderr) {
				results[key].result.stderr = data.stderr;
			}
		}

		store.dispatch(setResults(results));
	} else if (
		results[key].query.startsWith(manCommands.switchWorkspace) ||
		results[key].query === 'project'
	) {
		if (
			!data &&
			!results[key].result.stdout &&
			!results[key].result.stderr
		) {
			results[key].result.stderr = 'query failed';
		} else if (data.stdout) {
			const projects = parseProjects(data);
			results[key].workspace = { projects };
		}

		store.dispatch(setResults(results));
	} else {
		if (
			!data &&
			!results[key].result.stdout &&
			!results[key].result.stderr
		) {
			results[key].result.stderr = 'query failed';
		} else {
			results[key].project = parseProject(data);
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

export const handleScrollTop = e =>
	e.target.scrollTop > 0 ? { scrolled: true } : { scrolled: false };

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

export const getExtension = path => {
	const ext = path.split('.')[path.split('.').length - 1];
	return ext ? `.${ext}` : '';
};

export const readFile = path =>
	new Promise((resolve, reject) => {
		if (path) {
			// avoid reading media files (images, etc) into memory. just return the file path instead;
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

					if (index === entries.length - 1)
						new_entries.push([path, true]);
				}
			});
			files.openFiles = Object.fromEntries(new_entries);
		}

		files.openFilePath = path;

		const { openFileContent, openFileIsReadOnly } = await readFile(path)
			.then(data => {
				const openFileIsReadOnly =
					path.slice(path.length - 3) !== '.sc';

				return { openFileContent: data, openFileIsReadOnly };
			})
			.catch(() => {
				if (
					!path ||
					path === path.split('/')[path.split('/').length - 1]
				) {
					return {
						openFileContent: '',
						openFileIsReadOnly: !(
							path && path.startsWith('untitled')
						),
					};
				}
				handleSetToast({
					icon: 'warning-sign',
					intent: 'danger',
					message: 'error opening file',
				});
			});

		files.openFileContent = openFileContent;
		files.openFileIsReadOnly = openFileIsReadOnly;
		store.dispatch(setFiles(files));
		store.dispatch(setHighlightRange({ startLine: null, endLine: null }));
	}
};

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

					if (index === entries.length - 1)
						new_entries.push([path, content]);
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

export const closeFile = async path => {
	if (path) {
		const files = { ...store.getState().files };

		const openFiles = { ...files.openFiles };
		const openFilesKeys = Object.keys(openFiles);
		openFilesKeys.forEach((key, index) => {
			if (key === path) {
				const prevArr = openFilesKeys.slice(0, index);
				const nextArr = openFilesKeys.slice(index + 1);
				files.openFilePath = nextArr[0] || prevArr.pop() || '';
			}
		});

		const entries = Object.entries(openFiles);
		const new_entries = entries.filter(entry => entry[0] !== path);
		files.openFiles = Object.fromEntries(new_entries);

		const { openFileContent, openFileIsReadOnly } = await readFile(
			files.openFilePath,
		)
			.then(data => {
				const openFileIsReadOnly =
					files.openFilePath.slice(files.openFilePath.length - 3) !==
					'.sc';

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
						syntheticFiles.filter(type =>
							files.openFilePath.endsWith(type),
						).length > 0
					) {
						return {
							openFileContent:
								files.openFiles[files.openFilePath],
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
						openFileIsReadOnly: !(
							files.openFilePath &&
							files.openFilePath.startsWith('untitled')
						),
					};
				}
			});

		files.openFileContent = openFileContent;
		files.openFileIsReadOnly = openFileIsReadOnly;

		store.dispatch(setFiles(files));
		store.dispatch(setHighlightRange({ startLine: null, endLine: null }));
	}
};

export const openEmptyFile = () => {
	const files = { ...store.getState().files };
	const last_untitled = Object.keys(files.openFiles).filter(
		file => !!file.startsWith('untitled'),
	);
	let index = 0;
	last_untitled.forEach(file => {
		const count = file.split('(')[1].split(')')[0];
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

			if (index === entries.length - 1)
				new_entries.push([file_name, true]);
		}
	});
	files.openFiles = Object.fromEntries(new_entries);

	files.openFilePath = file_name;

	files.openFileContent = '';
	files.openFileIsReadOnly = false;

	store.dispatch(setFiles(files));
	store.dispatch(setHighlightRange({ startLine: null, endLine: null }));
};

export const saveFile = async (path, base_dir) => {
	const file_content = store.getState().files.openFileContent;
	const files = { ...store.getState().files };

	const readOnly = !(path && path.slice(path.length - 3) === '.sc');

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
								.slice(file.filePath.toString().length - 3) !==
							'.sc';

						if (!readOnly) {
							await new Promise((res, rej) => {
								fs.writeFile(
									file.filePath.toString(),
									file_content,
									err => {
										if (err) {
											rej();
										} else {
											res();
										}
									},
								);
							})
								.then(() => {
									handleSetToast({
										icon: 'info-sign',
										intent: 'success',
										message: 'saved successfully',
									});

									files.recent[
										file.filePath.toString()
									] = true;
									files.openFilePath =
										file.filePath.toString();

									const entries = Object.entries({
										...files.openFiles,
									});
									const new_entries = [];
									entries.forEach(entry => {
										if (entry[0] === path) {
											new_entries.push([
												files.openFilePath,
												true,
											]);
										} else {
											new_entries.push([...entry]);
										}
									});

									files.openFiles =
										Object.fromEntries(new_entries);

									store.dispatch(setFiles(files));
									store.dispatch(
										enQueueQuery(
											addWorkSpaceQueryToQueue(),
										),
									);
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
						console.log('file creation was cancelled'); // eslint-disable-line no-console
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

export const refreshRecent = async () => {
	const files = { ...store.getState().files };
	if (
		typeof files.recent === 'object' &&
		Object.keys(files.recent).length > 0
	) {
		const recent = { ...files.recent };
		let recent_entries = Object.entries(recent);

		recent_entries = recent_entries.map(
			entry =>
				new Promise(r => {
					fs.stat(entry[0], err => {
						if (!err) {
							return r(entry);
						}
						if (
							syntheticFiles.filter(type =>
								entry[0].endsWith(type),
							).length > 0
						) {
							return r(entry);
						}
						return r(false);
					});
				}),
		);

		recent_entries = await Promise.all(recent_entries);

		recent_entries = recent_entries.filter(entry => entry !== false);

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

		open_files_entries = open_files_entries.map(
			entry =>
				new Promise(r => {
					fs.stat(entry[0], (err, stats) => {
						if (!err && stats.isFile()) {
							return r(entry);
						}
						if (
							syntheticFiles.filter(type =>
								entry[0].endsWith(type),
							).length > 0
						) {
							return r(entry);
						}
						return r(false);
					});
				}),
		);

		open_files_entries = await Promise.all(open_files_entries);
		open_files_entries = open_files_entries.filter(
			entry => entry !== false,
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

export const deleteFile = async path => {
	if (path) {
		const readOnly = !(path && path.slice(path.length - 3) === '.sc');

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

export const isFilePathInQueryResult = results => {
	const latest =
		results[Object.keys(results)[Object.keys(results).length - 1]];

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

export const isQueryResultToOpenSynthFile = results => {
	const latest =
		results[Object.keys(results)[Object.keys(results).length - 1]];
	let synth_file_path = false;
	let content = false;

	if (
		latest?.result?.stdout &&
		typeof latest.result.stdout === 'string' &&
		latest.result.stdout.includes('"""') &&
		latest.query.search('dotAst.l') > -1
	) {
		try {
			const methodName = latest.query.split('("')[1].split('")')[0];
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

export const isScriptQueryResultToOpenSynthFile = async result => {
	let synth_file_path = false;
	let content = false;

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

export const getUIIgnoreArr = (src, uiIgnore) => {
	if (uiIgnore && typeof uiIgnore === 'string') {
		return uiIgnore
			.split(',')
			.filter(str => !!(str && str !== ' '))
			.map(str => `${src}/**/${str.trim()}/**`);
	}
	return [];
};

export const getDirectories = src =>
	new Promise((resolve, reject) => {
		glob(
			`${src}/**/*`,
			{
				ignore: [
					...getUIIgnoreArr(
						src,
						store.getState()?.settings?.uiIgnore,
					),
				],
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
	} else if (path) {
		vars.chokidarWatcher = chokidar.watch(
			path,
			vars.chokidarConfig(path, ignore),
		);

		vars.chokidarWatcher.on('ready', () => {
			vars.chokidarWatcher.on('all', callback);
		});
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
		// eslint-disable-next-line no-restricted-syntax
		for (const node of projectRef.current.children) {
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

export const handleCloseContextMenu = () => ({
	context: {
		mouseX: null,
		mouseY: null,
	},
});

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
			setTimeout(() => {
				inThrottle = false;
			}, limit);
		}
	};
};

export const initResize = (resizeHandle, type, resizeHandler) => {
	let startX_Y;
	let currentWidth_Height;

	function doResize(e) {
		const diff =
			type === 'col' ? e.clientX - startX_Y : startX_Y - e.clientY;
		resizeHandler(`${currentWidth_Height + diff}px`, diff);
	}

	function resize(e) {
		debounceLeading(doResize, 100)(e);
	}

	function stopResize(e) {
		e.target.ownerDocument.removeEventListener('mousemove', resize, false);
		e.target.ownerDocument.removeEventListener(
			'mouseup',
			stopResize,
			false,
		);
	}

	function initDrag(e) {
		startX_Y = type === 'col' ? e.clientX : e.clientY;
		currentWidth_Height =
			type === 'col'
				? resizeHandle.parentElement.offsetWidth
				: resizeHandle.parentElement.offsetHeight;

		e.target.ownerDocument.addEventListener('mousemove', resize, false);
		e.target.ownerDocument.addEventListener('mouseup', stopResize, false);
	}

	resizeHandle.addEventListener('mousedown', initDrag, false);

	return initDrag;
};

export const areResultsEqual = (prev_results, results) => {
	if (results) {
		let prev_latest_uuid = Object.keys(prev_results || {});
		prev_latest_uuid = prev_latest_uuid[prev_latest_uuid.length - 1];

		let latest_uuid = Object.keys(results);
		latest_uuid = latest_uuid[latest_uuid.length - 1];

		return !!(
			prev_latest_uuid === latest_uuid && latest_uuid !== undefined
		);
	}
	return true; // this is a trick to force the code not to perform the action that depends on this function.
};

export const openProjectExists = workspace => {
	const is_open_project =
		workspace?.projects &&
		Object.keys(workspace.projects).filter(
			name => !!workspace.projects[name].open,
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

export const contructQueryWithPath = async (query_name, type) => {
	selectDirApi.selectDir(
		type === 'select-dir' ? 'select-dir' : 'select-file',
	);

	const path = await new Promise((resolve, reject) => {
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
		console.log("can't select project path"); // eslint-disable-line no-console
	});

	const stats = await new Promise((resolve, reject) => {
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
		console.log("can't select workspace path"); // eslint-disable-line no-console
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
					wsReconnectToServer(ws_url); // hack: somehow calling wsReconnectToServer once doesn't connect to the websocket
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
			message:
				'authentication error. Your server requires authentication',
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

export const registerQueryShortcut = keybinding => {
	const shortcutObj = store.getState().settings.queryShortcuts[keybinding];
	const callback = debounceLeading(handleShortcut, 1000);
	Mousetrap.bindGlobal([keybinding], () => callback(shortcutObj));
};

export const unRegisterQueryShortcut = keybinding => {
	Mousetrap.unbind([keybinding]);
};

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

	Object.keys(queryShortcuts).forEach(keybinding => {
		registerQueryShortcut(keybinding);
	});
};

export const removeShortcuts = () => {
	const { queryShortcuts } = store.getState().settings;

	Mousetrap.unbind(['command+s', 'ctrl+s']);

	Object.keys(queryShortcuts).forEach(keybinding => {
		unRegisterQueryShortcut(keybinding);
	});
};

export const nFormatter = num => {
	if (num >= 1000000000) {
		return `${(num / 1000000000).toFixed(1).replace(/\.0$/, '')}G`;
	}
	if (num >= 1000000) {
		return `${(num / 1000000).toFixed(1).replace(/\.0$/, '')}M`;
	}
	if (num >= 1000) {
		return `${(num / 1000).toFixed(1).replace(/\.0$/, '')}K`;
	}
	return num;
};

export const handleFontSizeChange = (doc, fontSize) => {
	doc.children[0].style.fontSize = fontSize;
	doc.children[0].children[1].style.fontSize = fontSize;
};

export const getScriptResult = (uuids, results) => {
	let result;

	for (let i = uuids.length - 1; i >= 0; i -= 1) {
		if (results[uuids[i]].origin === 'script') {
			result = results[uuids[i]];
			break;
		}
	}

	return result;
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
		if (modified_path_to_script.split(`/${folder}/`).length > 1) {
			modified_path_to_script = modified_path_to_script.split(folder);
			modified_path_to_script.splice(0, 1);
			modified_path_to_script = modified_path_to_script.join(folder);
		} else {
			modified_path_to_script = `.^${modified_path_to_script}`;
		}
	});

	modified_path_to_script = modified_path_to_script.slice(
		0,
		modified_path_to_script.length - 3,
	);

	modified_path_to_script = modified_path_to_script
		.split('/')
		.filter(value => !!value)
		.map(value => (value.startsWith('.^') ? value : `.\`${value}\``))
		.join('');

	if (
		modified_path_to_script.split('.').length ===
		path_to_workspace.split('/').length + path_to_script.split('/').length
	) {
		// if workspace and script are not in the same drive
		handleSetToast({
			icon: 'warning-sign',
			intent: 'danger',
			message: 'an error occured while trying to run script',
		});
	} else {
		return `import $file${modified_path_to_script}`;
	}
};
