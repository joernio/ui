import 'jsdom-global/register';
import React from 'react';
import Toaster from './Toaster';
import { makeStyles } from '@material-ui/core/styles';
import { default_state as status } from '../../store/reducers/statusReducers';
import { mount } from 'enzyme';
import { findByTestAttr, testStore } from '../../assets/js/utils/testUtils';
import { toaster } from '../../assets/js/utils/toaster';

const mock_show_toaster = jest
  .spyOn(toaster, 'show')
  .mockImplementation(() => {});

const setUp = (initialState = {}) => {
  const store = testStore(initialState);
  const wrapper = mount(<Toaster store={store} />);
  return { wrapper, store };
};

describe('Toaster component with status.toast empty:', () => {
  let wrapper;

  beforeEach(() => {
    let wrapper_and_store = setUp({ status });
    wrapper = wrapper_and_store.wrapper;
  });

  it('expect mock_show_toaster to not have been called', () => {
    expect(mock_show_toaster).not.toHaveBeenCalled();
  });

  afterEach(() => {
    wrapper.unmount();
  });
});

describe('Toaster component with status.toast not empty:', () => {
  let wrapper;

  beforeEach(() => {
    let wrapper_and_store = setUp({ status: { ...status, toast: {} } });
    wrapper = wrapper_and_store.wrapper;
  });

  it('expect mock_show_toaster to have been called', () => {
    expect(mock_show_toaster).toHaveBeenCalled();
  });

  afterEach(() => {
    wrapper.unmount();
  });
});
