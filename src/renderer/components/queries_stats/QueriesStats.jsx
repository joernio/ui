import React from 'react';
import clsx from 'clsx';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Icon } from '@blueprintjs/core';
import { Popover2, Tooltip2 } from '@blueprintjs/popover2';
import * as settingsSelectors from '../../store/selectors/settingsSelectors';
import * as querySelectors from '../../store/selectors/querySelectors';
import { queueEmpty, nFormatter } from '../../assets/js/utils/scripts';
import { countQueries, updateQueriesStats } from './queriesStatsScripts';
import styles from '../../assets/js/styles/components/queries_stats/queriesStatsStyles';
import commonStyles from '../../assets/js/styles';

const useStyles = makeStyles(styles);
const useCommonStyles = makeStyles(commonStyles);

function QueriesStats(props) {
	const classes = useStyles(props);
	const commonClasses = useCommonStyles(props);

	let updateQueryIntervalID = null;

	const [state, setState] = React.useState({
		queriesStatsPopoverIsOpen: false,
		queriesCount: 0,
		queriesStats: [],
	});

	const handleSetState = obj => {
		if (obj) {
			Promise.resolve(obj).then(obj => {
				setState(state => ({ ...state, ...obj }));
			});
		}
	};

	React.useEffect(() => {
		if (props.results) {
			handleSetState(countQueries(props.results));
		}
	}, [props.results]);

	React.useEffect(() => {
		if (state.queriesStatsPopoverIsOpen && props.results) {
			updateQueryIntervalID = setInterval(
				() =>
					setState(state => ({
						...state,
						...updateQueriesStats(props.results),
					})),
				100,
			);
		} else {
			clearInterval(updateQueryIntervalID);
		}

		return () => clearInterval(updateQueryIntervalID);
	}, [state.queriesStatsPopoverIsOpen]);

	const { queriesStatsPopoverIsOpen, queriesCount, queriesStats } = state;
	return (
		<Popover2
			className={classes.queriesStatsPopoverStyles}
			content={
				<div
					className={clsx(
						commonClasses.scrollBarStyle,
						commonClasses.scrollBarDarkStyle,
						classes.queriesStatsPopoverContentContainerStyle,
					)}
				>
					{queriesStats &&
						queriesStats.map((query_stat, idx) => (
							<div
								key={`${idx}-${query_stat.query}`}
								className={
									classes.queriesStatsQueryContainerStyle
								}
							>
								<div>
									<Tooltip2
										popoverClassName={commonClasses.toolTipStyle}
										content={
											<div
												className={
													commonClasses.toolTipTextStyle
												}
											>
												{query_stat.query}
											</div>
										}
										placement="top"
										openOnTargetFocus={false}
										usePortal={true}
										inheritDarkTheme={false}
									>
										<div
											className={
												classes.queriesStatsQueryPreviewStyle
											}
										>
											{query_stat.query}
										</div>
									</Tooltip2>

									<div
										className={
											classes.quriesStatsEllapsedTimeStyle
										}
									>
										{query_stat.t_elapsed
											? `${nFormatter(
													Math.ceil(
														query_stat.t_elapsed,
													),
											  )} ms`
											: null}
									</div>
								</div>
								<div
									className={clsx({
										[classes.queriesStatsQueryStatusPendingStyle]:
											!query_stat.completed,
										[classes.queriesStatsQueryStatusCompletedStyle]:
											query_stat.completed,
									})}
								>
									{query_stat.completed
										? 'completed'
										: 'pending'}
								</div>
							</div>
						))}
				</div>
			}
			placement="top-end"
			minimal={true}
			openOnTargetFocus={false}
			interactionKind="hover"
			isOpen={queriesStatsPopoverIsOpen}
			onInteraction={isOpen =>
				handleSetState({ queriesStatsPopoverIsOpen: isOpen })
			}
		>
			<div
				className={classes.queriesStatsSectionStyle}
				data-test="queries-stats"
			>
				<div className={classes.refreshIconContainerStyle}>
					{!queueEmpty(props.queue) ? (
						<Icon
							icon="refresh"
							className={clsx(
								classes.refreshIconStyle,
								'refresh-icon-animation',
							)}
						/>
					) : (
						<Icon
							icon="refresh"
							className={clsx(classes.refreshIconStyle)}
						/>
					)}
				</div>
				<p className={classes.queriesStatsStyle}>
					{nFormatter(queriesCount)}
				</p>
				{!queueEmpty(props.queue) ? <div>running...</div> : null}
			</div>
		</Popover2>
	);
}

const mapStateToProps = state => ({
	results: querySelectors.selectResults(state),
	queue: querySelectors.selectQueue(state),
	prefersDarkMode: settingsSelectors.selectPrefersDarkMode(state),
});

export default connect(mapStateToProps, null)(QueriesStats);
