import 'jsdom-global/register';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { mount } from 'enzyme';
import CpgScripts from './CpgScripts';
import { default_state as settings } from '../../store/reducers/settingsReducers';
import { default_state as files } from '../../store/reducers/filesReducers';
import { default_state as query } from '../../store/reducers/queryReducers';
import { default_state as workspace } from '../../store/reducers/workSpaceReducers';
import { findByTestAttr, testStore } from '../../assets/js/utils/testUtils';
import { getCpgScripts } from './cpgScriptsScripts';

const mock_workspace = {
	path: '/home/raymond/Desktop/workspace',
	projects: {
		go: {
			inputPath: '/a/b/c/d/e',
			pathToProject: null,
			open: false,
		},
		cpp: {
			inputPath: '/a/b/c/d/e/f/g',
			pathToProject: '/a/b/c/d/e/f/g/h',
			open: true,
		},
	},
};

jest.mock('@material-ui/core/styles', () => ({
	__esModule: true,
	makeStyles: jest.fn(() => () => ({})),
}));

jest.mock('./cpgScriptsScripts', () => ({
	__esModule: true,
	getCpgScripts: jest.fn(() => new Promise(r => r({}))),
}));

const setUp = (initialState = {}) => {
	const store = testStore(initialState);
	const wrapper = mount(<CpgScripts store={store} />);
	return { wrapper, store };
};

describe('CpgScripts component when workspace is empty:', () => {
	let wrapper;

	beforeEach(() => {
		const wrapper_and_store = setUp({ settings, files, query, workspace });
		wrapper = wrapper_and_store.wrapper;
	});

	it('CpgScripts.jsx Should not render if workspace is empty', () => {
		const component = findByTestAttr(wrapper, 'cpg-scripts');
		expect(component).toHaveLength(0);
	});

	it('expect makeStyles to have been called', () => {
		expect(makeStyles).toHaveBeenCalled();
	});

	it('expect getCpgScripts to have been called', () => {
		expect(getCpgScripts).toHaveBeenCalled();
	});

	afterEach(() => {
		wrapper.unmount();
	});
});

describe('CpgScripts component when workspace is not empty:', () => {
	let wrapper;

	beforeEach(() => {
		const wrapper_and_store = setUp({
			settings,
			files,
			query,
			workspace: mock_workspace,
		});
		wrapper = wrapper_and_store.wrapper;
	});

	it('CpgScripts.jsx Should not render if workspace is not empty', () => {
		const component = findByTestAttr(wrapper, 'cpg-scripts');
		expect(component).toHaveLength(1);
	});

	it('expect makeStyles to have been called', () => {
		expect(makeStyles).toHaveBeenCalled();
	});

	it('expect getCpgScripts to have been called', () => {
		expect(getCpgScripts).toHaveBeenCalled();
	});

	afterEach(() => {
		wrapper.unmount();
	});
});
