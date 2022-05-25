// import 'jsdom-global/register';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { mount } from 'enzyme';
import { findByTestAttr, testStore } from '../../assets/js/utils/testUtils';
import EditorWindowBanner from './EditorWindowBanner';

jest.mock('@material-ui/core/styles', () => ({
	__esModule: true,
	makeStyles: jest.fn(() => () => ({})),
}));

describe('EditorTabs component when message is not empty', () => {
	let wrapper;

	beforeEach(() => {
        const setUp = (initialState = {}) => {
            const store = testStore(initialState);
            const wrapper = mount(<EditorWindowBanner message={'show banner'} />);
            return { wrapper, store };
        };

		const wrapper_and_store = setUp();
		wrapper = wrapper_and_store.wrapper;
	});

	it('EditorWindowBanner.jsx Should render', () => {
		const component = findByTestAttr(wrapper, 'editor-window-banner');
		expect(component).toHaveLength(1);
	});

	it('expect makeStyles to have been called', () => {
		expect(makeStyles).toHaveBeenCalled();
	});

	afterEach(() => {
		wrapper.unmount();
	});
});


describe('EditorTabs component when message is empty', () => {
	let wrapper;

	beforeEach(() => {
        const setUp = (initialState = {}) => {
            const store = testStore(initialState);
            const wrapper = mount(<EditorWindowBanner message={''} />);
            return { wrapper, store };
        };

		const wrapper_and_store = setUp();
		wrapper = wrapper_and_store.wrapper;
	});

	it('EditorWindowBanner.jsx Should not render', () => {
		const component = findByTestAttr(wrapper, 'editor-window-banner');
		expect(component).toHaveLength(0);
	});

	afterEach(() => {
		wrapper.unmount();
	});
});

