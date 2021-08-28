import 'jsdom-global/register';
import React from 'react';
import ExplorerWindow from './ExplorerWindow';
import { default_state as settings } from '../../store/reducers/settingsReducers';
import { default_state as query } from '../../store/reducers/queryReducers';
import { mount } from 'enzyme';
import { findByTestAttr, testStore } from '../../assets/js/utils/testUtils';
import { initResize } from '../../assets/js/utils/scripts';
import { resizeHandler } from './explorerWindowScripts';

const mock_query_results = {
  sdksldksldks: {},
  dksldksdksk: {},
};

const handleSetState = jest.fn(() => {});

jest.mock('@material-ui/core/styles', () => ({
  __esModule: true,
  makeStyles: jest.fn(() => () => ({})),
}));

jest.mock('../../assets/js/utils/scripts', () => ({
  __esModule: true,
  initResize: jest.fn(() => () => {}),
}));

jest.mock('./explorerWindowScripts', () => ({
  __esModule: true,
  resizeHandler: jest.fn(() => {}),
}));

jest.mock('@blueprintjs/core', () => ({
  __esModule: true,
  Icon: jest.fn(_ => <div data-test="icon"></div>),
}));

jest.mock('../../components/folders/Folders', () => ({
  __esModule: true,
  default: jest.fn(_ => <div data-test="folders"></div>),
}));

jest.mock('../../components/workspace/Workspace', () => ({
  __esModule: true,
  default: jest.fn(_ => <div data-test="workspace"></div>),
}));

jest.mock('../../components/joern_scripts/JoernScripts', () => ({
  __esModule: true,
  default: jest.fn(_ => <div data-test="joern-scripts"></div>),
}));

jest.mock('../../components/open_files/OpenFiles', () => ({
  __esModule: true,
  default: jest.fn(_ => <div data-test="open-files"></div>),
}));

const setUp = (initialState = {}) => {
  const store = testStore(initialState);
  const wrapper = mount(
    <ExplorerWindow
      store={store}
      drawerWidth=""
      sideNavWidth=""
      handleSetState={handleSetState}
    />,
  );
  return { wrapper, store };
};

describe('ExplorerWindow component with query.results empty:', () => {
  let wrapper, icon, joern_scripts, open_files, workspace, folders;

  beforeEach(() => {
    let wrapper_and_store = setUp({ settings, query });
    wrapper = wrapper_and_store.wrapper;
    icon = findByTestAttr(wrapper, 'icon');
    joern_scripts = findByTestAttr(wrapper, 'joern-scripts');
    open_files = findByTestAttr(wrapper, 'open-files');
    workspace = findByTestAttr(wrapper, 'workspace');
    folders = findByTestAttr(wrapper, 'folders');
  });

  it('ExplorerWindow.jsx Should render without errors', () => {
    const component = findByTestAttr(wrapper, 'explorer-window');
    expect(component.length).toBe(1);
  });

  it('expect typeof wrapper.props().drawerWidth to be "string"', () => {
    expect(typeof wrapper.props().drawerWidth).toBe('string');
  });

  it('expect typeof wrapper.props().sideNavWidth to be "string"', () => {
    expect(typeof wrapper.props().sideNavWidth).toBe('string');
  });

  it('expect typeof wrapper.props().handleSetState "function"', () => {
    expect(typeof wrapper.props().handleSetState).toBe('function');
  });

  it('expect initResize to have been called', () => {
    expect(initResize).toHaveBeenCalled();
  });

  it('expect icon.length to be 1, when query.results is empty', () => {
    expect(icon.length).toBe(1);
  });

  it('expect joern_scripts.length to be 0, when query.results is empty', () => {
    expect(joern_scripts.length).toBe(0);
  });

  it('expect open_files.length to be 0, when query.results is empty', () => {
    expect(open_files.length).toBe(0);
  });

  it('expect workspace.length to be 0, when query.results is empty', () => {
    expect(workspace.length).toBe(0);
  });

  it('expect folders.length to be 0, when query.results is empty', () => {
    expect(folders.length).toBe(0);
  });

  afterEach(() => {
    wrapper.unmount();
  });
});

describe('ExplorerWindow component with query.results not empty:', () => {
  let wrapper, icon, joern_scripts, open_files, workspace, folders;

  beforeEach(() => {
    let wrapper_and_store = setUp({
      settings,
      query: { ...query, results: mock_query_results },
    });
    wrapper = wrapper_and_store.wrapper;
    icon = findByTestAttr(wrapper, 'icon');
    joern_scripts = findByTestAttr(wrapper, 'joern-scripts');
    open_files = findByTestAttr(wrapper, 'open-files');
    workspace = findByTestAttr(wrapper, 'workspace');
    folders = findByTestAttr(wrapper, 'folders');
  });

  it('ExplorerWindow.jsx Should render without errors', () => {
    const component = findByTestAttr(wrapper, 'explorer-window');
    expect(component.length).toBe(1);
  });

  it('expect typeof wrapper.props().drawerWidth to be "string"', () => {
    expect(typeof wrapper.props().drawerWidth).toBe('string');
  });

  it('expect typeof wrapper.props().sideNavWidth to be "string"', () => {
    expect(typeof wrapper.props().sideNavWidth).toBe('string');
  });

  it('expect typeof wrapper.props().handleSetState "function"', () => {
    expect(typeof wrapper.props().handleSetState).toBe('function');
  });

  it('expect initResize to have been called', () => {
    expect(initResize).toHaveBeenCalled();
  });

  it('expect icon.length to be 0, when query.results is not empty', () => {
    expect(icon.length).toBe(0);
  });

  it('expect joern_scripts.length to be 1, when query.results is not empty', () => {
    expect(joern_scripts.length).toBe(1);
  });

  it('expect open_files.length to be 1, when query.results is not empty', () => {
    expect(open_files.length).toBe(1);
  });

  it('expect workspace.length to be 1, when query.results is not empty', () => {
    expect(workspace.length).toBe(1);
  });

  it('expect folders.length to be 1, when query.results is not empty', () => {
    expect(folders.length).toBe(1);
  });

  afterEach(() => {
    wrapper.unmount();
  });
});
