// import 'jsdom-global/register';
import React from 'react';
import { mount } from 'enzyme';
import WorkspaceProcessor from './WorkspaceProcessor';
import { default_state as query } from '../store/reducers/queryReducers';
import { default_state as workspace } from '../store/reducers/workSpaceReducers';
import { testStore } from '../assets/js/utils/testUtils';
import {
	processQueryResult,
	shouldProcessQueryResult,
} from './workspaceProcessorScripts';

jest.mock('./workspaceProcessorScripts', () => ({
	__esModule: true,
	shouldProcessQueryResult: jest.fn(
		obj => !!(obj && Object.keys(obj).length > 0),
	),
	processQueryResult: jest.fn(() => {}),
}));

const setUp = (initialState = {}) => {
	const store = testStore(initialState);
	const wrapper = mount(<WorkspaceProcessor store={store} />);
	return { wrapper, store };
};

describe('WorkspaceProcessor component when query.results is empty:', () => {
	let wrapper;

	beforeEach(() => {
		const wrapper_and_store = setUp({ workspace, query });
		wrapper = wrapper_and_store.wrapper;
	});

	it('expect shouldProcessQueryResult to have been called', () => {
		expect(shouldProcessQueryResult).toHaveBeenCalled();
	});

	it('expect processQueryResult to not have been called', () => {
		expect(processQueryResult).not.toHaveBeenCalled();
	});

	afterEach(() => {
		wrapper.unmount();
	});
});

describe('WorkspaceProcessor component when query.results is not empty:', () => {
	let wrapper;

	beforeEach(() => {
		const wrapper_and_store = setUp({
			workspace,
			query: { ...query, results: { a: {} } },
		});
		wrapper = wrapper_and_store.wrapper;
	});

	it('expect shouldProcessQueryResult to have been called', () => {
		expect(shouldProcessQueryResult).toHaveBeenCalled();
	});

	it('expect processQueryResult to have been called', () => {
		expect(processQueryResult).toHaveBeenCalled();
	});

	afterEach(() => {
		wrapper.unmount();
	});
});
