// import 'jsdom-global/register';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { mount } from 'enzyme';
import EditorTabs from './EditorTabs';
import { default_state as settings } from '../../store/reducers/settingsReducers';
import { default_state as files } from '../../store/reducers/filesReducers';
import { findByTestAttr, testStore } from '../../assets/js/utils/testUtils';
import { Provider as ReduxProvider } from 'react-redux'

jest.mock('@material-ui/core/styles', () => ({
	__esModule: true,
	makeStyles: jest.fn(() => () => ({})),
}));

const setUp = (initialState = {}) => {
	const store = testStore(initialState);
	const wrapper = mount(
		<ReduxProvider store={store}>
			<EditorTabs/>
	  	</ReduxProvider>
	);
	return { wrapper, store };
};

describe('EditorTabs component:', () => {
	let wrapper;

	beforeEach(() => {
		const wrapper_and_store = setUp({ settings, files });
		wrapper = wrapper_and_store.wrapper;
	});

	it('EditorTabs.jsx Should render', () => {
		const component = findByTestAttr(wrapper, 'editor-tabs');
		expect(component).toHaveLength(1);
	});

	it('expect makeStyles to have been called', () => {
		expect(makeStyles).toHaveBeenCalled();
	});

	afterEach(() => {
		wrapper.unmount();
	});
});
