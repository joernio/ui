import React from 'react';
import clsx from 'clsx';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Icon, Menu, MenuDivider, MenuItem } from '@blueprintjs/core';
import { ContextMenu2, Popover2 } from '@blueprintjs/popover2';
import * as queryActions from '../store/actions/queryActions';
import * as filesSelectors from '../store/selectors/filesSelectors';
import * as settingsSelectors from '../store/selectors/settingsSelectors';
import * as statusSelectors from '../store/selectors/statusSelectors';
import QueriesStats from '../components/queries_stats/QueriesStats';
import DiscardDialog from '../components/discard_dialog/DiscardDialog';
import QueryShortcutWithArgsDialog from '../components/query_shortcut_with_args_dialog/QueryShortcutWithArgsDialog';
import { windowInfoApi, windowActionApi } from '../assets/js/utils/ipcRenderer';
import styles from '../assets/js/styles/views/windowWrapperStyles';
import {
	openEmptyFile,
	sendWindowsMessage,
	wsReconnectToServer,
	wsDisconnectFromServer,
	openFile,
	saveFile,
	getOpenFileName,
	handleSwitchWorkspace,
	contructQueryWithPath,
	addToQueue,
	discardDialogHandler,
} from '../assets/js/utils/scripts';
import { handleOpenFile } from './windowWrapperScripts';

const useStyles = makeStyles(styles);

