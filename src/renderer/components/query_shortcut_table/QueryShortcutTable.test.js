// import 'jsdom-global/register';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { mount } from 'enzyme';
import { default_state as settings } from '../../store/reducers/settingsReducers';
import { default_state as query } from '../../store/reducers/queryReducers';
import { findByTestAttr, testStore } from '../../assets/js/utils/testUtils';
import QueryShortcutTable from './QueryShortcutTable';

jest.mock('@material-ui/core/styles', () => ({
	__esModule: true,
	makeStyles: jest.fn(() => () => ({})),
}));

const setUp = (initialState = {}) => {
	const store = testStore(initialState);
	const wrapper = mount(
		<QueryShortcutTable
			queries={[1,2,3]}
			keybindings={[]}
			behaviours={[]}
			backgrounds={[]}
			settings={[]}
			handleSetState={jest.fn(() => {})}
		/>,
	);
	console.log({ store });
	return { wrapper, store };
};

describe('QueryShortcutTable component:', () => {
	let wrapper;

	beforeEach(() => {
		const wrapper_and_store = setUp();
		wrapper = wrapper_and_store.wrapper;
	});

	it('should pass', () => {});

	it('should render QueryShortcutTable.jsx without errors', () => {
		const component = findByTestAttr(wrapper, 'query-shortcut-table');
		expect(component).toHaveLength(1);
	});

	it('expect makeStyles to have been called', () => {
		expect(makeStyles).toHaveBeenCalled();
	});

	afterEach(() => {
		wrapper.unmount();
	});
});
