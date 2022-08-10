import 'jsdom-global/register';
import React from 'react';
import { mount } from 'enzyme';
import SideNav from './SideNav';
import { default_state as settings } from '../../store/reducers/settingsReducers';
import { findByTestAttr, testStore } from '../../assets/js/utils/testUtils';

import * as sideNavScripts from './sideNavScripts';

const handleSetState = jest.fn(() => {});

jest.mock('@material-ui/core/styles', () => ({
	__esModule: true,
	makeStyles: jest.fn(() => () => ({})),
}));

const getSettingsInitialValues = jest.spyOn(
	sideNavScripts,
	'getSettingsInitialValues',
);

const setUp = (initialState = {}) => {
	const store = testStore(initialState);
	const wrapper = mount(
		<SideNav
			store={store}
			terminalHeight=""
			drawerWidth=""
			sideNavWidth=""
			handleSetState={handleSetState}
		/>,
	);
	return { wrapper, store };
};

describe('SideNav component:', () => {
	let wrapper;

	beforeEach(() => {
		const wrapper_and_store = setUp({ settings });
		wrapper = wrapper_and_store.wrapper;
	});

	it('SideNav.jsx Should render without errors', () => {
		const component = findByTestAttr(wrapper, 'side-nav');
		expect(component).toHaveLength(1);
	});

	it('expect typeof wrapper.props().terminalHeight to be "string"', () => {
		expect(typeof wrapper.props().terminalHeight).toBe('string');
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

	it('expect getSettingsInitialValues to have been called', () => {
		expect(getSettingsInitialValues).toHaveBeenCalled();
	});

	afterEach(() => {
		wrapper.unmount();
	});
});
