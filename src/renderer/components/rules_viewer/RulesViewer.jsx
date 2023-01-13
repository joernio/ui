import React from 'react';
import clsx from 'clsx';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import { Tooltip2 } from '@blueprintjs/popover2';
import { Icon, Label, HTMLSelect, Checkbox } from '@blueprintjs/core';
import * as settingsSelectors from '../../store/selectors/settingsSelectors';
import * as statusActions from '../../store/actions/statusActions';
import {
	chokidarVars,
	isSelectedConfig,
	rulesConfigFilePathIsValid,
	validateConfigs,
	getUniqueTags,
	filterConfigs,
	handleConfigClick,
	handleConfigCheckboxClick,
	getRunAllButtonString,
	getSelectedConfigs,
	runSelectedConfigs,
} from './rulesViewerScripts';
import {
	readFile,
	parseJsonc,
	watchPath,
	openFile,
} from '../../assets/js/utils/scripts';
import styles from '../../assets/js/styles/components/rules_viewer/rulesViewerStyles';
import commonStyles from '../../assets/js/styles';

const useCommonStyles = makeStyles(commonStyles);
const useStyles = makeStyles(styles);

function RulesViewer(props) {
	const [state, setState] = React.useState({
		configs: { values: [], err: null },
		tags_filter: { current: '', values: {} },
		languages_filter: { current: '', values: {} },
		filtered_configs: [],
		selected_keys: {},
	});

	const refs = {
		stateRef: React.useRef(state),
		configsEl: React.useRef(null),
	};

	const classes = useStyles({
		...props,
		configs_body_width:
			refs.configsEl.current?.getBoundingClientRect().width,
	});
	const commonClasses = useCommonStyles(props);

	const handleSetState = obj => {
		if (obj) {
			Promise.resolve(obj).then(obj => {
				setState(state => ({ ...state, ...obj }));
			});
		}
	};

	refs.stateRef.current = state;
	const { rulesConfigFilePath } = props;
	const {
		configs,
		filtered_configs,
		tags_filter,
		languages_filter,
		selected_keys,
	} = state;

	React.useEffect(() => {
		setTimeout(
			() => props.windowViewHandleSetState({ terminalHeight: '218px' }),
			0,
		); // reduce height of terminal
	}, [refs.configsEl.current]);

	React.useEffect(() => {
		rulesConfigFilePathIsValid(rulesConfigFilePath).then(valid => {
			if (valid) {
				// get the content of the config file
				readFile(rulesConfigFilePath)
					.then(data => {
						try {
							const parsed_json = parseJsonc(data);
							try {
								handleSetState({
									configs: {
										values: validateConfigs(parsed_json),
										err: null,
									},
								});
							} catch (e) {
								handleSetState({
									configs: { values: [], err: String(e) },
								});
							}
						} catch {
							handleSetState({
								configs: {
									values: [],
									err: 'Rules config file content is invalid. Config is not a valid json',
								},
							});
						}
					})
					.catch(() => {
						handleSetState({
							configs: {
								values: [],
								err: "Rules config file path is not valid. This is most likely a permission issue or the path doesn't exist",
							},
						});
					});

				// watch config file and re-fetch content if file changes
				watchPath(rulesConfigFilePath, chokidarVars, (_, path) => {
					readFile(path)
						.then(data => {
							try {
								const parsed_json = parseJsonc(data);
								try {
									handleSetState({
										configs: {
											values: validateConfigs(
												parsed_json,
											),
											err: null,
										},
									});
								} catch (e) {
									handleSetState({
										configs: { values: [], err: String(e) },
									});
								}
							} catch {
								handleSetState({
									configs: {
										values: [],
										err: 'Rules config file content is invalid. Config is not a valid json',
									},
								});
							}
						})
						.catch(() => {
							handleSetState({
								configs: {
									values: [],
									err: "Rules config file path is not valid. This is most likely a permission issue or the path doesn't exist",
								},
							});
						});
				});
			} else if (chokidarVars.chokidarWatcher) {
				chokidarVars.chokidarWatcher.close().then(() => {
					handleSetState({
						configs: {
							values: [],
							err: "Rules config file path is not valid. This is most likely a permission issue or the path doesn't exist",
						},
					});
				});
			} else {
				handleSetState({
					configs: {
						values: [],
						err: "Rules config file path is not valid. This is most likely a permission issue or the path doesn't exist",
					},
				});
			}
		});

		return () => {
			chokidarVars.chokidarWatcher?.close();
		};
	}, [rulesConfigFilePath]);

	React.useEffect(() => {
		if (configs.values.length > 0) {
			handleSetState({
				tags_filter: {
					current: '',
					values: getUniqueTags('tags', configs.values),
				},
			});
			handleSetState({
				languages_filter: {
					current: '',
					values: getUniqueTags('languages', configs.values),
				},
			});
		}
	}, [configs]);

	React.useEffect(() => {
		if (configs.values.length > 0) {
			handleSetState({
				filtered_configs: filterConfigs(
					tags_filter.current,
					languages_filter.current,
					configs.values,
				),
			});
		}
	}, [tags_filter, languages_filter]);

	return (
		<div className={classes.rootStyle}>
			{chokidarVars.chokidarWatcher === null ||
			(chokidarVars.chokidarWatcher?.closed && configs.err) ? (
				<>
					<p className={classes.messageStyle}>{configs.err}</p>
					<button
						className={clsx(
							classes.buttonStyle,
							classes.primaryButtonStyle,
						)}
						onClick={() => props.setSettingsDialogIsOpen(true)}
					>
						Fix in settings
					</button>
				</>
			) : !chokidarVars.chokidarWatcher?.closed && configs.err ? (
				<>
					<p className={classes.messageStyle}>{configs.err}</p>
					<button
						className={clsx(
							classes.buttonStyle,
							classes.primaryButtonStyle,
						)}
						onClick={() => openFile(rulesConfigFilePath)}
					>
						Edit config
					</button>
				</>
			) : !chokidarVars.chokidarWatcher?.closed &&
			  configs.values.length > 0 ? (
				<div className={classes.configsSectionStyle}>
					<div className={classes.configsFilterSectionStyle}>
						<Label className={classes.configsFilterLabelStyle}>
							<h4>Language</h4>
							<HTMLSelect
								className={classes.selectInputStyle}
								minimal={true}
								id="languages"
								defaultValue=""
								value={languages_filter.current}
								onChange={e => {
									handleSetState({
										languages_filter: {
											current: e.target.value,
											values: languages_filter.values,
										},
									});
								}}
							>
								<option value="">----</option>
								{Object.keys(languages_filter.values).map(
									language => (
										<option key={language} value={language}>
											{language}
										</option>
									),
								)}
							</HTMLSelect>
						</Label>

						<Label className={classes.configsFilterLabelStyle}>
							<h4>Tag</h4>
							<HTMLSelect
								className={classes.selectInputStyle}
								minimal={true}
								id="tags"
								defaultValue=""
								value={tags_filter.current}
								onChange={e => {
									handleSetState({
										tags_filter: {
											current: e.target.value,
											values: tags_filter.values,
										},
									});
								}}
							>
								<option value="">----</option>
								{Object.keys(tags_filter.values).map(tag => (
									<option key={tag} value={tag}>
										{tag}
									</option>
								))}
							</HTMLSelect>
						</Label>
					</div>
					<div
						ref={refs.configsEl}
						className={clsx(
							classes.configsBodyStyle,
							commonClasses.scrollBarStyle,
							commonClasses.scrollBarDarkStyle,
						)}
					>
						{filtered_configs.length === 0 ? (
							<div className={classes.configsFilterNotFoundStyle}>
								<div
									className={
										classes.configsFilterNotFoundIconStyle
									}
								>
									<Icon
										className={classes.iconStyle}
										icon="search"
										iconSize={50}
									/>
									<Icon
										className={clsx(
											classes.iconStyle,
											classes.crossIconStyle,
										)}
										icon="cross"
										iconSize={30}
									/>
								</div>
								<p className={classes.messageStyle}>
									Rules config matching filter term(s) not
									found
								</p>
							</div>
						) : (
							<>
								{filtered_configs.map(config => (
									<div
										key={config.id}
										className={
											classes.filteredConfigContainerStyle
										}
									>
										<Tooltip2
											className={
												classes.configToolTipStyle
											}
											popoverClassName={
												commonClasses.toolTipStyle
											}
											content={
												<div
													className={
														commonClasses.toolTipTextStyle
													}
												>
													{config.filename}
												</div>
											}
											placement="top"
											openOnTargetFocus={false}
											usePortal={true}
											inheritDarkTheme={false}
										>
											<div
												className={clsx(
													classes.configStyle,
													{
														[classes.selectedConfigStyle]:
															isSelectedConfig(
																selected_keys,
																config,
															),
													},
												)}
												onClick={e => {
													handleSetState({
														selected_keys:
															handleConfigClick(
																e,
																selected_keys,
																config,
															),
													});
												}}
											>
												<span
													onClick={e => {
														e.stopPropagation();
													}}
												>
													<Checkbox
														className={
															classes.configCheckboxStyle
														}
														large={true}
														checked={isSelectedConfig(
															selected_keys,
															config,
														)}
														onClick={() => {
															handleSetState({
																selected_keys:
																	handleConfigCheckboxClick(
																		selected_keys,
																		config,
																	),
															});
														}}
													/>
												</span>
												<div
													className={
														classes.configBodyStyle
													}
												>
													<h3
														className={
															classes.configTitleStyle
														}
													>
														{config.title}
													</h3>
													<p
														className={
															classes.configDescStyle
														}
													>
														{config.description}
													</p>

													<div
														className={
															classes.configTagSectionStyle
														}
													>
														{config.languages.map(
															(
																language,
																index,
															) => (
																<button
																	key={`${index}-${language}`}
																	className={clsx(
																		classes.smallButtonStyle,
																		classes.secondaryButtonStyle,
																	)}
																	onClick={e => {
																		e.stopPropagation();
																		handleSetState(
																			{
																				languages_filter:
																					{
																						current:
																							language,
																						values: languages_filter.values,
																					},
																			},
																		);
																	}}
																>
																	{language}
																</button>
															),
														)}
														{config.tags.map(
															(tag, index) => (
																<button
																	key={`${index}-${tag}`}
																	className={clsx(
																		classes.smallButtonStyle,
																		classes.secondaryButtonStyle,
																	)}
																	onClick={e => {
																		e.stopPropagation();
																		handleSetState(
																			{
																				tags_filter:
																					{
																						current:
																							tag,
																						values: tags_filter.values,
																					},
																			},
																		);
																	}}
																>
																	{tag}
																</button>
															),
														)}
													</div>
												</div>
												<button
													className={clsx(
														classes.buttonStyle,
														classes.configButtonStyle,
														classes.primaryButtonStyle,
													)}
													onClick={e => {
														e.stopPropagation();
														handleSetState({
															selected_keys: {
																[config.index_in_configs]:
																	config.id,
															},
														});
														runSelectedConfigs([
															config,
														]);
													}}
												>
													Run
												</button>
											</div>
										</Tooltip2>
									</div>
								))}
							</>
						)}
					</div>
					<div className={classes.configsFooterStyle}>
						<button
							className={clsx(
								classes.buttonStyle,
								classes.secondaryButtonStyle,
								classes.configsFooterButtonStyle,
							)}
							onClick={() => openFile(rulesConfigFilePath)}
						>
							Add / Edit Rules
						</button>
						<button
							className={clsx(
								classes.buttonStyle,
								classes.primaryButtonStyle,
								classes.configsFooterButtonStyle,
								{
									[commonClasses.displayNone]:
										filtered_configs.length === 0,
								},
							)}
							onClick={() => {
								const selected_configs = getSelectedConfigs(
									selected_keys,
									configs,
								);
								runSelectedConfigs(
									selected_configs.length
										? selected_configs
										: configs.values,
								);
							}}
						>
							{getRunAllButtonString(selected_keys, configs)}
						</button>
					</div>
				</div>
			) : null}
		</div>
	);
}

const mapStateToProps = state => ({
	prefersDarkMode: settingsSelectors.selectPrefersDarkMode(state),
	rulesConfigFilePath: settingsSelectors.selectRulesConfigFilePath(state),
});

const mapDispatchToProps = dispatch => ({
	setSettingsDialogIsOpen: bool =>
		dispatch(statusActions.setSettingsDialogIsOpen(bool)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RulesViewer);
