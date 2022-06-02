import React from 'react';
import { connect } from 'react-redux';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core';
import { parseScriptReportJSON } from './scriptReportViewerScripts';
import styles from '../../assets/js/styles/components/script_report_viewer/scriptReportViewerStyles';
import commonStyles from '../../assets/js/styles';
import EditorWindowBanner from '../editor_window_banner/EditorWindowBanner';

const useStyles = makeStyles(styles);
const useCommonStyles = makeStyles(commonStyles);

function ScriptReportViewer(props) {
	const classes = useStyles(props);
	const commonClasses = useCommonStyles(props);
	const [state, setState] = React.useState({
		report: {},
		bannerMessage: '',
	});

	const handleSetState = obj => {
		if (obj) {
			Promise.resolve(obj).then(obj => {
				setState(state => ({ ...state, ...obj }));
			});
		}
	};

	React.useEffect(() => {
		handleSetState(parseScriptReportJSON(props.content));
	}, [props.content]);

	const { report, bannerMessage } = state;

	return (
		<>
			<EditorWindowBanner message={bannerMessage} />
			{bannerMessage ? (
				<div
					className={clsx(
						classes.rawJSONContainerStyle,
						commonClasses.scrollBarStyle,
						commonClasses.scrollBarLightStyle,
					)}
				>
					{props.content.split('\n').map((str, idx) => (
						<p key={`${idx}-${str}`}>{str}</p>
					))}
				</div>
			) : (
				<div
					className={clsx(
						classes.parsedReportStyle,
						commonClasses.scrollBarStyle,
						commonClasses.scrollBarLightStyle,
					)}
					data-test="script-report-viewer"
				>
					<div className={classes.propertiesContainerStyle}>
						<div>
							<h3>Title</h3>
							<p>{report.title}</p>
						</div>

						<div>
							<h3>Description</h3>
							<p>{report.description}</p>
						</div>

						<div>
							<h3>Recommendation</h3>
							<p>{report.recommendation}</p>
						</div>
						{Array.isArray(report.location) &&
						report.location.length > 0 ? null : (
							<div>
								<h3>Message</h3>
								<p>Script run was successful</p>
							</div>
						)}
					</div>
					{Array.isArray(report.location) &&
					report.location.length > 0 ? (
						<table className={classes.locationsContainerStyle}>
							<tr>
								<th className={classes.conditionHeadingStyle}>
									Condition
								</th>
								<th
									className={
										classes.locationsTableHeadingStyle
									}
								>
									methodName
								</th>
								<th
									className={
										classes.locationsTableHeadingStyle
									}
								>
									fileName
								</th>
								<th
									className={
										classes.locationsTableHeadingStyle
									}
								>
									lineNumber
								</th>
							</tr>
							{report.location.map((result, index) => (
								<tr key={index}>
									<td>{result.condition}</td>
									<td>{result.methodName}</td>
									<td>{result.fileName}</td>
									<td>{result.lineNumber}</td>
								</tr>
							))}
						</table>
					) : null}
				</div>
			)}
		</>
	);
}

const mapStateToProps = state => ({
	settings: state.settings,
});

export default connect(mapStateToProps, null)(ScriptReportViewer);
