// import 'jsdom-global/register';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { mount } from 'enzyme';
import { default_state as settings } from '../../store/reducers/settingsReducers';
import { default_state as query } from '../../store/reducers/queryReducers';
import { findByTestAttr, testStore } from '../../assets/js/utils/testUtils';
import QueryShortcutsViewer from './QueryShortcutsViewer';

jest.mock('@material-ui/core/styles', () => ({
	__esModule: true,
	makeStyles: jest.fn(() => () => ({})),
}));

const setUp = (initialState = {}) => {
	const store = testStore(initialState);
	const wrapper = mount(
			<QueryShortcutsViewer store={store}/>
	);
	return { wrapper, store };
};

describe('QueryShortcutsViewer component:', () => {
	let wrapper;

	beforeEach(() => {
		const wrapper_and_store = setUp({ settings, query });
		wrapper = wrapper_and_store.wrapper;
	});

	it('should render QueryShortcutsViewer.jsx without errors', () => {
		const component = findByTestAttr(
			wrapper,
			'query-shortcuts-viewer',
		);
		expect(component).toHaveLength(1);
	});

	it('expect makeStyles to have been called', () => {
		expect(makeStyles).toHaveBeenCalled();
	});

	afterEach(() => {
		wrapper.unmount();
	});
});
