import React from 'react';
import clsx from 'clsx';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Icon, Divider, Switch, Dialog } from '@blueprintjs/core';
import { Tooltip2 } from '@blueprintjs/popover2';
import * as settingsActions from '../../store/actions/settingsActions';
import * as statusActions from '../../store/actions/statusActions';
import * as settingsSelectors from '../../store/selectors/settingsSelectors';
import * as statusSelectors from '../../store/selectors/statusSelectors';
import * as filesSelectors from '../../store/selectors/filesSelectors';
import styles from '../../assets/js/styles/views/side_nav/sideNavStyles';
import commonStyles from '../../assets/js/styles';
import CustomIcon from '../../components/custom_icon/CustomIcon';

import { isSynthFileOpen } from '../../assets/js/utils/scripts';

import {
	handleDrawerToggle,
	handleTerminalToggle,
	getSettingsInitialValues,
	collectSettingsValues,
	handleOnChange,
	openShortcutsPage,
	openRulesReportPage,
	openRulesPage,
} from './sideNavScripts';
import {
	customIcons,
	syntheticFiles,
} from '../../assets/js/utils/defaultVariables';

const useStyles = makeStyles(styles);
const useCommonStyles = makeStyles(commonStyles);

function SideNav(props) {
	const classes = useStyles(props);
	const commonClasses = useCommonStyles(props);

	const [state, setState] = React.useState({
		anchorEl: null,
		values: {},
	});

	const handleSetState = obj => {
		if (obj) {
			Promise.resolve(obj).then(obj => {
				setState(state => ({ ...state, ...obj }));
			});
		}
	};

	React.useEffect(() => {
		handleSetState({ values: getSettingsInitialValues(props) });
	}, [
		props.server,
		props.websocket,
		props.prefersDarkMode,
		props.prefersTerminalView,
		props.fontSize,
		props.rulesConfigFilePath,
		props.uiIgnore,
	]);

	const { values } = state;

	return (
		<div data-test="side-nav">
			<div className={clsx(classes.rootStyle, 'side-nav')}>
				<div
					className={clsx(
						classes.topIconsContainerStyle,
						'nav-upper-section',
					)}
				>
					<Tooltip2
						className={clsx(
							classes.iconContainerStyle,
							commonClasses.cursorPointer,
							{
								[classes.iconContainerFocusStyle]:
									!!props.drawerWidth,
							},
						)}
						popoverClassName={commonClasses.toolTipStyle}
						content={
							<span className={commonClasses.toolTipTextStyle}>
								explorer
							</span>
						}
						placement="right"
						usePortal={false}
						openOnTargetFocus={false}
					>
						<span
							onClick={() =>
								props.handleSetState(handleDrawerToggle(props))
							}
						>
							<Icon
								icon="control"
								iconSize={25}
								className={classes.iconStyle}
							/>
						</span>
					</Tooltip2>

					<Tooltip2
						className={clsx(
							classes.iconContainerStyle,
							commonClasses.cursorPointer,
							{
								[classes.iconContainerFocusStyle]:
									isSynthFileOpen(syntheticFiles[1]),
							},
						)}
						popoverClassName={commonClasses.toolTipStyle}
						content={
							<span className={commonClasses.toolTipTextStyle}>
								query shortcuts
							</span>
						}
						placement="right"
						usePortal={false}
						openOnTargetFocus={false}
					>
						<span onClick={openShortcutsPage}>
							<Icon
								icon="key-enter"
								iconSize={25}
								className={clsx(
									classes.iconStyle,
									classes.shortcutsIconStyle,
								)}
							/>
						</span>
					</Tooltip2>

					<Tooltip2
						className={clsx(
							classes.iconContainerStyle,
							commonClasses.cursorPointer,
							{
								[classes.iconContainerFocusStyle]:
									isSynthFileOpen(syntheticFiles[4]),
							},
						)}
						popoverClassName={commonClasses.toolTipStyle}
						content={
							<span className={commonClasses.toolTipTextStyle}>
								rules management view
							</span>
						}
						placement="right"
						usePortal={false}
						openOnTargetFocus={false}
					>
						<span onClick={openRulesPage}>
							<CustomIcon
								icon={customIcons.analytics}
								iconSize={25}
								className={classes.iconStyle}
							/>
						</span>
					</Tooltip2>

					<Tooltip2
						className={clsx(
							classes.iconContainerStyle,
							commonClasses.cursorPointer,
							{
								[classes.iconContainerFocusStyle]:
									isSynthFileOpen(syntheticFiles[5]),
							},
						)}
						popoverClassName={commonClasses.toolTipStyle}
						content={
							<span className={commonClasses.toolTipTextStyle}>
								rules results view
							</span>
						}
						placement="right"
						usePortal={false}
						openOnTargetFocus={false}
					>
						<span onClick={openRulesReportPage}>
							<CustomIcon
								icon={customIcons.monitoring}
								iconSize={25}
								className={classes.iconStyle}
							/>
						</span>
					</Tooltip2>
				</div>

				<Tooltip2
					className={clsx(
						classes.iconContainerStyle,
						commonClasses.cursorPointer,
						{
							[classes.iconContainerFocusStyle]:
								!!props.terminalHeight,
						},
					)}
					popoverClassName={commonClasses.toolTipStyle}
					content={
						<span className={commonClasses.toolTipTextStyle}>
							terminal
						</span>
					}
					placement="right"
					usePortal={false}
					openOnTargetFocus={false}
				>
					<span
						onClick={() =>
							props.handleSetState(handleTerminalToggle(props))
						}
					>
						<Icon
							icon="console"
							iconSize={25}
							className={classes.iconStyle}
						/>
					</span>
				</Tooltip2>

				<Tooltip2
					className={clsx(
						classes.iconContainerStyle,
						commonClasses.cursorPointer,
						{
							[classes.iconContainerFocusStyle]:
								!!props.settingsDialogIsOpen,
						},
					)}
					popoverClassName={commonClasses.toolTipStyle}
					content={
						<span className={commonClasses.toolTipTextStyle}>
							settings
						</span>
					}
					placement="right"
					usePortal={false}
					openOnTargetFocus={false}
				>
					<span
						onClick={() => {
							props.setSettingsDialogIsOpen(
								!props.settingsDialogIsOpen,
							);
						}}
					>
						<Icon
							icon="cog"
							iconSize={25}
							className={classes.iconStyle}
						/>
					</span>
				</Tooltip2>
			</div>
			<Dialog
				portalClassName={classes.settingsDialogStyle}
				autoFocus={true}
				canEscapeKeyClose={true}
				canOutsideClickClose={true}
				enforceFocus={true}
				isOpen={props.settingsDialogIsOpen}
				title="Settings"
				isCloseButtonShown={false}
				onClose={() => {
					props.setSettingsDialogIsOpen(!props.settingsDialogIsOpen);
				}}
				usePortal={true}
			>
				<div className={classes.settingsDialogContentStyle}>
					<div>
						<h3>Server</h3>

						<h4>URL</h4>
						<input
							id="server_url"
							type="text"
							placeholder="http://example.com"
							defaultValue={values.server_url}
							onChange={e =>
								handleSetState(handleOnChange(e, values))
							}
							onBlur={e =>
								handleSetState(handleOnChange(e, values))
							}
						/>

						<h4>Username</h4>
						<input
							type="text"
							id="server_username"
							placeholder="auth username here.."
							defaultValue={values.server_username}
							onChange={e =>
								handleSetState(handleOnChange(e, values))
							}
							onBlur={e =>
								handleSetState(handleOnChange(e, values))
							}
						/>

						<h4>Password</h4>
						<input
							type="text"
							id="server_password"
							placeholder="auth password here.."
							defaultValue={values.server_password}
							onChange={e =>
								handleSetState(handleOnChange(e, values))
							}
							onBlur={e =>
								handleSetState(handleOnChange(e, values))
							}
						/>
					</div>
					<Divider className={classes.menuDividerStyle} />
					<div>
						<h3>Web Socket</h3>
						<h4>URL</h4>
						<input
							type="text"
							id="ws_url"
							placeholder="ws://example.com/connect"
							defaultValue={values.ws_url}
							onChange={e =>
								handleSetState(handleOnChange(e, values))
							}
							onBlur={e =>
								handleSetState(handleOnChange(e, values))
							}
						/>
					</div>
					<Divider className={classes.menuDividerStyle} />
					<div>
						<h3>GUI</h3>
						<h4>Dark Theme</h4>
						<Switch
							className={classes.switchStyle}
							innerLabelChecked="on"
							id="prefers_dark_mode"
							innerLabel="off"
							defaultChecked={values.prefers_dark_mode}
							onChange={e =>
								handleSetState(handleOnChange(e, values))
							}
							onBlur={e =>
								handleSetState(handleOnChange(e, values))
							}
						/>

						<h4>Prefers Terminal View</h4>
						<Switch
							className={classes.switchStyle}
							innerLabelChecked="on"
							id="prefers_terminal_view"
							innerLabel="off"
							defaultChecked={values.prefers_terminal_view}
							onChange={e =>
								handleSetState(handleOnChange(e, values))
							}
							onBlur={e =>
								handleSetState(handleOnChange(e, values))
							}
						/>

						<h4>Font Size</h4>
						<input
							type="number"
							id="font_size"
							defaultValue={values.font_size}
							onChange={e =>
								handleSetState(handleOnChange(e, values))
							}
							onBlur={e =>
								handleSetState(handleOnChange(e, values))
							}
						/>

						{/* <h4>Default Scripts Directory</h4>
						<input
							type="text"
							id="scripts_dir"
							placeholder="/home/........"
							defaultValue={values.scripts_dir}
							onChange={e =>
								handleSetState(handleOnChange(e, values))
							}
							onBlur={e =>
								handleSetState(handleOnChange(e, values))
							}
						/> */}

						<h4>Default Rules Config File Path</h4>
						<input
							type="text"
							id="rules_config_file_path"
							placeholder="/home/........"
							defaultValue={values.rules_config_file_path}
							onChange={e =>
								handleSetState(handleOnChange(e, values))
							}
							onBlur={e =>
								handleSetState(handleOnChange(e, values))
							}
						/>

						<h4>CPG UI Ignore</h4>
						<input
							type="text"
							id="ui_ignore"
							placeholder="node_modules, .git, build....."
							defaultValue={values.ui_ignore}
							onChange={e =>
								handleSetState(handleOnChange(e, values))
							}
							onBlur={e =>
								handleSetState(handleOnChange(e, values))
							}
						/>
					</div>
					<Divider className={classes.menuDividerStyle} />
					<div>
						<h3>Network</h3>
						<h4>
							Certificate Path &nbsp;
							<Tooltip2
								popoverClassName={clsx(
									classes.toolTipStyle,
									commonClasses.displayInlineBlock,
								)}
								content={
									<span className={classes.toolTipTextStyle}>
										Add path to pkcs12 file here e.g.
										/etc/nginx/ssl/localhost.p12
									</span>
								}
								placement="right"
								usePortal={false}
								openOnTargetFocus={false}
							>
								<Icon
									icon="help"
									iconSize={20}
									className={classes.iconStyle}
								/>
							</Tooltip2>
						</h4>
						<input
							type="text"
							id="cert_path"
							placeholder={
								values.cert_path_up_to_date
									? 'field is up to date'
									: 'path to pkcs12 file here...'
							}
							defaultValue=""
							onChange={e =>
								handleSetState(handleOnChange(e, values))
							}
							onBlur={e =>
								handleSetState(handleOnChange(e, values))
							}
						/>
						<h4>
							Certificate Passphrase &nbsp;
							<Tooltip2
								popoverClassName={clsx(
									classes.toolTipStyle,
									commonClasses.displayInlineBlock,
								)}
								content={
									<span className={classes.toolTipTextStyle}>
										Provide the passphrase for the submitted
										pkcs12 file
									</span>
								}
								placement="right"
								usePortal={false}
								openOnTargetFocus={false}
							>
								<Icon
									icon="help"
									iconSize={20}
									className={classes.iconStyle}
								/>
							</Tooltip2>
						</h4>
						<input
							type="password"
							id="cert_passphrase"
							placeholder={
								values.cert_passphrase_up_to_date
									? 'field is up to date'
									: 'passphrase here...'
							}
							defaultValue=""
							onChange={e =>
								handleSetState(handleOnChange(e, values))
							}
							onBlur={e =>
								handleSetState(handleOnChange(e, values))
							}
						/>
						<h4>Enable Http</h4>
						<Switch
							className={classes.switchStyle}
							innerLabelChecked="on"
							id="enable_http"
							innerLabel="off"
							defaultChecked={values.enable_http}
							onChange={e =>
								handleSetState(handleOnChange(e, values))
							}
							onBlur={e =>
								handleSetState(handleOnChange(e, values))
							}
						/>
					</div>
				</div>
				<Divider className={classes.menuDividerStyle} />
				<div className={classes.submitSectionStyle}>
					<h3
						onClick={() => {
							props.setSettingsDialogIsOpen(
								!props.settingsDialogIsOpen,
							);
						}}
					>
						Cancel
					</h3>
					<h3
						className="save"
						onClick={() => {
							props.setSettings(collectSettingsValues(values));
							props.setSettingsDialogIsOpen(
								!props.settingsDialogIsOpen,
							);
						}}
					>
						Save
					</h3>
				</div>
			</Dialog>
		</div>
	);
}

const mapStateToProps = state => ({
	settingsDialogIsOpen: statusSelectors.selectSettingsDialogIsOpen(state),
	server: settingsSelectors.selectServer(state),
	websocket: settingsSelectors.selectWebSocket(state),
	prefersDarkMode: settingsSelectors.selectPrefersDarkMode(state),
	prefersTerminalView: settingsSelectors.selectPrefersTerminalView(state),
	fontSize: settingsSelectors.selectFontSize(state),
	rulesConfigFilePath: settingsSelectors.selectRulesConfigFilePath(state),
	uiIgnore: settingsSelectors.selectUiIgnore(state),
	openFilePath: filesSelectors.selectOpenFilePath(state), // Do Not Remove: This is a hack to force sideNav to re-render whenever openFilePath changes, otherwise isSynthFileOpen won't get called when query shortcut synth file is opened
});

const mapDispatchToProps = dispatch => ({
	setSettings: values => dispatch(settingsActions.setSettings(values)),
	setSettingsDialogIsOpen: bool =>
		dispatch(statusActions.setSettingsDialogIsOpen(bool)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SideNav);
