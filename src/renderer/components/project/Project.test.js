// import 'jsdom-global/register';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { mount } from 'enzyme';
import Project from './Project';
import { default_state as settings } from '../../store/reducers/settingsReducers';
import { default_state as query } from '../../store/reducers/queryReducers';
import { findByTestAttr, testStore } from '../../assets/js/utils/testUtils';

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

const setUp = (initialState = {}) => {
	const store = testStore(initialState);
	const wrapper = mount(
		<Project
			name="cpp"
			index={0}
			query={store.getState().query}
			workspace={store.getState().workspace}
			settings={store.getState().settings}
		/>,
	);
	return { wrapper, store };
};

describe('Project component:', () => {
	let wrapper;

	beforeEach(() => {
		const wrapper_and_store = setUp({
			settings,
			query,
			workspace: mock_workspace,
		});
		wrapper = wrapper_and_store.wrapper;
	});

	it('Project.jsx Should render', () => {
		const component = findByTestAttr(wrapper, 'project');
		expect(component).not.toHaveLength(0);
	});

	it('expect makeStyles to have been called', () => {
		expect(makeStyles).toHaveBeenCalled();
	});

	afterEach(() => {
		wrapper.unmount();
	});
});
