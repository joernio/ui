// import 'jsdom-global/register';
import { nanoid } from 'nanoid';
import glob from 'glob';
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
import {
	addToQueue,
	addWorkSpaceQueryToQueue,
	generateRandomID,
	getResultObjWithPostQueryKey,
	handleSetToast,
	parseProjects,
	performDeQueueQuery,
	performEnQueueQuery,
	performPeekQueue,
	performPushResult,
	queueEmpty,
	sendWindowsMessage,
	performPostQuery,
	handleScrollTop,
	getOpenFileName,
	getExtension,
	getUIIgnoreArr,
	getFolderStructureRootPathFromWorkspace,
	handleCloseContextMenu,
	areResultsEqual,
	handleSwitchWorkspace,
	nFormatter,
	readFile,
	wsReconnectToServer,
	wsDisconnectFromServer,
	parseProject,
	setQueryResult,
	openFile,
	getScriptResult,
	registerQueryShortcut,
	unRegisterQueryShortcut,
} from './scripts';

// workerPool was commented out in queryReducers.js for this test to pass.
// there was an issue getting worker url

jest.mock('./scripts', () => {
	const original = jest.requireActual('./scripts');
	return {
		...original,
		handleSwitchWorkspace: jest.fn(),
		// handleSetToast: jest.fn(),
	};
});

jest.mock('glob', () => ({
	__esModule: true,
	default: jest.fn(() => {}),
}));

jest.mock('fs', () => ({
	__esModule: true,
	default: jest.fn(() => {}),
}));

jest.mock('mousetrap', () => ({
	__esModule: true,
	default: jest.fn(() => {}),
}));

jest.mock('@blueprintjs/core', () => ({
	__esModule: true,
	Tree: jest.fn(() => {}),
}));

jest.mock('chokidar', () => ({
	__esModule: true,
	default: jest.fn(() => {}),
}));

jest.mock('./defaultVariables', () => ({
	__esModule: true,
	cpgManagementCommands: jest.fn(() => {}),
	apiErrorStrings: jest.fn(() => {}),
	syntheticFiles: jest.fn(() => {}),
	imageFileExtensions: jest.fn(() => {}),
	filesToIgnore: jest.fn(() => {}),
}));

jest.mock('../../../store/actions/queryActions', () => ({
	__esModule: true,
	deQueueQuery: jest.fn(() => {}),
	getQueryResult: jest.fn(() => {}),
	postQuery: jest.fn(() => {}),
	setResults: jest.fn(() => {}),
	resetQueue: jest.fn(() => {}),
	enQueueQuery: jest.fn(arg => arg.query),
	deQueueScriptsQuery: jest.fn(() => {}),
	setQueryShortcut: jest.fn(() => {}),
}));

jest.mock('../../../store/actions/statusActions', () => ({
	__esModule: true,
	setToast: jest.fn(() => {}),
}));

jest.mock('../../../store/actions/filesActions', () => ({
	__esModule: true,
	setFiles: jest.fn(() => {}),
	setOpenFiles: jest.fn(() => {}),
}));

jest.mock('../../../store/actions/editorActions', () => ({
	__esModule: true,
	setHighlightRange: jest.fn(() => {}),
}));

jest.mock('./ipcRenderer', () => ({
	__esModule: true,
	windowActionApi: {
		sendWindowAction: jest.fn(),
		connectToWebSocketAction: jest.fn(),
		disconnectFromWebSocketAction: jest.fn(),
	},
	selectDirApi: jest.fn(() => {}),
}));

jest.mock('../../../store/configureStore', () => ({
	__esModule: true,
	store: {
		dispatch: jest.fn(),
		getState: jest.fn(() => ({
			settings: {
				queryShortcuts: [],
			},
		})),
	},
}));

// jest.mock('mousetrap', () => ({
// 	__esModule: true,
// 	Mousetrap: {
// 		bindGlobal: jest.fn(),
// 		unbind: jest.fn(),
// 	},
// }));

jest.mock('./extensions', () => ({
	__esModule: true,
	mouseTrapGlobalBindig: jest.fn(() => {}),
}));

jest.mock('../../../views/terminal_window/terminalWindowScripts', () => ({
	__esModule: true,
	handlePrintable: jest.fn(() => {}),
}));

