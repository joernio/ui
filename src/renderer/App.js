import React from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
import createTheme from './assets/js/theme';
import initIPCRenderer from './assets/js/utils/ipcRenderer';
import {
  initShortcuts,
  removeShortcuts,
  handleFontSizeChange,
} from './assets/js/utils/scripts';
import { connect } from 'react-redux';

import WindowWrapper from './views/WindowWrapper';
import Window from './views/window/Window';
import QueryProcessor from './renderless/QueryProcessor';
import WorkspaceProcessor from './renderless/WorkspaceProcessor';
import FilesProcessor from './renderless/FilesProcessor';
import Toaster from './components/toaster/Toaster';

function App(props) {
  React.useEffect(() => {
    if (props.settings.queryShortcuts) {
      removeShortcuts();
      initShortcuts();
      return () => removeShortcuts();
    }
  }, [props.settings.queryShortcuts]);

  React.useEffect(() => {
    props.settings?.websocket?.url &&
      initIPCRenderer(props.settings.websocket.url);
  }, [props.settings.websocket]);

  React.useEffect(() => {
    props.settings?.fontSize &&
      handleFontSizeChange(document, props.settings.fontSize);
  }, [props.settings.fontSize]);

  const theme = createTheme(props.settings.prefersDarkMode);

  return (
    <div data-test="app">
      <ThemeProvider theme={theme}>
        <WindowWrapper>
          <Window />
        </WindowWrapper>
      </ThemeProvider>
      <QueryProcessor />
      <WorkspaceProcessor />

      <FilesProcessor />
      <Toaster />
    </div>
  );
}

const mapStateToProps = state => {
  return {
    settings: state.settings,
    query: state.query,
  };
};

export default connect(mapStateToProps, null)(App);
