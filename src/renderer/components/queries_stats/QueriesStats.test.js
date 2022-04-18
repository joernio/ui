import 'jsdom-global/register';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { mount } from 'enzyme';
import QueriesStats from './QueriesStats';
import { default_state as settings } from '../../store/reducers/settingsReducers';
import { default_state as query } from '../../store/reducers/queryReducers';
import { findByTestAttr, testStore } from '../../assets/js/utils/testUtils';
import { countQueries } from './queriesStatsScripts';

jest.mock('@material-ui/core/styles', () => ({
	__esModule: true,
	makeStyles: jest.fn(() => () => ({})),
}));

jest.mock('./queriesStatsScripts', () => ({
	__esModule: true,
	countQueries: jest.fn(() => ({})),
}));

const setUp = (initialState = {}) => {
	const store = testStore(initialState);
	const wrapper = mount(<QueriesStats store={store} />);
	return { wrapper, store };
};

describe('QueriesStats component:', () => {
	let wrapper;

	beforeEach(() => {
		const wrapper_and_store = setUp({ settings, query });
		wrapper = wrapper_and_store.wrapper;
	});

	it('QueriesStats.jsx Should render', () => {
		const component = findByTestAttr(wrapper, 'queries-stats');
		expect(component).toHaveLength(1);
	});

	it('expect makeStyles to have been called', () => {
		expect(makeStyles).toHaveBeenCalled();
	});

	it('expect countQueries to have been called', () => {
		expect(countQueries).toHaveBeenCalled();
	});

	afterEach(() => {
		wrapper.unmount();
	});
});