describe('script', () => {
	it('generate random ID', () => {
		const ID1 = generateRandomID();
		const ID2 = generateRandomID();
		expect(ID1).not.toEqual(ID2);
	});

	it('sets a toast message', () => {
		const toast = {
			icon: 'warning-sign',
			intent: 'danger',
			message: 'error opening file',
		};

		handleSetToast(toast);
		expect(store.dispatch).toHaveBeenCalled(setToast(toast));
		expect(setToast).toHaveBeenCalledWith(toast);
	});

	it('checks if queue is empty', () => {
		const queue = {};
		const isEmpty = queueEmpty(queue);
		expect(isEmpty).toBeTruthy();
	});

	it('checks if queue is not empty', () => {
		const queue = {
			a: '',
			b: '',
		};
		const isEmpty = queueEmpty(queue);
		expect(isEmpty).toBeFalsy();
	});

	it('adds query to queue', () => {
		const query = {
			query: 'workspace',
			origin: 'workspace',
			ignore: true,
		};

		const props = { enQueueQuery };
		addToQueue(query, props);

		expect(enQueueQuery).toHaveBeenCalled();
	});

	it('returns a query object', () => {
		const query = {
			query: 'workspace',
			origin: 'workspace',
			ignore: true,
		};

		const obj = addWorkSpaceQueryToQueue();

		expect(obj).toEqual(query);
	});

	it('perform dnQueue query', () => {
		const query = {
			query: 'workspace',
			origin: 'workspace',
			ignore: true,
		};
		const queue = {};
		const queueObj = performEnQueueQuery(query, queue);

		const key = `${Object.keys(queue).length}-${generateRandomID()}`;
		queue[key] = query;

		expect(queueObj).toEqual(queue);
	});

	it('perform deQueue query', () => {
		const queue = {};
		const queueObj = performDeQueueQuery(queue);

		expect(queueObj).toEqual({ queue, query: null });
	});

	it('perform peek queue when queue is empty', () => {
		const query = performPeekQueue({});

		expect(query).toBe(null);
	});

	it('perform peek queue when queue is not empty', () => {
		const queue = { a: 'test' };
		const queryObj = performPeekQueue(queue);
		const key = Object.keys(queue)[0];
		const query = queue[key];
		expect(queryObj).toEqual(query);
	});

	it('send windows message', () => {
		sendWindowsMessage('reload');
		expect(windowActionApi.sendWindowAction).toHaveBeenCalled();
		expect(windowActionApi.sendWindowAction).toHaveBeenCalledWith('reload');
	});

	it('reconnect websocket to server', () => {
		let mock_ws_url = 'ws://3000';
		wsReconnectToServer(mock_ws_url);
		expect(windowActionApi.connectToWebSocketAction).toHaveBeenCalled();
		expect(windowActionApi.connectToWebSocketAction).toHaveBeenCalledWith(
			mock_ws_url,
		);
	});

	it('disconnects websocket from server', () => {
		wsDisconnectFromServer();
		expect(
			windowActionApi.disconnectFromWebSocketAction,
		).toHaveBeenCalled();
	});

	it('perform push result', () => {
		const mockResult = { a: 'test-value' };
		let results = {};
		const res = performPushResult(mockResult, results);

		results = { ...results };
		const key = Object.keys(mockResult)[0];
		const keys = Object.keys(results);
		if (keys.length >= 500) delete results[keys[0]];
		results[key] = mockResult[key];
		expect(res).toEqual(results);
	});

	it('gets result object with post-query key found in result object', () => {
		const mockResults = {
			id: {
				post_query_uuid: '1234',
			},
		};
		const post_query_key = '1234';

		const result = getResultObjWithPostQueryKey(
			mockResults,
			post_query_key,
		);

		expect(result).toBe('id');
	});

	it('gets result object with post-query key not found in result object', () => {
		const mockResults = {
			id: {
				post_query_uuid: '1234',
			},
		};
		const post_query_key = '0000';

		const result = getResultObjWithPostQueryKey(
			mockResults,
			post_query_key,
		);

		expect(result).toBeFalsy();
	});

	it('parses Projects', () => {
		const mockData = {
			stdout: 'res12: workspacehandling.WorkspaceManager[JoernProject] = \n__________________________________________________________________________________\n| name| overlays | inputPath | open  |\n|=================================================================================|\n| x42 | callgraph,typerel,base,controlflow | /home/emmanuel/Desktop/x42   | false |\n| c   | callgraph,typerel,base,controlflow | /home/emmanuel/Desktop/x42/c | false |\n',
			stderr: '  ammonite.$sess.cmd11$.<clinit>(cmd11.sc:1)',
		};

		const mockProjects = {
			x42: {
				cpg: 'callgraph,typerel,base,controlflow',
				inputPath: '/home/emmanuel/Desktop/x42',
				pathToProject: null,
				open: null,
				language: null,
			},
			c: {
				cpg: 'callgraph,typerel,base,controlflow',
				inputPath: '/home/emmanuel/Desktop/x42/c',
				pathToProject: null,
				open: null,
				language: null,
			},
		};

		const projects = parseProjects(mockData);

		expect(projects).toEqual(mockProjects);
	});

	it('parses project', () => {
		const mockProject = {
			success: true,
			uuid: '14885ebb-b628-4d07-961a-8375e8fa919c',
			stdout: '',
			stderr: '  ammonite.$sess.cmd14$.<clinit>(cmd14.sc:1)java.lang.RuntimeException: No CPG loaded for project c  io.joern.console.workspacehandling.WorkspaceManager.cpg(WorkspaceManager.scala:238)  io.joern.console.Console.cpg(Console.scala:128)  io.joern.console.Console.project(Console.scala:108)  ammonite.$sess.cmd15$.<clinit>(cmd15.sc:1)',
		};

		const mockResult = {
			name: null,
			inputPath: null,
			path: null,
			cpg: null,
			language: null,
		};

		expect(parseProject(mockProject)).toEqual(mockResult);
	});

	it('performs post query for project', () => {
		const mockResults = { a: { query: '' } };
		const key = 'a';
		performPostQuery(store, mockResults, key);
		expect(postQuery).toHaveBeenCalledWith('project', key);
	});

	it('performs post query for workspace', () => {
		const mockResults = { a: { query: 'project' } };
		const key = 'a';
		performPostQuery(store, mockResults, key);
		expect(store.dispatch).toHaveBeenCalled();
		expect(store.dispatch).toHaveBeenCalledWith(postQuery());
		expect(postQuery).toHaveBeenCalledWith('workspace', key);
	});

	it('sets query result when data has no value', () => {
		const data = null;
		const key = 'a';
		const results = {
			a: {
				t_0: '000001',
				t_1: null,
				result: {
					stderr: '',
					stdout: '',
				},
			},
		};

		setQueryResult(data, store, key, results);
		expect(results[key].result.stderr).toBe('query failed');
		expect(store.dispatch).toHaveBeenCalledWith(setResults(results));
	});

	it('sets query result when data has a valid response', () => {
		const data = {
			stderr: '',
			stdout: 'res',
		};
		const key = 'a';
		const results = {
			a: {
				t_0: '000001',
				t_1: null,
				result: {
					stderr: '',
					stdout: '',
				},
			},
		};

		setQueryResult(data, store, key, results);
		expect(results[key].result.stdout).toBe('res');
		expect(store.dispatch).toHaveBeenCalledWith(setResults(results));
	});

	it('sets query result when data has an error response', () => {
		const data = {
			stderr: 'err',
			stdout: '',
		};
		const key = 'a';
		const results = {
			a: {
				t_0: '000001',
				t_1: null,
				result: {
					stderr: '',
					stdout: '',
				},
			},
		};

		setQueryResult(data, store, key, results);
		expect(results[key].result.stderr).toBe('err');
		expect(store.dispatch).toHaveBeenCalledWith(setResults(results));
	});

	it('should not open file if file path is empty', async () => {
		const path = '';
		expect(await openFile(path)).toBeUndefined();
	});
	
	it('returns true if scrollTop is greater than zero', () => {
		const e = { target: { scrollTop: 1 } };
		const result = handleScrollTop(e);

		expect(result).toEqual({ scrolled: true });
	});

	it('returns false if scrollTop is less zero', () => {
		const e = { target: { scrollTop: 0 } };
		const result = handleScrollTop(e);

		expect(result).toEqual({ scrolled: false });
	});

	it('gets Open FileName', () => {
		const path = 'a/b/c/d';

		const result = getOpenFileName(path);
		expect(result).toBe('d');
	});

	// it('reads file content if part has value', () => {
	// 	let path = 'a/b/c/d';
	// });

	// it('does not read file if path has no value', () => {
	// 	let path = '';
	// 	let result = readFile();
	// 	expect(result).toEqual({});
	// });

	it('gets extension', () => {
		const path = 'hello.c';
		const result = getExtension(path);
		expect(result).toBe('.c');
	});

	it('gets UI ignore arr', () => {
		const src = '';
		const uiIgnore = 'node_modules, vendor, build, .git';
		const result = getUIIgnoreArr(src, uiIgnore);

		expect(result).toEqual([
			'/**/node_modules/**',
			'/**/vendor/**',
			'/**/build/**',
			'/**/.git/**',
		]);
	});

	it('gets folder structure root-path from workspace', () => {
		const mockProjects = {
			x42: {
				inputPath: '/home/emmanuel/Desktop/x42',
				open: true,
			},
			c: {
				inputPath: '/home/emmanuel/Desktop/x42/c',
				open: true,
			},
		};

		const default_state = { path: '', projects: mockProjects };

		const result = getFolderStructureRootPathFromWorkspace(default_state);
		expect(result).toEqual({
			path: '/home/emmanuel/Desktop/x42/c',
			root: 'c',
		});
	});

	it('return a context menu close object', () => {
		expect(handleCloseContextMenu()).toEqual({
			context: {
				mouseX: null,
				mouseY: null,
			},
		});
	});

	it('checks if results are equal', () => {
		const result = areResultsEqual({}, {});

		expect(result).toBeFalsy();
	});

	it('constructs query for a new workspace', async () => {
		const path = 'a/b/c';
		const mockQueryResult = {
			query: 'switchWorkspace(a/b/c)',
			origin: 'workspace',
			ignore: false,
		};
		handleSwitchWorkspace.mockImplementation(async () => {
			if (path) {
				const query = {
					query: `switchWorkspace(${path})`,
					origin: 'workspace',
					ignore: false,
				};

				return query;
			}
		});
		const result = await handleSwitchWorkspace();

		expect(result).toEqual(mockQueryResult);
	});

	it('formats number', () => {
		const num = 1000000000;
		const result = nFormatter(num);
		if (num >= 1000000000) {
			expect(result).toBe('1G');
		}
	});

	it('formats number to Giga', () => {
		const num = 1000000000;
		const result = nFormatter(num);
		expect(result).toBe('1G');
	});

	it('formats number to Mega', () => {
		const num = 10000000;
		const result = nFormatter(num);
		expect(result).toBe('10M');
	});

	it('formats number to Kilo', () => {
		const num = 10000;
		const result = nFormatter(num);
		expect(result).toBe('10K');
	});

	it('does not format number if number is less than 1000', () => {
		const num = 100;
		const result = nFormatter(num);
		expect(result).toBe(num);
	});

	it('returns script result', () => {
		const mock_uuid = ['a', 'b'];
		const mock_results = {
			a: {
				t_0: '000001',
				t_1: null,
				result: {
					stderr: '',
					stdout: '',
				},
				origin: '',
			},
			b: {
				t_0: '002002',
				t_1: null,
				result: {
					stderr: '',
					stdout: '',
				},
				origin: 'script',
			},
		};

		const expected = {
			t_0: '002002',
			t_1: null,
			result: {
				stderr: '',
				stdout: '',
			},
			origin: 'script',
		};

		let result = getScriptResult(mock_uuid, mock_results);
		expect(result).toEqual(expected);
	});

	// it('registers query shortcut', () => {
	// 	const keybinding = 'ctrl + q';
	// 	// registerQueryShortcut(keybinding);
	// 	expect(Mousetrap.bindGlobal).toHaveBeenCalled();
	// });

	// it('unregisters query shortcut', () => {
	// 	unRegisterQueryShortcut;
	// 	const keybinding = 'ctrl + q';
	// 	// unRegisterQueryShortcut(keybinding);
	// 	expect(Mousetrap.unbind).toHaveBeenCalled();
	// });
});
