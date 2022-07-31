import React from 'react';
import clsx from 'clsx';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import {
	Icon,
	Menu,
	MenuItem,
	Dialog,
	Divider,
	MenuDivider,
} from '@blueprintjs/core';
import { Popover2 } from '@blueprintjs/popover2';
import * as queryActions from '../../store/actions/queryActions';
import * as settingsActions from '../../store/actions/settingsActions';
import * as filesSelectors from '../../store/selectors/filesSelectors';
import * as settingsSelectors from '../../store/selectors/settingsSelectors';
import * as workSpaceSelectors from '../../store/selectors/workSpaceSelectors';
import CpgScript from '../cpg_script/CpgScript';
import DiscardDialog from '../discard_dialog/DiscardDialog';
import styles from '../../assets/js/styles/components/cpg_scripts/cpgScriptsStyles';
import {
	isElementScrolled,
	watchFolderPath,
	openProjectExists,
	discardDialogHandler,
	openEmptyFile,
} from '../../assets/js/utils/scripts';
import {
	chokidarVars,
	getCpgScripts,
	switchDefaultScriptsFolder,
	handleToggleScriptsVisible,
	organisedScriptsToScripts,
	handleCPGScriptTagClick,
	handleRun,
	runSelected,
	deleteAll,
	deleteSelected,
	collectArgsValues,
	toggleScriptsArgsDialog,
} from './cpgScriptsScripts';
import commonStyles from '../../assets/js/styles';

const useStyles = makeStyles(styles);
const useCommonStyles = makeStyles(commonStyles);

