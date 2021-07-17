import React from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
import createTheme from './assets/js/theme';
import initIPCRenderer from './assets/js/utils/ipcRenderer';
import { initShortcuts, removeShortcuts } from './assets/js/utils/scripts';
import { connect } from 'react-redux';

import WindowWrapper from './views/WindowWrapper';
import Window from './views/window/Window';
import QueryProcessor from './renderless/QueryProcessor';
import WorkspaceProcessor from './renderless/WorkspaceProcessor';
import FilesProcessor from './renderless/FilesProcessor';
import Toaster from './components/toaster/Toaster';

function App(props) {
  React.useEffect(() => {
    initShortcuts();
    return () => removeShortcuts();
  }, []);

  React.useEffect(() => {
    props.settings?.websocket?.url &&
      initIPCRenderer(props.settings.websocket.url);
  }, [props.settings.websocket]);

  const theme = createTheme(props.settings.prefersDarkMode);

  return (
    <>
      <ThemeProvider theme={theme}>
        <WindowWrapper>
          <Window />
        </WindowWrapper>
      </ThemeProvider>
      <Toaster />
      <QueryProcessor />
      <WorkspaceProcessor />
      <FilesProcessor />
    </>
  );
}

const mapStateToProps = state => {
  return {
    settings: state.settings,
  };
};

export default connect(mapStateToProps, null)(App);
