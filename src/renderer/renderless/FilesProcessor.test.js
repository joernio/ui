// import 'jsdom-global/register';
import React from 'react';
import { mount } from 'enzyme';
import FilesProcessor from './FilesProcessor';
import { default_state as files } from '../store/reducers/filesReducers';
import { default_state as query } from '../store/reducers/queryReducers';
import { default_state as workspace } from '../store/reducers/workSpaceReducers';
import { testStore } from '../assets/js/utils/testUtils';
// import { isFilePathInQueryResult, openFile, refreshRecent, refreshOpenFiles } from '../assets/js/utils/scripts';
import * as scripts from '../assets/js/utils/scripts';
// import {
//   getFilePathToOpen,
//   isFileInRecentlyOpened,
// } from './filesProcessorScripts';

// jest.mock('./filesProcessorScripts', () => ({
//   __esModule: true,
//   getFilePathToOpen: jest.fn(() => new Promise(r => r(false))),
//   isFileInRecentlyOpened: jest.fn(() => {}),
// }));

const setUp = (initialState = {}) => {
	const store = testStore(initialState);
	const wrapper = mount(<FilesProcessor store={store} />);
	return { wrapper, store };
};

describe('FileProcessor component:', () => {
	let wrapper;
	let isFilePathInQueryResult;
	let openFile;
	let refreshRecent;
	let refreshOpenFiles;

	beforeEach(() => {
		// jest.mock('../assets/js/utils/scripts', () => ({
		//   __esModule: true,
		//   isFilePathInQueryResult: jest.fn(() => false),
		//   openFile: jest.fn(),
		//   refreshRecent: jest.fn(),
		//   refreshOpenFiles: jest.fn()
		// }));

		openFile = jest.spyOn(scripts, 'openFile').mockImplementation(() => {});
		refreshRecent = jest
			.spyOn(scripts, 'refreshRecent')
			.mockImplementation(() => {});
		refreshOpenFiles = jest
			.spyOn(scripts, 'refreshOpenFiles')
			.mockImplementation(() => {});
	});

	it('expect refreshRecent to have been called', () => {
		isFilePathInQueryResult = jest
			.spyOn(scripts, 'isFilePathInQueryResult')
			.mockImplementation(() => false);
		const wrapper_and_store = setUp({ files, query, workspace });
		wrapper = wrapper_and_store.wrapper;

		expect(refreshRecent).toHaveBeenCalled();
	});

	it('expect refreshOpenFiles to have been called', () => {
		isFilePathInQueryResult = jest
			.spyOn(scripts, 'isFilePathInQueryResult')
			.mockImplementation(() => false);
		const wrapper_and_store = setUp({ files, query, workspace });
		wrapper = wrapper_and_store.wrapper;

		expect(refreshOpenFiles).toHaveBeenCalled();
	});

	it('expect isFilePathInQueryResult to have been called', () => {
		isFilePathInQueryResult = jest
			.spyOn(scripts, 'isFilePathInQueryResult')
			.mockImplementation(() => false);
		const wrapper_and_store = setUp({ files, query, workspace });
		wrapper = wrapper_and_store.wrapper;

		expect(isFilePathInQueryResult).toHaveBeenCalled();
	});

	it('expect openFile to not have been called', () => {
		isFilePathInQueryResult = jest
			.spyOn(scripts, 'isFilePathInQueryResult')
			.mockImplementation(() => false);
		const wrapper_and_store = setUp({ files, query, workspace });
		wrapper = wrapper_and_store.wrapper;

		expect(openFile).not.toHaveBeenCalled();
	});

	it('expect openFile to have been called with "/a/b/c/d"', () => {
		isFilePathInQueryResult = jest
			.spyOn(scripts, 'isFilePathInQueryResult')
			.mockImplementation(() => '/a/b/c/d');
		const wrapper_and_store = setUp({ files, query, workspace });
		wrapper = wrapper_and_store.wrapper;

		expect(openFile).toHaveBeenCalledWith('/a/b/c/d');
	});

	afterEach(() => {
		wrapper.unmount();
		isFilePathInQueryResult.mockRestore();
		openFile.mockRestore();
		refreshRecent.mockRestore();
		refreshOpenFiles.mockRestore();
	});
});
