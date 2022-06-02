// import 'jsdom-global/register';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { mount } from 'enzyme';
import { default_state as settings } from '../../store/reducers/settingsReducers';
import { default_state as query } from '../../store/reducers/queryReducers';
import { findByTestAttr, testStore } from '../../assets/js/utils/testUtils';
import QueryShortcutWithArgsDialog from './QueryShortcutWithArgsDialog';

jest.mock('@material-ui/core/styles', () => ({
	__esModule: true,
	makeStyles: jest.fn(() => () => ({})),
}));

const setUp = (initialState = {}) => {
	const store = testStore(initialState);
	const wrapper = mount(
			<QueryShortcutWithArgsDialog store={store}/>
	);
	return { wrapper, store };
};

describe('QueryShortcutWithArgsDialog component:', () => {
	let wrapper;

	beforeEach(() => {
		const wrapper_and_store = setUp({ settings, query });
		wrapper = wrapper_and_store.wrapper;
	});

	it('should render QueryShortcutWithArgsDialog.jsx without errors', () => {
		const component = findByTestAttr(
			wrapper,
			'query-shortcut-with-args-dialog',
		);
		expect(component).toHaveLength(0);
	});

	it('expect makeStyles to have been called', () => {
		expect(makeStyles).toHaveBeenCalled();
	});

	afterEach(() => {
		wrapper.unmount();
	});
});
