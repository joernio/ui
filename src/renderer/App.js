import React from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import * as settingsSelectors from './store/selectors/settingsSelectors';
import * as filesSelectors from './store/selectors/filesSelectors';
import * as statusSelectors from './store/selectors/statusSelectors';
import createTheme from './assets/js/theme';
import initIPCRenderer from './assets/js/utils/ipcRenderer';
import {
	initShortcuts,
	removeShortcuts,
	handleFontSizeChange,
  discardDialogHandler,
  sendWindowsMessage
} from './assets/js/utils/scripts';

import WindowWrapper from './views/WindowWrapper';
import Window from './views/window/Window';
import QueryProcessor from './renderless/QueryProcessor';
import WorkspaceProcessor from './renderless/WorkspaceProcessor';
import FilesProcessor from './renderless/FilesProcessor';
import Toaster from './components/toaster/Toaster';

function App(props) {

  const [state, setState] = React.useState({
		openDiscardDialog: false,
		discardDialogCallback: () => {},
	});

  const handleSetState = obj => {
		if (obj) {
			Promise.resolve(obj).then(obj => {
				setState(state => ({ ...state, ...obj }));
			});
		}
	};

  const {openFiles, openFilePath} = props;

  React.useEffect(()=>{
    props.connected !== null && setTimeout(()=>handleSetState(
      discardDialogHandler(
        openFiles,
        openFilePath,
        () => {
          sendWindowsMessage(
            'reload',
          );
        },
      ),
    ),0);
  },[props.server?.enable_http]);

	React.useEffect(() => {
		if (props.queryShortcuts) {
			removeShortcuts();
			initShortcuts();
			return () => removeShortcuts();
		}
	}, [props.queryShortcuts]);

	React.useEffect(() => {
		if (props.websocket?.url) {
			initIPCRenderer(props.websocket.url);
		}
	}, [props.websocket?.url]);

	React.useEffect(() => {
		if (props.fontSize) {
			handleFontSizeChange(document, props.fontSize); // eslint-disable-line no-undef
		}
	}, [props.fontSize]);

	const theme = createTheme(props.prefersDarkMode);

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

const mapStateToProps = state => ({
  server: settingsSelectors.selectServer(state),
	queryShortcuts: settingsSelectors.selectQueryShortcuts(state),
	websocket: settingsSelectors.selectWebSocket(state),
	fontSize: settingsSelectors.selectFontSize(state),
	prefersDarkMode: settingsSelectors.selectPrefersDarkMode(state),
  openFiles: filesSelectors.selectOpenFiles(state),
	openFilePath: filesSelectors.selectOpenFilePath(state),
  connected: statusSelectors.selectConnected(state),
});

export default connect(mapStateToProps, null)(App);
