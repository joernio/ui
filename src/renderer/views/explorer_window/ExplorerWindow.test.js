import 'jsdom-global/register';
import React from 'react';
import { mount } from 'enzyme';
import ExplorerWindow from './ExplorerWindow';
import { default_state as settings } from '../../store/reducers/settingsReducers';
import { default_state as query } from '../../store/reducers/queryReducers';
import { findByTestAttr, testStore } from '../../assets/js/utils/testUtils';
import { initResize } from '../../assets/js/utils/scripts';

const mock_query_results = {
	sdksldksldks: {},
	dksldksdksk: {},
};

const handleSetState = jest.fn(() => {});

jest.mock('@material-ui/core/styles', () => ({
	__esModule: true,
	makeStyles: jest.fn(() => () => ({})),
}));

jest.mock('../../assets/js/utils/scripts', () => ({
	__esModule: true,
	initResize: jest.fn(() => () => {}),
}));

jest.mock('./explorerWindowScripts', () => ({
	__esModule: true,
	resizeHandler: jest.fn(() => {}),
}));

jest.mock('@blueprintjs/core', () => ({
	__esModule: true,
	Icon: jest.fn(() => <div data-test="icon"></div>),
}));

jest.mock('../../components/folders/Folders', () => ({
	__esModule: true,
	default: jest.fn(() => <div data-test="folders"></div>),
}));

jest.mock('../../components/workspace/Workspace', () => ({
	__esModule: true,
	default: jest.fn(() => <div data-test="workspace"></div>),
}));

jest.mock('../../components/cpg_scripts/CpgScripts', () => ({
	__esModule: true,
	default: jest.fn(() => <div data-test="cpg-scripts"></div>),
}));

jest.mock('../../components/open_files/OpenFiles', () => ({
	__esModule: true,
	default: jest.fn(() => <div data-test="open-files"></div>),
}));

const setUp = (initialState = {}) => {
	const store = testStore(initialState);
	const wrapper = mount(
		<ExplorerWindow
			store={store}
			drawerWidth=""
			sideNavWidth=""
			handleSetState={handleSetState}
		/>,
	);
	return { wrapper, store };
};

describe('ExplorerWindow component with query.results empty:', () => {
	let wrapper;
	let icon;
	let cpg_scripts;
	let open_files;
	let workspace;
	let folders;

	beforeEach(() => {
		const wrapper_and_store = setUp({ settings, query });
		wrapper = wrapper_and_store.wrapper;
		icon = findByTestAttr(wrapper, 'icon');
		cpg_scripts = findByTestAttr(wrapper, 'cpg-scripts');
		open_files = findByTestAttr(wrapper, 'open-files');
		workspace = findByTestAttr(wrapper, 'workspace');
		folders = findByTestAttr(wrapper, 'folders');
	});

	it('ExplorerWindow.jsx Should render without errors', () => {
		const component = findByTestAttr(wrapper, 'explorer-window');
		expect(component).toHaveLength(1);
	});

	it('expect typeof wrapper.props().drawerWidth to be "string"', () => {
		expect(typeof wrapper.props().drawerWidth).toBe('string');
	});

	it('expect typeof wrapper.props().sideNavWidth to be "string"', () => {
		expect(typeof wrapper.props().sideNavWidth).toBe('string');
	});

	it('expect typeof wrapper.props().handleSetState "function"', () => {
		expect(typeof wrapper.props().handleSetState).toBe('function');
	});

	it('expect initResize to have been called', () => {
		expect(initResize).toHaveBeenCalled();
	});

	it('expect icon.length to be 1, when query.results is empty', () => {
		expect(icon).toHaveLength(1);
	});

	it('expect cpg_scripts.length to be 0, when query.results is empty', () => {
		expect(cpg_scripts).toHaveLength(0);
	});

	it('expect open_files.length to be 0, when query.results is empty', () => {
		expect(open_files).toHaveLength(0);
	});

	it('expect workspace.length to be 0, when query.results is empty', () => {
		expect(workspace).toHaveLength(0);
	});

	it('expect folders.length to be 0, when query.results is empty', () => {
		expect(folders).toHaveLength(0);
	});

	afterEach(() => {
		wrapper.unmount();
	});
});

describe('ExplorerWindow component with query.results not empty:', () => {
	let wrapper;
	let icon;
	let cpg_scripts;
	let open_files;
	let workspace;
	let folders;

	beforeEach(() => {
		const wrapper_and_store = setUp({
			settings,
			query: { ...query, results: mock_query_results },
		});
		wrapper = wrapper_and_store.wrapper;
		icon = findByTestAttr(wrapper, 'icon');
		cpg_scripts = findByTestAttr(wrapper, 'cpg-scripts');
		open_files = findByTestAttr(wrapper, 'open-files');
		workspace = findByTestAttr(wrapper, 'workspace');
		folders = findByTestAttr(wrapper, 'folders');
	});

	it('ExplorerWindow.jsx Should render without errors', () => {
		const component = findByTestAttr(wrapper, 'explorer-window');
		expect(component).toHaveLength(1);
	});

	it('expect typeof wrapper.props().drawerWidth to be "string"', () => {
		expect(typeof wrapper.props().drawerWidth).toBe('string');
	});

	it('expect typeof wrapper.props().sideNavWidth to be "string"', () => {
		expect(typeof wrapper.props().sideNavWidth).toBe('string');
	});

	it('expect typeof wrapper.props().handleSetState "function"', () => {
		expect(typeof wrapper.props().handleSetState).toBe('function');
	});

	it('expect initResize to have been called', () => {
		expect(initResize).toHaveBeenCalled();
	});

	it('expect icon.length to be 0, when query.results is not empty', () => {
		expect(icon).toHaveLength(0);
	});

	it('expect cpg_scripts.length to be 1, when query.results is not empty', () => {
		expect(cpg_scripts).toHaveLength(1);
	});

	it('expect open_files.length to be 1, when query.results is not empty', () => {
		expect(open_files).toHaveLength(1);
	});

	it('expect workspace.length to be 1, when query.results is not empty', () => {
		expect(workspace).toHaveLength(1);
	});

	it('expect folders.length to be 1, when query.results is not empty', () => {
		expect(folders).toHaveLength(1);
	});

	afterEach(() => {
		wrapper.unmount();
	});
});
