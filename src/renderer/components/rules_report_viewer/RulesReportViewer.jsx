import React from 'react';
import clsx from 'clsx';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import { Icon, Menu, MenuItem } from '@blueprintjs/core';
import { Popover2, Tooltip2 } from '@blueprintjs/popover2';
import { Viewer } from '@microsoft/sarif-web-component';
import * as findingsActions from '../../store/actions/findingsActions';
import * as settingsSelectors from '../../store/selectors/settingsSelectors';
import * as findingsSelectors from '../../store/selectors/findingsSelectors';
import * as querySelectors from '../../store/selectors/querySelectors';
import {
	exportValidResults,
	rotateTriageIdArrIndexRight,
	rotateTriageIdArrIndexLeft,
	getFindingsSarifFromTriages,
	getFindingsSarifFromLocalPath,
	addValidityButtonsToFindingsElement,
	removeValidityButtonsFromFindingsElement,
} from './rulesReportViewerScripts';
import {
	queueEmpty,
	scriptsQueueEmpty,
	selectFilePath,
	openFile,
} from '../../assets/js/utils/scripts';
import styles from '../../assets/js/styles/components/rules_report_viewer/rulesReportViewerStyles';
import commonStyles from '../../assets/js/styles';

const useCommonStyles = makeStyles(commonStyles);
const useStyles = makeStyles(styles);

