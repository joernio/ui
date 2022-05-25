import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import DotGraphViewer from './DotGraphViewer';
import { default_state as settings } from '../../store/reducers/settingsReducers';
import { findByTestAttr, testStore } from '../../assets/js/utils/testUtils';
import { mount } from 'enzyme';

jest.mock('@material-ui/core/styles', () => ({
	__esModule: true,
	makeStyles: jest.fn(() => () => ({})),
}));

const setUp = (initialState = {}) => {
	const store = testStore(initialState);
	const wrapper = mount(<DotGraphViewer store={store} />);
	return { wrapper, store };
};

describe('DotGraphView component ', () => {
	let wrapper;

	beforeEach(() => {
		const wrapper_and_store = setUp({ settings });
		wrapper = wrapper_and_store.wrapper;
	});

	it('should render DotGraphViewer with EditorWindowBanner Component', () => {
		const component = findByTestAttr(wrapper, 'editor-window-banner');
		expect(component).toHaveLength(1);
	});

    it('should render a section on no error', ()=> {
        const component = findByTestAttr(wrapper, 'dot-graph-on-no-error');
		expect(component).toHaveLength(1);
    })

    // it('should render a section on error', ()=> {
    //     const component = findByTestAttr(wrapper, 'dot-graph-on-error');
	// 	expect(component).toHaveLength(1);
    // })

    it('expect makeStyles to have been called', () => {
		expect(makeStyles).toHaveBeenCalled();
	});
    
	afterEach(() => {
		wrapper.unmount();
	});
});
