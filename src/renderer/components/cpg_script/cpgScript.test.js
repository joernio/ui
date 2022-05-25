import React from 'react';
import { mount } from 'enzyme';
import clsx from 'clsx';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import {
	deleteFile,
	discardDialogHandler,
} from '../../assets/js/utils/scripts';
import {
	handleOpenScript,
	shouldOpenScriptsContextMenu,
} from './cpgScriptScripts';
import { default_state as settings } from '../../store/reducers/settingsReducers';
import { default_state as files } from '../../store/reducers/filesReducers';
import { default_state as query } from '../../store/reducers/queryReducers';
import { default_state as workspace } from '../../store/reducers/workSpaceReducers';
import { findByTestAttr, testStore } from '../../assets/js/utils/testUtils';
import CpgScript from './CpgScript';
import { Provider as ReduxProvider } from 'react-redux';
import { openFile } from '../../assets/js/utils/scripts';

const handleSetState = jest.fn(() => {});

const runScriptProp = jest.fn(() => {});

const fileNameProp = '';

jest.mock('@material-ui/core/styles', () => ({
	__esModule: true,
	makeStyles: jest.fn(() => () => ({})),
}));

const setUp = (initialState = {}) => {
	const store = testStore(initialState);
	const wrapper = mount(
		<ReduxProvider store={store}>
			<CpgScript
				filename={fileNameProp}
				path=""
				selected={{}}
				hasTag={false}
				handleSetState={handleSetState}
				runScript={runScriptProp}
			/>
			,
		</ReduxProvider>,
	);
	return { wrapper, store };
};

describe('CpgScripts component when workspace is empty:', () => {
	let wrapper;

	beforeEach(() => {
		const wrapper_and_store = setUp({ settings, files, query, workspace });
		wrapper = wrapper_and_store.wrapper;
	});

	it('expect CpgScript.jsx to have been rendered', () => {
		const component = findByTestAttr(wrapper, 'cpg-script');
		expect(component).toHaveLength(1);
	});

	it('expect makeStyles to have been called', () => {
		expect(makeStyles).toHaveBeenCalled();
	});

	it('should not open script when path is empty', () => {
		const path = '';
		const e = '';
		const selected = '';
		const result = handleOpenScript(e, path, selected);

		expect(result).toBeUndefined();
	});

	it('should not open scripts context menu when selected is empty', ()=> {
		const selected = {};
		shouldOpenScriptsContextMenu(selected, handleSetState);
		expect(handleSetState).not.toHaveBeenCalled()
	})

	it('should open scripts context menu when selected has content', ()=> {
		const selected = {};
		shouldOpenScriptsContextMenu(selected, handleSetState);
		expect(handleSetState).not.toHaveBeenCalled()
	})

	afterEach(() => {
		wrapper.unmount();
	});
});
