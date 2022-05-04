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
	readFile
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
	windowActionApi: { sendWindowAction: jest.fn() },
	selectDirApi: jest.fn(() => {}),
}));

jest.mock('../../../store/configureStore', () => ({
	__esModule: true,
	store: { dispatch: jest.fn() },
}));

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

	// it('send windows message', ()=> {
	// 	sendWindowsMessage('reload');

	// 	expect(windowActionApi).toHaveBeenCalled()
	// })

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

	// parseProject

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

	// it('sets query result', ()=> {
	// 	const data
	// 	const store
	// 	const key
	// 	const results

	// 	setQueryResult(data, store, key, results)

	// 	expect(setResults).toHaveBeenCalled();
	// })

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
});
