// import 'jsdom-global/register';
import React from 'react';
import { mount } from 'enzyme';
import { makeStyles } from '@material-ui/core/styles';
import { findByTestAttr } from '../../assets/js/utils/testUtils';
import Window from './Window';
import { getWindowHeight } from './windowScripts';
import ExplorerWindow from '../explorer_window/ExplorerWindow';
import EditorWindow from '../editor_window/EditorWindow';
import TerminalWindow from '../terminal_window/TerminalWindow';
import SideNav from '../side_nav/SideNav';

jest.mock('@material-ui/core/styles', () => ({
	__esModule: true,
	makeStyles: jest.fn(() => () => ({})),
}));

jest.mock('../explorer_window/ExplorerWindow', () => ({
	__esModule: true,
	default: jest.fn(() => <div data-test="explorer-window"></div>),
}));

jest.mock('../editor_window/EditorWindow', () => ({
	__esModule: true,
	default: jest.fn(() => <div data-test="editor-window"></div>),
}));

jest.mock('../terminal_window/TerminalWindow', () => ({
	__esModule: true,
	default: jest.fn(() => <div data-test="terminal-window"></div>),
}));

jest.mock('../side_nav/SideNav', () => ({
	__esModule: true,
	default: jest.fn(() => <div data-test="side-nav"></div>),
}));

jest.mock('./windowScripts', () => ({
	__esModule: true,
	getWindowHeight: jest.fn(() => 1000),
}));

const setUp = () => {
	const wrapper = mount(<Window />);
	return wrapper;
};

describe('App component:', () => {
	let wrapper;
	let explorer_window;
	let editor_window;
	let terminal_window;
	let side_nav;

	beforeEach(() => {
		wrapper = setUp();
		explorer_window = wrapper.find(ExplorerWindow);
		editor_window = wrapper.find(EditorWindow);
		terminal_window = wrapper.find(TerminalWindow);
		side_nav = wrapper.find(SideNav);
	});

	it('Window.jsx Should render without errors', () => {
		const component = findByTestAttr(wrapper, 'window');
		expect(component).toHaveLength(1);
	});

	it('expect makeStyles to have been called', () => {
		expect(makeStyles).toHaveBeenCalled();
	});

	it('expect getWindowHeight to have been called', () => {
		expect(getWindowHeight).toHaveBeenCalled();
	});

	it('expect explorer_window component.length to be 1', () => {
		const component = findByTestAttr(explorer_window, 'explorer-window');
		expect(component).toHaveLength(1);
	});

	it("expect typeof explorer_window.props().drawerWidth to be an 'string'", () => {
		expect(typeof explorer_window.props().drawerWidth).toBe('string');
	});

	it("expect typeof explorer_window.props().sideNavWidth to be an 'string'", () => {
		expect(typeof explorer_window.props().sideNavWidth).toBe('string');
	});

	it("expect typeof explorer_window.props().handleSetState to be an 'function'", () => {
		expect(typeof explorer_window.props().handleSetState).toBe('function');
	});

	it('expect editor_window component.length to be 1', () => {
		const component = findByTestAttr(editor_window, 'editor-window');
		expect(component).toHaveLength(1);
	});

	it("expect typeof editor_window.props().drawerWidth to be an 'string'", () => {
		expect(typeof editor_window.props().drawerWidth).toBe('string');
	});

	it("expect typeof editor_window.props().sideNavWidth to be an 'string'", () => {
		expect(typeof editor_window.props().sideNavWidth).toBe('string');
	});

	it('expect terminal_window component.length to be 1', () => {
		const component = findByTestAttr(terminal_window, 'terminal-window');
		expect(component).toHaveLength(1);
	});

	it("expect typeof terminal_window.props().terminalHeight to be an 'string'", () => {
		expect(typeof terminal_window.props().terminalHeight).toBe('string');
	});

	it("expect typeof terminal_window.props().topNavHeight to be an 'string'", () => {
		expect(typeof terminal_window.props().topNavHeight).toBe('string');
	});

	it("expect typeof terminal_window.props().statusBarHeight to be an 'string'", () => {
		expect(typeof terminal_window.props().statusBarHeight).toBe('string');
	});

	it("expect typeof terminal_window.props().handleSetState to be an 'function'", () => {
		expect(typeof terminal_window.props().handleSetState).toBe('function');
	});

	it('expect side_nav component.length to be 1', () => {
		const component = findByTestAttr(side_nav, 'side-nav');
		expect(component).toHaveLength(1);
	});

	it("expect typeof side_nav.props().terminalHeight to be an 'string'", () => {
		expect(typeof side_nav.props().terminalHeight).toBe('string');
	});

	it("expect typeof side_nav.props().drawerWidth to be an 'string'", () => {
		expect(typeof side_nav.props().drawerWidth).toBe('string');
	});

	it("expect typeof side_nav.props().sideNavWidth to be an 'string'", () => {
		expect(typeof side_nav.props().sideNavWidth).toBe('string');
	});

	it("expect typeof side_nav.props().handleSetState to be an 'function'", () => {
		expect(typeof side_nav.props().handleSetState).toBe('function');
	});

	afterEach(() => {
		wrapper.unmount();
	});
});