function RulesReportViewer(props) {
	const refs = {
		sarifViewerContainerEl: React.useRef(null),
		sarifViewerEl: React.useRef(null),
	};

	React.useEffect(() => {
		setTimeout(
			() => props.windowViewHandleSetState({ terminalHeight: '218px' }),
			0,
		); // reduce height of terminal
	}, [refs.sarifViewerEl.current]);

	const [state, setState] = React.useState({
		findings_sarif: null,
		findings_sarif_from_path: null,
		controlsContainerMenuOpen: false,
		prev_triage_ids_length: 0,
		triage_id_arr_index: null,
	});

	const handleSetState = obj => {
		if (obj) {
			Promise.resolve(obj).then(obj => {
				setState(state => ({ ...state, ...obj }));
			});
		}
	};

	const {
		findings_sarif,
		findings_sarif_from_path,
		controlsContainerMenuOpen,
		triage_id_arr_index,
		prev_triage_ids_length,
	} = state;

	const { triage_ids, open_sarif_finding_path } = props.findings;

	React.useEffect(() => {
		if (refs.sarifViewerEl.current) {
			removeValidityButtonsFromFindingsElement(
				refs.sarifViewerContainerEl.current,
			);
			addValidityButtonsToFindingsElement(
				refs.sarifViewerContainerEl.current,
				findings_sarif,
				findings_sarif_from_path,
				triage_id_arr_index,
			);
		}
	}, [refs.sarifViewerEl.current, findings_sarif, findings_sarif_from_path]);

	React.useEffect(() => {
		const findings_sarif = getFindingsSarifFromTriages(triage_id_arr_index);
		const findings_sarif_from_path = getFindingsSarifFromLocalPath();

		handleSetState({
			findings_sarif: findings_sarif ? [findings_sarif] : null,
			findings_sarif_from_path: findings_sarif_from_path
				? [findings_sarif_from_path]
				: null,
			prev_triage_ids_length: triage_ids.length,
			triage_id_arr_index:
				triage_ids.length !== prev_triage_ids_length
					? null
					: triage_id_arr_index,
		});
	}, [props.findings, triage_id_arr_index]);

	const classes = useStyles(props);
	const commonClasses = useCommonStyles(props);

	const findings = findings_sarif_from_path || findings_sarif;

	return (
		<div
			ref={refs.sarifViewerContainerEl}
			className={clsx(classes.rootStyle, 'sarif-viewer', {
				dark: props.prefersDarkMode,
			})}
		>
			{!(queueEmpty() && scriptsQueueEmpty()) ? ( // TODO remember to remove queueEmpty from this condition as it is only here for demo purpose and should be removed when all issues have been fixed
				<div className={classes.loadingContainerStyle}>
					<Icon
						icon="refresh"
						iconSize={40}
						className={clsx(
							classes.loadingIconStyle,
							'refresh-icon-animation',
						)}
					/>
				</div>
			) : !findings ? (
				<>
					<p className={classes.messageStyle}>Empty Rule Results</p>
					<div>
						<button
							className={clsx(
								classes.buttonStyle,
								classes.primaryButtonStyle,
							)}
						>
							Execute Rule(s)
						</button>
						<button
							className={clsx(
								classes.buttonStyle,
								classes.primaryButtonStyle,
							)}
							onClick={() => {
								selectFilePath().then(path => {
									path &&
										props.setFindings({
											open_sarif_finding_path: path,
										});
								});
							}}
						>
							Open Finding Sarif
						</button>
					</div>
				</>
			) : (
				<>
					{/* <Switch defaultChecked={true} innerLabelChecked="valid" innerLabel="invalid" /> */}
					<div className={classes.controlsContainerStyle}>
						<div className={classes.secondControlsContainerStyle}>
							<Popover2
								content={
									<Menu className={classes.menuStyle}>
										<MenuItem
											className={classes.menuItemStyle}
											onClick={() =>
												props.setFindings({
													open_sarif_finding_path: '',
												})
											}
											text="Browse Triage History"
										></MenuItem>
										<MenuItem
											className={classes.menuItemStyle}
											onClick={() => {
												selectFilePath().then(path => {
													path &&
														props.setFindings({
															open_sarif_finding_path:
																path,
														});
												});
											}}
											text="Open Finding Sarif"
										></MenuItem>
									</Menu>
								}
								placement="top-start"
								interactionKind="click"
								minimal={true}
								openOnTargetFocus={false}
								isOpen={controlsContainerMenuOpen}
								onInteraction={bool =>
									handleSetState({
										controlsContainerMenuOpen: bool,
									})
								}
							>
								<Icon
									icon="more"
									className={clsx(
										commonClasses.cursorPointer,
										commonClasses.iconStyle,
										classes.verticalMoreStyle,
									)}
								/>
							</Popover2>
							<div className={classes.controlsContainerBodyStyle}>
								{findings_sarif_from_path ? (
									<Tooltip2
										popoverClassName={
											commonClasses.toolTipStyle
										}
										content={
											<span
												className={
													commonClasses.toolTipTextStyle
												}
											>
												{open_sarif_finding_path}
											</span>
										}
										placement="top"
										usePortal={false}
										openOnTargetFocus={false}
									>
										<a
											onClick={e => {
												e.preventDefault();
												openFile(
													open_sarif_finding_path,
												);
											}}
											className={
												classes.sarifFindingPathStyle
											}
										>
											{open_sarif_finding_path}
										</a>
									</Tooltip2>
								) : (
									<div
										className={classes.controlElementsStyle}
									>
										<Icon
											className={clsx(
												commonClasses.cursorPointer,
												commonClasses.iconStyle,
												classes.chevLeftStyle,
											)}
											icon="chevron-down"
											size={30}
											onClick={() =>
												handleSetState(
													rotateTriageIdArrIndexLeft(
														triage_id_arr_index,
														triage_ids.length,
													),
												)
											}
										/>
										<span className={classes.messageStyle}>
											{triage_id_arr_index === null
												? triage_ids.length
												: triage_id_arr_index + 1}
										</span>
										<Icon
											className={clsx(
												commonClasses.cursorPointer,
												commonClasses.iconStyle,
												classes.chevRightStyle,
											)}
											icon="chevron-down"
											size={30}
											onClick={() =>
												handleSetState(
													rotateTriageIdArrIndexRight(
														triage_id_arr_index,
														triage_ids.length,
													),
												)
											}
										/>
									</div>
								)}
							</div>
							<div
								className={clsx(classes.exportButtonStyle, {
									[commonClasses.displayNone]:
										findings_sarif_from_path,
								})}
								onClick={() =>
									exportValidResults(triage_id_arr_index)
								}
							>
								Export Valid Results
							</div>
						</div>
					</div>
					<Viewer
						ref={refs.sarifViewerEl}
						logs={findings}
						hideBaseline // showBaseline
						hideSuppression // showSuppression
						showLevel // hideLevel
						hideAge // showAge
						// filterState={{
						// 	Suppression: { value: ['unsuppressed'] },
						// 	Baseline: { value: ['new'] },
						// 	Level: { value: ['error', 'warning'] },
						// }}
						successMessage="No validated credentials detected."
					/>
				</>
			)}
		</div>
	);
}

const mapStateToProps = state => ({
	prefersDarkMode: settingsSelectors.selectPrefersDarkMode(state),
	findings: findingsSelectors.selectFindings(state),
  queue: querySelectors.selectQueue(state),
  scriptsQueue: querySelectors.selectScriptsQueue(state)
});

const mapDispatchToProps = dispatch => ({
	setFindings: findings => {
		dispatch(findingsActions.setFindings(findings));
	},
});

export default connect(mapStateToProps, mapDispatchToProps)(RulesReportViewer);
