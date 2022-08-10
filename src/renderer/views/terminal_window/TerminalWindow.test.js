import 'jsdom-global/register';
import React from 'react';
import { makeStyles } from '@material-ui/core';
import { mount } from 'enzyme';
import TerminalWindow from './TerminalWindow';
import { default_state as settings } from '../../store/reducers/settingsReducers';
import { default_state as query } from '../../store/reducers/queryReducers';
import { default_state as workspace } from '../../store/reducers/workSpaceReducers';
import { findByTestAttr, testStore } from '../../assets/js/utils/testUtils';
import {
	initResize,
	throttle,
	areResultsEqual,
} from '../../assets/js/utils/scripts';
import {
	initXterm,
	initCircuitUI,
	initFitAddon,
	handleMaximize,
	openXTerm,
	sendQueryResultToXTerm,
	handleAddQueryToHistory,
	handleEmptyWorkspace,
} from './terminalWindowScripts';

const terminal = {}; // to be removed when test is fixed

const handleSetState = jest.fn(() => {});

jest.mock('@material-ui/core/styles', () => ({
	__esModule: true,
	makeStyles: jest.fn(() => () => ({})),
}));

jest.mock('../../assets/js/utils/scripts', () => ({
	__esModule: true,
	throttle: jest.fn(() => () => {}),
	initResize: jest.fn(() => () => {}),
	areResultsEqual: jest.fn(() => true),
}));

jest.mock('./terminalWindowScripts', () => ({
	__esModule: true,
	initXterm: jest.fn(() => new Promise(r => r({ setOption: () => {} }))),
	handleEmptyWorkspace: jest.fn(() => true),
	handleMaximize: jest.fn(() => {}),
	handleResize: jest.fn(() => {}),
	handleAddQueryToHistory: jest.fn(() => {}),
	sendQueryResultToXTerm: jest.fn(() => true),
	openXTerm: jest.fn(() => {}),
	initFitAddon: jest.fn(() => ({ fit: () => {} })),
	initCircuitUI: jest.fn(() => () => {}),
}));

const setUp = (initialState = {}) => {
	const store = testStore(initialState);
	const wrapper = mount(
		<TerminalWindow
			store={store}
			terminalHeight=""
			topNavHeight=""
			statusBarHeight=""
			handleSetState={handleSetState}
		/>,
	);
	return { wrapper, store };
};

describe('TerminalWindow component:', () => {
	let wrapper;

	beforeEach(() => {
		const wrapper_and_store = setUp({
			settings,
			terminal,
			query,
			workspace,
		});
		wrapper = wrapper_and_store.wrapper;
	});

	it('terminalWindow.jsx Should render without errors', () => {
		const component = findByTestAttr(wrapper, 'terminal-window');
		expect(component).toHaveLength(1);
	});

	it('expect typeof wrapper.props().terminalHeight to be "string"', () => {
		expect(typeof wrapper.props().terminalHeight).toBe('string');
	});

	it('expect typeof wrapper.props().topNavHeight to be "string"', () => {
		expect(typeof wrapper.props().topNavHeight).toBe('string');
	});

	it('expect typeof wrapper.props().statusBarHeight to be "string"', () => {
		expect(typeof wrapper.props().statusBarHeight).toBe('string');
	});

	it('expect typeof wrapper.props().handleSetState "function"', () => {
		expect(typeof wrapper.props().handleSetState).toBe('function');
	});

	it('expect handleSetState to have been called', () => {
		expect(handleSetState).toHaveBeenCalled();
	});

	it('expect makeStyles to have been called', () => {
		expect(makeStyles).toHaveBeenCalled();
	});

	it('expect initXterm to have been called', () => {
		expect(initXterm).toHaveBeenCalled();
	});

	it('expect handleEmptyWorkspace to have been called', () => {
		expect(handleEmptyWorkspace).toHaveBeenCalled();
	});

	it('expect openXterm to have been called', () => {
		expect(openXTerm).toHaveBeenCalled();
	});

	it('expect initFitAddon to have been called', () => {
		expect(initFitAddon).toHaveBeenCalled();
	});

	it('expect initCircuitUI to have been called', () => {
		expect(initCircuitUI).toHaveBeenCalled();
	});

	it('expect throttle to have been called', () => {
		expect(throttle).toHaveBeenCalled();
	});

	it('expect handleMaximize to have been called', () => {
		expect(handleMaximize).toHaveBeenCalled();
	});

	it('expect handleAddQueryToHistory to not have been called', () => {
		expect(handleAddQueryToHistory).not.toHaveBeenCalled();
	});

	it('expect areResultsEqual to have been called', () => {
		expect(areResultsEqual).toHaveBeenCalled();
	});

	it('expect sendQueryResultToXterm to not have been called', () => {
		expect(sendQueryResultToXTerm).not.toHaveBeenCalled();
	});

	it('expect initResize tohave been called', () => {
		expect(initResize).toHaveBeenCalled();
	});

	afterEach(() => {
		wrapper.unmount();
	});
});
