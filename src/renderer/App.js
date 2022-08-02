import React from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import * as settingsSelectors from './store/selectors/settingsSelectors';
import * as statusSelectors from './store/selectors/statusSelectors';
import createTheme from './assets/js/theme';
import initIPCRenderer from './assets/js/utils/ipcRenderer';
import {
	initShortcuts,
	removeShortcuts,
	handleFontSizeChange,
	discardDialogHandler,
	sendWindowsMessage,
} from './assets/js/utils/scripts';

import WindowWrapper from './views/WindowWrapper';
import Window from './views/window/Window';
import QueryProcessor from './renderless/QueryProcessor';
import WorkspaceProcessor from './renderless/WorkspaceProcessor';
import FilesProcessor from './renderless/FilesProcessor';
import Toaster from './components/toaster/Toaster';
import DiscardDialog from './components/discard_dialog/DiscardDialog';
import QueryShortcutWithArgsDialog from './components/query_shortcut_with_args_dialog/QueryShortcutWithArgsDialog';

function App(props) {
	React.useEffect(() => {
		props.connected !== null &&
			setTimeout(
				// schedule this operation to run in the next event loop run.
				// REMOVING THE setTimeout WILL PREVENT enable_http FROM EVER CHANGING!!! WE DON'T WANT THAT!!
				() =>
					discardDialogHandler(() => {
						sendWindowsMessage('reload');
					}),
				0,
			);
	}, [props.server?.enable_http]);

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
				<DiscardDialog />
				<QueryShortcutWithArgsDialog />
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
	connected: statusSelectors.selectConnected(state),
});

export default connect(mapStateToProps, null)(App);
