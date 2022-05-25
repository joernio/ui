import React from 'react';
import { Dialog } from '@blueprintjs/core';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import * as filesActions from '../../store/actions/filesActions';
import styles from '../../assets/js/styles/components/discard_dialog/discardDialogStyles';
import { getOpenFileName } from '../../assets/js/utils/scripts';
import {
	handleSave,
	handleDiscard,
	handleCancel,
} from './discardDialogScripts';
import DiscardDialog from './DiscardDialog';
import { default_state as settings } from '../../store/reducers/settingsReducers';
import { default_state as files } from '../../store/reducers/filesReducers';
import { findByTestAttr, testStore } from '../../assets/js/utils/testUtils';
import { mount } from 'enzyme';
import { Provider as ReduxProvider } from 'react-redux';

jest.mock('@material-ui/core/styles', () => ({
	__esModule: true,
	makeStyles: jest.fn(() => () => ({})),
}));

const setUp = (initialState = {}) => {
	const store = testStore(initialState);
	const wrapper = mount(
		<ReduxProvider store={store}>
			<DiscardDialog />
		</ReduxProvider>,
	);
	return { wrapper, store };
};

describe('DiscardDialog component', ()=> {

    let wrapper;

	beforeEach(() => {
		const wrapper_and_store = setUp({ settings, files });
		wrapper = wrapper_and_store.wrapper;
	});

    it('expect DiscardDialog.jsx to have been rendered', () => {
		const component = findByTestAttr(wrapper, 'Discard-Dialog');
		expect(component).toHaveLength(2);
	});

	it('expect makeStyles to have been called', () => {
		expect(makeStyles).toHaveBeenCalled();
	});

    afterEach(() => {
		wrapper.unmount();
	});

})