function CpgScripts(props) {
	const scriptsContainerEl = React.useRef(null);
	const classes = useStyles(props);
	const commonClasses = useCommonStyles(props);

	const [state, setState] = React.useState({
		scripts: {},
		scriptsVisible: true,
		scrolled: false,
		selected: {},
		dialogFields: [],
		openDialog: false,
		scriptsMenuIsOpen: false,
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

	const refs = {
		dialogEl: React.useRef(null),
	};

	React.useEffect(() => {
		const handleGetCpgScripts = async () => {
			const scripts = await getCpgScripts(props);
			handleSetState({ scripts: scripts || {} });
		};
		handleGetCpgScripts();
		watchFolderPath(props.scriptsDir, chokidarVars, handleGetCpgScripts);
	}, [props.scriptsDir]);

	React.useEffect(() => {
		const callback = e =>
			handleSetState({ scrolled: isElementScrolled(e) });

		if (scriptsContainerEl.current) {
			scriptsContainerEl.current.addEventListener('scroll', callback);

			return () =>
				scriptsContainerEl.current &&
				scriptsContainerEl.current.removeEventListener(
					'scroll',
					callback,
				);
		}
	}, [scriptsContainerEl.current]);

	const {
		scripts,
		selected,
		scriptsVisible,
		scrolled,
		openDialog,
		dialogFields,
		scriptsMenuIsOpen,
		openDiscardDialog,
		discardDialogCallback,
	} = state;

	const { openFiles, openFilePath } = props;

	return Object.keys(props.projects).length > 0 ? (
		<ClickAwayListener
			onClickAway={() => {
				handleSetState({ selected: {} });
			}}
		>
			<div
				className={classes.rootStyle}
				tabIndex="0"
				data-test="cpg-scripts"
			>
				<div className={classes.titleSectionStyle}>
					{scriptsVisible ? (
						<Icon
							className={commonClasses.iconStyle}
							icon="chevron-down"
							onClick={() =>
								handleSetState(
									handleToggleScriptsVisible(scriptsVisible),
								)
							}
						/>
					) : (
						<Icon
							className={commonClasses.iconStyle}
							icon="chevron-right"
							onClick={() =>
								handleSetState(
									handleToggleScriptsVisible(scriptsVisible),
								)
							}
						/>
					)}
					<h2
						className={classes.titleStyle}
						onClick={() =>
							handleSetState(
								handleToggleScriptsVisible(scriptsVisible),
							)
						}
					>
						scripts
					</h2>

					<Popover2
						content={
							<Menu className={classes.menuStyle}>
								<MenuItem
									className={classes.menuItemStyle}
									onClick={() =>
										handleSetState(
											handleRun(
												organisedScriptsToScripts(
													scripts,
												),
												scripts,
												props,
											),
										)
									}
									text="Run All"
								/>
								<MenuItem
									className={classes.menuItemStyle}
									onClick={() =>
										handleSetState(
											handleRun(selected, scripts, props),
										)
									}
									text="Run Selected"
								/>
								<MenuDivider
									className={classes.menuDividerStyle}
								/>
								<MenuItem
									className={classes.menuItemStyle}
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
									text="New Script"
								/>
								<MenuItem
									className={classes.menuItemStyle}
									onClick={() => deleteAll(scripts)}
									text="Delete All"
								/>
								<MenuItem
									className={classes.menuItemStyle}
									onClick={() => deleteSelected(selected)}
									text="Delete Selected"
								/>
								<MenuDivider
									className={classes.menuDividerStyle}
								/>
								<MenuItem
									className={classes.menuItemStyle}
									onClick={() =>
										switchDefaultScriptsFolder(props)
									}
									text="Switch Default Scripts Folder"
								/>
							</Menu>
						}
						placement="top-start"
						interactionKind="click"
						minimal={true}
						openOnTargetFocus={false}
						isOpen={scriptsMenuIsOpen}
						onInteraction={bool =>
							handleSetState({ scriptsMenuIsOpen: bool })
						}
					>
						<Icon
							icon="more"
							className={clsx(
								commonClasses.iconStyle,
								classes.verticalMoreStyle,
							)}
						/>
					</Popover2>
				</div>
				<div
					ref={scriptsContainerEl}
					className={clsx(
						classes.scriptsSectionStyle,
						commonClasses.scrollBarStyle,
						commonClasses.scrollBarDarkStyle,
						{
							[commonClasses.insetScrolledStyle]: scrolled,
							[classes.scriptsVisible]: scriptsVisible,
							[classes.scriptsHidden]: !scriptsVisible,
						},
					)}
				>
					{openProjectExists(props.projects) &&
					scriptsVisible &&
					scripts
						? Object.keys(scripts).map((value, index) => {
								if (!scripts[value].tag) {
									let filename = value.split('/');
									filename = filename[filename.length - 1];
									return (
										<CpgScript
											key={`${index}-${value}`}
											filename={filename}
											path={value}
											mainFunctionName={
												scripts[value].mainFunctionName
											}
											mainFunctionArgs={
												scripts[value].mainFunctionArgs
											}
											selected={selected}
											hasTag={false}
											handleSetState={handleSetState}
											runScript={({ selected }) =>
												handleSetState(
													handleRun(
														selected,
														scripts,
														props,
													),
												)
											}
										/>
									);
								}
								if (scripts[value].tag) {
									return (
										<>
											<h3
												className={classes.tagNameStyle}
												onClick={e =>
													handleSetState(
														discardDialogHandler(
															openFiles,
															openFilePath,
															() => {
																handleSetState(
																	handleCPGScriptTagClick(
																		e,
																		value,
																		scripts,
																		selected,
																	),
																);
															},
														),
													)
												}
											>
												{value}
											</h3>
											{Object.keys(scripts[value]).map(
												path => {
													if (
														scripts[value][path] !==
														true
													) {
														let filename =
															path.split('/');
														filename =
															filename[
																filename.length -
																	1
															];
														return (
															<CpgScript
																filename={
																	filename
																}
																path={path}
																mainFunctionName={
																	scripts[
																		value
																	][path]
																		.mainFunctionName
																}
																mainFunctionArgs={
																	scripts[
																		value
																	][path]
																		.mainFunctionArgs
																}
																selected={
																	selected
																}
																hasTag={true}
																handleSetState={
																	handleSetState
																}
																runScript={({
																	selected,
																}) =>
																	handleSetState(
																		handleRun(
																			selected,
																			scripts,
																			props,
																		),
																	)
																}
															/>
														);
													}
													return undefined;
												},
											)}
										</>
									);
								}
								return null;
						  })
						: null}

					<Dialog
						portalClassName={classes.scriptsArgsDialogStyle}
						title="Specify Arguments"
						isCloseButtonShown={false}
						autoFocus={true}
						canEscapeKeyClose={true}
						canOutsideClickClose={true}
						enforceFocus={true}
						isOpen={openDialog}
						onClose={() =>
							handleSetState(toggleScriptsArgsDialog(openDialog))
						}
						usePortal={true}
					>
						<div
							className={classes.scriptsArgsDialogContentStyle}
							ref={refs.dialogEl}
						>
							<p>
								please specify the arguments to be passed into
								the function(s) to be executed
							</p>
							{dialogFields.map(script =>
								script.mainFunctionArgs.length > 0 ? (
									<>
										<div>
											<h3>
												{`${script.filename} `}
												<Icon icon="chevron-right" />
												{` ${script.mainFunctionName} (`}
											</h3>
											{script.mainFunctionArgs.map(
												arg => (
													<>
														<h4>{arg}</h4>
														<input
															type="text"
															id={`${script.filename.replaceAll(
																'.',
																'-',
															)}-${
																script.mainFunctionName
															}-${arg}`}
															placeholder={`......`}
														/>
													</>
												),
											)}
											<h3>{`)`}</h3>
										</div>
										<Divider
											className={classes.menuDividerStyle}
										/>
									</>
								) : null,
							)}
						</div>
						<div className={classes.runSectionStyle}>
							<h3
								onClick={() =>
									handleSetState(
										toggleScriptsArgsDialog(openDialog),
									)
								}
							>
								Cancel
							</h3>
							<h3
								className="run"
								onClick={() => {
									runSelected(
										collectArgsValues(
											refs.dialogEl,
											dialogFields,
										),
										selected,
										scripts,
										props,
									);
									handleSetState(
										toggleScriptsArgsDialog(openDialog),
									);
								}}
							>
								Run
							</h3>
						</div>
					</Dialog>
					<DiscardDialog
						handleSetState={handleSetState}
						openDiscardDialog={openDiscardDialog}
						callback={discardDialogCallback}
					/>
				</div>
			</div>
		</ClickAwayListener>
	) : null;
}

const mapStateToProps = state => ({
	openFiles: filesSelectors.selectOpenFiles(state),
	openFilePath: filesSelectors.selectOpenFilePath(state),
	projects: workSpaceSelectors.selectProjects(state),
	path: workSpaceSelectors.selectPath(state),
	scriptsDir: settingsSelectors.selectScriptsDir(state),
	prefersDarkMode: settingsSelectors.selectPrefersDarkMode(state),
});

const mapDispatchToProps = dispatch => ({
	setScriptsDir: payload => dispatch(settingsActions.setScriptsDir(payload)),
	enQueueScriptsQuery: query =>
		dispatch(queryActions.enQueueScriptsQuery(query)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CpgScripts);