function WindowWrapper(props) {
	const hiddenInputEl = React.useRef(null);
	const classes = useStyles(props);

	const [state, setState] = React.useState({
		isMaximized: windowInfoApi.getWindowInfo(),
		fileContextIsOpen: false,
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

	React.useEffect(() => {
		const filename = getOpenFileName(props?.openFilePath);
		windowActionApi.setOpenFileName(filename);
	}, [props.openFilePath]);

	const { fileContextIsOpen, openDiscardDialog, discardDialogCallback } =
		state;
	const { openFiles, openFilePath } = props;

	return (
		<div data-test="window-wrapper">
			<div className={classes.titleBarStyle}>
				<div className={classes.titleBarRightStyle}>
					<input
						ref={hiddenInputEl}
						className={classes.hiddenStyle}
						type="file"
						onChange={e => openFile(handleOpenFile(e))}
					/>

					<Popover2
						content={
							<Menu className={classes.menuStyle}>
								<MenuItem
									className={classes.menuItemStyle}
									text="New Script"
									icon="document"
									onClick={() =>
										handleSetState(
											discardDialogHandler(
												openFiles,
												openFilePath,
												() => {
													openEmptyFile();
												},
											),
										)
									}
								/>
								<MenuItem
									className={classes.menuItemStyle}
									text="Open File"
									onClick={() =>
										handleSetState(
											discardDialogHandler(
												openFiles,
												openFilePath,
												() => {
													hiddenInputEl.current.click();
												},
											),
										)
									}
									icon="folder-shared"
								/>
								<MenuItem
									className={classes.menuItemStyle}
									text="Save Script"
									icon="floppy-disk"
									onClick={() =>
										saveFile(
											props.openFilePath,
											props.scriptsDir,
										)
									}
								/>
								<MenuDivider
									className={classes.menuDividerStyle}
								/>
								<MenuItem
									className={classes.menuItemStyle}
									onClick={async () =>
										addToQueue(
											await contructQueryWithPath(
												'importCode',
												'select-dir',
											),
											props,
										)
									}
									icon="import"
									text="Import Directory"
								></MenuItem>
								<MenuItem
									className={classes.menuItemStyle}
									onClick={async () =>
										addToQueue(
											await contructQueryWithPath(
												'importCode',
											),
											props,
										)
									}
									icon="import"
									text="Import File"
								></MenuItem>
								<MenuItem
									className={classes.menuItemStyle}
									onClick={async () =>
										addToQueue(
											await contructQueryWithPath(
												'importCpg',
											),
											props,
										)
									}
									icon="import"
									text="Import Cpg"
								></MenuItem>
								<MenuDivider
									className={classes.menuDividerStyle}
								/>
								<MenuItem
									className={classes.menuItemStyle}
									onClick={async () =>
										addToQueue(
											await handleSwitchWorkspace(),
											props,
										)
									}
									icon="swap-horizontal"
									text="Switch Workspace"
								></MenuItem>
								<MenuDivider
									className={classes.menuDividerStyle}
								/>
								<MenuItem
									className={classes.menuItemStyle}
									text="Reload"
									icon="refresh"
									onClick={() =>
										handleSetState(
											discardDialogHandler(
												openFiles,
												openFilePath,
												() => {
													sendWindowsMessage(
														'reload',
													);
												},
											),
										)
									}
								/>
								<MenuItem
									className={classes.menuItemStyle}
									text="Exit"
									icon="cross"
									onClick={() =>
										handleSetState(
											discardDialogHandler(
												openFiles,
												openFilePath,
												() => {
													sendWindowsMessage('close');
												},
											),
										)
									}
								/>
							</Menu>
						}
						placement="bottom-end"
						minimal={true}
						openOnTargetFocus={false}
						interactionKind="click"
						isOpen={fileContextIsOpen}
						onInteraction={isOpen =>
							handleSetState({ fileContextIsOpen: isOpen })
						}
					>
						<button
							className={clsx(
								classes.navItemStyle,
								classes.controlButtonStyle,
							)}
						>
							File
						</button>
					</Popover2>

					{/* <div className={classes.toolNameContainerStyle}>
            <h1>{filename ? `${filename} - ` : null}CPG UI Client</h1>
          </div> */}
				</div>

				{/* <button
          className={classes.controlButtonStyle}
          onClick={() => sendWindowsMessage('minimize')}
        >
          <Icon icon="minus" className={classes.windowActionIconStyle} />
        </button>

        <button
          className={classes.controlButtonStyle}
          onClick={() => {
            sendWindowsMessage(
              windowInfoApi.getWindowInfo() ? 'unmaximize' : 'maximize',
            );
            handleSetState({ isMaximized: !isMaximized });
          }}
        >
          {isMaximized ? (
            <Icon icon="minimize" className={classes.windowActionIconStyle} />
          ) : (
            <Icon icon="maximize" className={classes.windowActionIconStyle} />
          )}
        </button>

        <button
          className={clsx('close', classes.controlButtonStyle)}
          onClick={() => sendWindowsMessage('close')}
        >
          <Icon icon="cross" className={classes.windowActionIconStyle} />
        </button> */}
			</div>
			{props.children}
			<div className={classes.statusBarStyle}>
				<div className={classes.statusBarRightStyle}>
					<QueriesStats />
				</div>

				<ContextMenu2
					autoFocus={false}
					content={
						<div>
							<div
								className={classes.conStatContextContentStyle}
								onClick={() =>
									wsReconnectToServer(props.websocket.url)
								}
							>
								Reconnect
							</div>
							<div
								className={classes.conStatContextContentStyle}
								onClick={wsDisconnectFromServer}
							>
								Disconnect
							</div>
						</div>
					}
				>
					<div className={classes.connectionStatusStyle}>
						{props.connected ? (
							<>
								<h3>Connected</h3>
								<div className="ring-container">
									{/* <div className="ringring"></div> */}
									<div className="circle"></div>
								</div>
							</>
						) : props.connected === false ? (
							<>
								<h3>Failed</h3>
								<Icon icon="delete" intent="danger" />
							</>
						) : (
							<>
								<h3>Connecting ...</h3>
								<div
									className={
										classes.refreshIconContainerStyle
									}
								>
									<Icon
										icon="refresh"
										className={clsx(
											classes.refreshIconStyle,
											'refresh-icon-animation',
										)}
									/>
								</div>
							</>
						)}
					</div>
				</ContextMenu2>
			</div>
			<DiscardDialog
				handleSetState={handleSetState}
				openDiscardDialog={openDiscardDialog}
				callback={discardDialogCallback}
			/>
			<QueryShortcutWithArgsDialog />
		</div>
	);
}

const mapStateToProps = state => ({
	openFiles: filesSelectors.selectOpenFiles(state),
	openFilePath: filesSelectors.selectOpenFilePath(state),
	connected: statusSelectors.selectConnected(state),
	websocket: settingsSelectors.selectWebSocket(state),
	prefersDarkMode: settingsSelectors.selectPrefersDarkMode(state),
});

const mapDispatchToProps = dispatch => ({
	enQueueQuery: query => dispatch(queryActions.enQueueQuery(query)),
});

export default connect(mapStateToProps, mapDispatchToProps)(WindowWrapper);
