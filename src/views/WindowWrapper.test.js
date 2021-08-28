import 'jsdom-global/register';
import React from 'react';
import WindowWrapper from './WindowWrapper';
import { makeStyles } from '@material-ui/core/styles';
import QueriesStats from '../components/queries_stats/QueriesStats';
import { default_state as settings } from '../store/reducers/settingsReducers';
import { default_state as files } from '../store/reducers/filesReducers';
import { default_state as query } from '../store/reducers/queryReducers';
import { default_state as status } from '../store/reducers/statusReducers';
import { default_state as workspace } from '../store/reducers/workSpaceReducers';
import { mount } from 'enzyme';
import { findByTestAttr, testStore } from '../assets/js/utils/testUtils';
import { getOpenFileName } from './windowWrapperScripts';
import { windowInfoApi, windowActionApi } from '../assets/js/utils/ipcRenderer';

jest.mock('@material-ui/core/styles', () => ({
  __esModule: true,
  makeStyles: jest.fn(() => () => ({})),
}));

jest.mock('../components/queries_stats/QueriesStats', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-test="queries-stats"></div>),
}));

jest.mock('./windowWrapperScripts', () => ({
  __esModule: true,
  getOpenFileName: jest.fn(() => 'abcdefgh.js'),
}));

const getWindowInfo = jest
  .spyOn(windowInfoApi, 'getWindowInfo')
  .mockImplementation(() => {});
const setOpenFileName = jest
  .spyOn(windowActionApi, 'setOpenFileName')
  .mockImplementation(() => {});

const setUp = (initialState = {}) => {
  const store = testStore(initialState);
  const wrapper = mount(<WindowWrapper store={store} />);
  return { wrapper, store };
};

describe('WindowWrapper component:', () => {
  let wrapper, queries_stats;

  beforeEach(() => {
    let wrapper_and_store = setUp({
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
    expect(component.length).toBe(1);
  });

  it('expect makeStyles to have been called', () => {
    expect(makeStyles).toHaveBeenCalled();
  });

  it('expect getWindowInfo to have been called', () => {
    expect(getWindowInfo).toHaveBeenCalled();
  });

  it('expect getOpenFileName to have been called', () => {
    expect(getOpenFileName).toHaveBeenCalled();
  });

  it('expect setOpenFileName to have been called', () => {
    expect(setOpenFileName).toHaveBeenCalled();
  });

  it('expect queries_stats.length to be 1', () => {
    const component = findByTestAttr(queries_stats, 'queries-stats');
    expect(component.length).toBe(1);
  });

  afterEach(() => {
    wrapper.unmount();
  });
});
