import React from 'react';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { ThemeProvider } from '@material-ui/core/styles';
import createTheme from './assets/js/theme';
import initIPCRenderer from './assets/js/utils/ipcRenderer';

import WindowWrapper from './views/WindowWrapper';
import Window from './views/window/Window';
import QueryProcessor from './renderless/QueryProcessor';
import WorkspaceProcessor from './renderless/WorkspaceProcessor';
import FilesProcessor from './renderless/FilesProcessor';
initIPCRenderer();

function App(props) {
  const userThemePreference = value => {
    if (value) {
      localStorage.setItem('prefersDarkMode', value);
    } else {
      let prefersDarkMode = localStorage.getItem('prefersDarkMode');
      if (!prefersDarkMode) {
        prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
      }
      return prefersDarkMode;
    }
  };

  const [prefersDarkMode, setPrefersDarkMode] = React.useState(
    userThemePreference(),
  );

  const handleSetThemePreference = value => {
    setPrefersDarkMode(value);
    userThemePreference(value);
  };

  const theme = createTheme(prefersDarkMode);

  return (
    <>
      <ThemeProvider theme={theme}>
        <WindowWrapper {...props}>
          <Window
            {...props}
            handleSetThemePreference={handleSetThemePreference}
            prefersDarkMode={prefersDarkMode}
          />
        </WindowWrapper>
      </ThemeProvider>
      <QueryProcessor />
      <WorkspaceProcessor />
      <FilesProcessor />
    </>
  );
}

export default App;
