import 'jsdom-global/register';
import React from 'react';
import { mount } from 'enzyme';
import { ThemeProvider } from '@material-ui/core/styles';
import App from './App';
import { default_state } from './store/reducers/settingsReducers';
import { findByTestAttr, testStore } from './assets/js/utils/testUtils';
import createTheme from './assets/js/theme';
import initIPCRenderer from './assets/js/utils/ipcRenderer';
import { initShortcuts, handleFontSizeChange } from './assets/js/utils/scripts';
import WindowWrapper from './views/WindowWrapper';
import Window from './views/window/Window';
import QueryProcessor from './renderless/QueryProcessor';
import WorkspaceProcessor from './renderless/WorkspaceProcessor';
import FilesProcessor from './renderless/FilesProcessor';
import Toaster from './components/toaster/Toaster';

jest.mock('@material-ui/core/styles', () => ({
	__esModule: true,
	ThemeProvider: jest.fn(({ children }) => (
		<div data-test="theme-provider">{children}</div>
	)),
}));

jest.mock('./views/WindowWrapper', () => ({
	__esModule: true,
	default: jest.fn(({ children }) => (
		<div data-test="window-wrapper">{children}</div>
	)),
}));

jest.mock('./views/window/Window', () => ({
	__esModule: true,
	default: jest.fn(() => <div data-test="window"></div>),
}));

jest.mock('./renderless/QueryProcessor', () => ({
	__esModule: true,
	default: jest.fn(() => <div data-test="query-processor"></div>),
}));

jest.mock('./renderless/WorkspaceProcessor', () => ({
	__esModule: true,
	default: jest.fn(() => <div data-test="workspace-processor"></div>),
}));

jest.mock('./renderless/FilesProcessor', () => ({
	__esModule: true,
	default: jest.fn(() => <div data-test="files-processor"></div>),
}));

jest.mock('./components/toaster/Toaster', () => ({
	__esModule: true,
	default: jest.fn(() => <div data-test="toaster"></div>),
}));

jest.mock('./assets/js/theme', () => ({
	__esModule: true,
	default: jest.fn(() => ({})),
}));

jest.mock('./assets/js/utils/ipcRenderer', () => ({
	__esModule: true,
	default: jest.fn(() => {}),
}));

jest.mock('./assets/js/utils/scripts', () => ({
	__esModule: true,
	initShortcuts: jest.fn(() => {}),
	removeShortcuts: jest.fn(() => {}),
	handleFontSizeChange: jest.fn(() => {}),
}));

const setUp = (initialState = {}) => {
	const store = testStore(initialState);
	// const wrapper = shallow(<App store={store}/>).childAt(0).dive();
	const wrapper = mount(<App store={store} />);
	return wrapper;
};

describe('App component:', () => {
	let wrapper;
	let theme_provider;
	let window_wrapper;
	let window;
	let query_processor;
	let workspace_processor;
	let files_processor;
	let toaster;

	beforeEach(() => {
		wrapper = setUp({ settings: default_state });
		theme_provider = wrapper.find(ThemeProvider);
		window_wrapper = wrapper.find(WindowWrapper);
		window = wrapper.find(Window);
		query_processor = wrapper.find(QueryProcessor);
		workspace_processor = wrapper.find(WorkspaceProcessor);
		files_processor = wrapper.find(FilesProcessor);
		toaster = wrapper.find(Toaster);
	});

	it('app.js Should render without errors', () => {
		const component = findByTestAttr(wrapper, 'app');
		expect(component).toHaveLength(1);
	});

	it('expect createTheme to have been called', () => {
		expect(createTheme).toHaveBeenCalled();
	});

	it('expect initIPCRenderer to have been called', () => {
		expect(initIPCRenderer).toHaveBeenCalled();
	});

	it('expect initShortcuts to have been called', () => {
		expect(initShortcuts).toHaveBeenCalled();
	});

	it('expect handleFontSizeChange to have been called', () => {
		expect(handleFontSizeChange).toHaveBeenCalled();
	});

	it('expect theme_provider component.length to be 1', () => {
		const component = findByTestAttr(theme_provider, 'theme-provider');
		expect(component).toHaveLength(1);
	});

	it('expect typeof theme_provider.props().theme to be an object', () => {
		expect(typeof theme_provider.props().theme).toBe('object');
	});

	it('expect window_wrapper component.length to be 1', () => {
		const component = findByTestAttr(window_wrapper, 'window-wrapper');
		expect(component).toHaveLength(1);
	});

	it('expect window component.length to be 1', () => {
		const component = findByTestAttr(window, 'window');
		expect(component).toHaveLength(1);
	});

	it('expect query_processor component.length to be 1', () => {
		const component = findByTestAttr(query_processor, 'query-processor');
		expect(component).toHaveLength(1);
	});

	it('expect workspace_processor component.length to be 1', () => {
		const component = findByTestAttr(
			workspace_processor,
			'workspace-processor',
		);
		expect(component).toHaveLength(1);
	});

	it('expect files_processor component.length to be 1', () => {
		const component = findByTestAttr(files_processor, 'files-processor');
		expect(component).toHaveLength(1);
	});

	it('expect toaster component.length to be 1', () => {
		const component = findByTestAttr(toaster, 'toaster');
		expect(component).toHaveLength(1);
	});

	// it('expect unmounting app.js to call removeShortcuts', ()=>{
	//  wrapper.unmount();
	//  expect(removeShortcuts).toHaveBeenCalled();
	// });
});
