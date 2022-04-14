import 'jsdom-global/register';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { mount } from 'enzyme';
import Workspace from './Workspace';
import { default_state as settings } from '../../store/reducers/settingsReducers';
import { default_state as query } from '../../store/reducers/queryReducers';
import { default_state as workspace } from '../../store/reducers/workSpaceReducers';
import { findByTestAttr, testStore } from '../../assets/js/utils/testUtils';
// import Project from "../project/Project";

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

jest.mock('../../components/project/Project', () => ({
	__esModule: true,
	default: jest.fn(() => <div data-test="project"></div>),
}));

const setUp = (initialState = {}) => {
	const store = testStore(initialState);
	const wrapper = mount(<Workspace store={store} />);
	return { wrapper, store };
};

describe('Workspace component when workspace is empty:', () => {
	let wrapper;
	let project;

	beforeEach(() => {
		const wrapper_and_store = setUp({ settings, query, workspace });
		wrapper = wrapper_and_store.wrapper;
		project = findByTestAttr(wrapper, 'project');
	});

	it('Workspace.jsx Should render', () => {
		const component = findByTestAttr(wrapper, 'workspace');
		expect(component).toHaveLength(1);
	});

	it('expect makeStyles to have been called', () => {
		expect(makeStyles).toHaveBeenCalled();
	});

	it('expect project.length to be 0, when workspace is empty', () => {
		expect(project).toHaveLength(0);
	});

	afterEach(() => {
		wrapper.unmount();
	});
});

describe('Workspace component when workspace is not empty:', () => {
	let wrapper;
	let project;

	beforeEach(() => {
		const wrapper_and_store = setUp({
			settings,
			query,
			workspace: mock_workspace,
		});
		wrapper = wrapper_and_store.wrapper;
		project = findByTestAttr(wrapper, 'project');
	});

	it('Workspace.jsx Should render', () => {
		const component = findByTestAttr(wrapper, 'workspace');
		expect(component).toHaveLength(1);
	});

	it('expect makeStyles to have been called', () => {
		expect(makeStyles).toHaveBeenCalled();
	});

	it('expect project.length to not be 0, when workspace is not empty', () => {
		expect(project).not.toHaveLength(0);
	});

	afterEach(() => {
		wrapper.unmount();
	});
});
