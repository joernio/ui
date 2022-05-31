import React from 'react';
import clsx from 'clsx';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { MenuDivider, Menu, MenuItem, Icon } from '@blueprintjs/core';
import { Popover2 } from '@blueprintjs/popover2';
import * as queryActions from '../../store/actions/queryActions';
import * as settingsSelectors from '../../store/selectors/settingsSelectors';
import * as querySelectors from '../../store/selectors/querySelectors';
import * as workSpaceSelectors from '../../store/selectors/workSpaceSelectors';
import Project from '../project/Project';
import styles from '../../assets/js/styles/components/workspace/workspaceStyles';
import {
	latestIsManCommand,
	queueEmpty,
	addToQueue,
	addWorkSpaceQueryToQueue,
	handleSwitchWorkspace,
	contructQueryWithPath,
	handleScrollTop,
} from '../../assets/js/utils/scripts';
import { handleToggleProjectsVisible } from './workspaceScripts';
import commonStyles from '../../assets/js/styles';

const useStyles = makeStyles(styles);
const useCommonStyles = makeStyles(commonStyles);

function Workspace(props) {
	const refs = {
		projectsContainerEl: React.useRef(null),
		workspaceRef: React.useRef(null),
		importCodeInputEl: React.useRef(null),
		importCpgInputEl: React.useRef(null),
	};
	const classes = useStyles(props);
	const commonClasses = useCommonStyles(props);

	const [state, setState] = React.useState({
		projectsVisible: true,
		scrolled: false,
		workspaceMenuIsOpen: false,
	});

	const handleSetState = obj => {
		if (obj) {
			Promise.resolve(obj).then(obj => {
				setState(state => ({ ...state, ...obj }));
			});
		}
	};

	React.useEffect(() => {
		const callback = e => handleSetState(handleScrollTop(e));

		if (refs.projectsContainerEl.current) {
			refs.projectsContainerEl.current.addEventListener(
				'scroll',
				callback,
			);
			return () =>
				refs.projectsContainerEl.current &&
				refs.projectsContainerEl.current.removeEventListener(
					'scroll',
					callback,
				);
		}
	}, [refs.projectsContainerEl.current]);

	const { projectsVisible, scrolled, workspaceMenuIsOpen } = state;

	return (
		<div data-test="workspace">
			{Object.keys(props.projects).length > 0 ||
			!queueEmpty(props.queue) ? (
				<div className={classes.rootStyle} tabIndex="0">
					<div className={classes.titleSectionStyle}>
						{projectsVisible ? (
							<Icon
								className={classes.iconStyle}
								icon="chevron-down"
								onClick={() =>
									handleSetState(
										handleToggleProjectsVisible(
											projectsVisible,
										),
									)
								}
							/>
						) : (
							<Icon
								className={classes.iconStyle}
								icon="chevron-right"
								onClick={() =>
									handleSetState(
										handleToggleProjectsVisible(
											projectsVisible,
										),
									)
								}
							/>
						)}
						<h2
							className={classes.titleStyle}
							onClick={() =>
								handleSetState(
									handleToggleProjectsVisible(
										projectsVisible,
									),
								)
							}
						>
							Workspace
						</h2>
						{!queueEmpty(props.queue) &&
						latestIsManCommand(props.results) ? (
							<Icon
								icon="refresh"
								className={clsx(
									classes.iconStyle,
									'refresh-icon-animation',
								)}
							/>
						) : null}

						<Popover2
							content={
								<Menu className={classes.menuStyle}>
									<MenuItem
										className={classes.menuItemStyle}
										onClick={() =>
											addToQueue(
												addWorkSpaceQueryToQueue(),
												props,
											)
										}
										text="Refresh"
									></MenuItem>

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
										text="Switch Workspace"
									></MenuItem>
								</Menu>
							}
							placement="top-start"
							interactionKind="click"
							minimal={true}
							openOnTargetFocus={false}
							isOpen={workspaceMenuIsOpen}
							onInteraction={bool =>
								handleSetState({ workspaceMenuIsOpen: bool })
							}
						>
							<Icon
								icon="more"
								className={clsx(
									classes.iconStyle,
									classes.verticalMoreStyle,
								)}
							/>
						</Popover2>
					</div>

					<div
						ref={refs.projectsContainerEl}
						className={clsx(
							commonClasses.scrollBarStyle,
							commonClasses.scrollBarDarkStyle,
							classes.projectsSectionStyle,
							{
								[classes.scrolledStyle]: scrolled,
							},
							{
								[classes.projectsVisible]: projectsVisible,
								[classes.projectsHidden]: !projectsVisible,
							},
						)}
					>
						{projectsVisible &&
							Object.keys(props.projects).map((name, index) => (
								<Project
									key={`${name}-${index}`}
									name={name}
									index={index}
									{...props}
								/>
							))}
					</div>
				</div>
			) : (
				<>
					<div
						className={classes.emptyWorkspaceElementStyle}
						onClick={async () =>
							addToQueue(
								await contructQueryWithPath(
									'importCode',
									'select-dir',
								),
								props,
							)
						}
					>
						Import Directory
					</div>

					<div
						className={classes.emptyWorkspaceElementStyle}
						onClick={async () =>
							addToQueue(
								await contructQueryWithPath('importCode'),
								props,
							)
						}
					>
						Import File
					</div>

					<div
						className={classes.emptyWorkspaceElementStyle}
						onClick={async () =>
							addToQueue(
								await contructQueryWithPath('importCpg'),
								props,
							)
						}
					>
						Import Cpg
					</div>

					<div
						className={classes.emptyWorkspaceElementStyle}
						onClick={async () =>
							addToQueue(await handleSwitchWorkspace(), props)
						}
					>
						Switch Workspace
					</div>
				</>
			)}
		</div>
	);
}

const mapStateToProps = state => ({
	queue: querySelectors.selectQueue(state),
	results: querySelectors.selectResults(state),
	projects: workSpaceSelectors.selectProjects(state),
	prefersDarkMode: settingsSelectors.selectPrefersDarkMode(state),
});

const mapDispatchToProps = dispatch => ({
	enQueueQuery: query => dispatch(queryActions.enQueueQuery(query)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Workspace);
