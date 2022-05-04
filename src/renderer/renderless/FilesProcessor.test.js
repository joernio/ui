// import 'jsdom-global/register';
import React from 'react';
import { mount } from 'enzyme';
import FilesProcessor from './FilesProcessor';
import { default_state as files } from '../store/reducers/filesReducers';
import { default_state as query } from '../store/reducers/queryReducers';
import { default_state as workspace } from '../store/reducers/workSpaceReducers';
import { testStore } from '../assets/js/utils/testUtils';
// import { isFilePathInQueryResult, openFile, refreshRecent, refreshOpenFiles } from '../assets/js/utils/scripts';
import {refreshOpenFiles, refreshRecent} from '../assets/js/utils/scripts';
import { processFiles } from './filesProcessorScripts';

// import {
//   getFilePathToOpen,
//   isFileInRecentlyOpened,
// } from './filesProcessorScripts';

// jest.mock('./filesProcessorScripts', () => ({
//   __esModule: true,
//   getFilePathToOpen: jest.fn(() => new Promise(r => r(false))),
//   isFileInRecentlyOpened: jest.fn(() => {}),
// }));

jest.mock('./filesProcessorScripts', () => ({
	__esmodule: true,
	processFiles: jest.fn(async () => {}),
}));

jest.mock('../assets/js/utils/scripts', () => ({
	__esModule: true,
	refreshRecent: jest.fn(() => {}),
	refreshOpenFiles: jest.fn(() => {}),
}));

const setUp = (initialState = {}) => {
	const store = testStore(initialState);
	const wrapper = mount(<FilesProcessor store={store} />);
	return { wrapper, store };
};

describe('FileProcessor component:', () => {
	let wrapper;

	beforeEach(() => {
		const wrapper_and_store = setUp({ files, query, workspace });
		wrapper = wrapper_and_store.wrapper;
	});

	it('expect refreshRecent to have been called', () => {	
		expect(refreshRecent).toHaveBeenCalled();
	});

	it('expect refreshOpenFiles to have been called', () => {
		expect(refreshOpenFiles).toHaveBeenCalled();
	});

	it('expect processFiles to have been called', ()=> {
		expect(processFiles).toHaveBeenCalled();
	})

	afterEach(() => {
		wrapper.unmount();
	});
});
