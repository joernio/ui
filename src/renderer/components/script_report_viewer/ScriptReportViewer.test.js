// import 'jsdom-global/register';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { mount } from 'enzyme';
import { default_state as settings } from '../../store/reducers/settingsReducers';
import { findByTestAttr, testStore } from '../../assets/js/utils/testUtils';
import ScriptReportViewer from './ScriptReportViewer';

jest.mock('@material-ui/core/styles', () => ({
	__esModule: true,
	makeStyles: jest.fn(() => () => ({})),
}));

const setUp = (initialState = {}) => {
	const store = testStore(initialState);
	const wrapper = mount(
		<ScriptReportViewer
			bannerMessage="hjk"
			store={store}
			path="a/b/c"
			content={`
            c 
            on 
            tent
            `}
		/>,
	);
	return { wrapper, store };
};

describe('ScriptReportViewer component:', () => {
	let wrapper;

	beforeEach(() => {
		const wrapper_and_store = setUp({ settings });
		wrapper = wrapper_and_store.wrapper;
	});

	it('should render ScriptReportViewer.jsx without errors', () => {
		const component = findByTestAttr(wrapper, 'script-report-viewer');
		expect(component).toHaveLength(1);
	});

	it('expect makeStyles to have been called', () => {
		expect(makeStyles).toHaveBeenCalled();
	});

	afterEach(() => {
		wrapper.unmount();
	});
});
