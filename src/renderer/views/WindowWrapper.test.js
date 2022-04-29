// import 'jsdom-global/register';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { mount } from 'enzyme';
import WindowWrapper from './WindowWrapper';
import QueriesStats from '../components/queries_stats/QueriesStats';
import { default_state as settings } from '../store/reducers/settingsReducers';
import { default_state as files } from '../store/reducers/filesReducers';
import { default_state as query } from '../store/reducers/queryReducers';
import { default_state as workspace } from '../store/reducers/workSpaceReducers';
import { findByTestAttr, testStore } from '../assets/js/utils/testUtils';
import { getOpenFileName } from '../assets/js/utils/scripts';
import { windowInfoApi, windowActionApi } from '../assets/js/utils/ipcRenderer';
import { Provider as ReduxProvider } from 'react-redux';

const status = {}; // to be removed when test is fixed

jest.mock('@material-ui/core/styles', () => ({
	__esModule: true,
	makeStyles: jest.fn(() => () => ({})),
}));

jest.mock('../components/queries_stats/QueriesStats', () => ({
	__esModule: true,
	default: jest.fn(() => <div data-test="queries-stats"></div>),
}));

// jest.mock('./windowWrapperScripts.js', () => ({
// 	__esModule: true,
// 	getOpenFileName: jest.fn(() => 'abcdefgh.js'),
// }));

jest.mock("../assets/js/utils/scripts", () => {
    const original = jest.requireActual("../assets/js/utils/scripts");
    return {
        ...original,
        getOpenFileName: jest.fn()
    };
});

const getWindowInfo = jest
	.spyOn(windowInfoApi, 'getWindowInfo')
	.mockImplementation(() => {});
const setOpenFileName = jest
	.spyOn(windowActionApi, 'setOpenFileName')
	.mockImplementation(() => {});

const setUp = (initialState = {}) => {
	const store = testStore(initialState);
	const wrapper = mount(
		<ReduxProvider store={store} >
			<WindowWrapper/>
		</ReduxProvider>
	);
	return { wrapper, store };
};

describe('WindowWrapper component:', () => {
	let wrapper;
	let queries_stats;

	beforeEach(() => {
		const wrapper_and_store = setUp({
			settings,
			status,
			files,
			query,
			workspace,
		});
		wrapper = wrapper_and_store.wrapper;
		queries_stats = wrapper.find(QueriesStats);
	});

	it('WindowWrapper.jsx Should render without errors', () => {
		const component = findByTestAttr(wrapper, 'window-wrapper');
		expect(component).toHaveLength(1);
	});

	it('expect makeStyles to have been called', () => {
		expect(makeStyles).toHaveBeenCalled();
	});

	it('expect getWindowInfo to have been called', () => {
		expect(getWindowInfo).toHaveBeenCalled();
	});

	it('expect getOpenFileName to have been called', () => {
		getOpenFileName.mockImplementation(() => 'abcdefgh.js');
		expect(getOpenFileName).toHaveBeenCalled();
	});

	it('expect setOpenFileName to have been called', () => {
		expect(setOpenFileName).toHaveBeenCalled();
	});

	it('expect queries_stats.length to be 1', () => {
		const component = findByTestAttr(queries_stats, 'queries-stats');
		expect(component).toHaveLength(1);
	});

	afterEach(() => {
		wrapper.unmount();
	});
});
