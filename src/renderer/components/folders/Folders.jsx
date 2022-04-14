import React from 'react';
import { connect } from 'react-redux';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { Menu, MenuItem, Icon, Classes, Tree } from '@blueprintjs/core';
import { Popover2 } from '@blueprintjs/popover2';
import * as filesActions from '../../store/actions/filesActions';
import * as queryActions from '../../store/actions/queryActions';
import {
	handleScrollTop,
	openProjectExists,
	openFile,
	watchFolderPath,
	getFolderStructureRootPathFromWorkspace,
} from '../../assets/js/utils/scripts';
import styles from '../../assets/js/styles/components/folders/foldersStyles';

import {
	chokidarVars,
	createFolderJsonModel,
	handleToggleFoldersVisible,
	selectFolderStructureRootPath,
	shouldSwitchFolder,
} from './foldersScripts';
import commonStyles from '../../assets/js/styles';

const useCommonStyles = makeStyles(commonStyles);
const useStyles = makeStyles(styles);

function Folders(props) {
	const foldersContainerEl = React.useRef(null);
	const classes = useStyles(props);
	const commonClasses = useCommonStyles(props);
	const [state, setState] = React.useState({
		scrolled: false,
		foldersVisible: true,
		prev_workspace: {},
		foldersMenuIsOpen: false,
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

		if (foldersContainerEl.current) {
			foldersContainerEl.current.addEventListener('scroll', callback);

			return () =>
				foldersContainerEl.current &&
				foldersContainerEl.current.removeEventListener(
					'scroll',
					callback,
				);
		}
	}, [foldersContainerEl.current]);

	React.useEffect(() => {
		if (
			shouldSwitchFolder(
				state.prev_workspace,
				props.workspace ? props.workspace : {},
			)
		) {
			createFolderJsonModel(
				getFolderStructureRootPathFromWorkspace(props.workspace),
				(folders, root_path) => {
					props.setFolders(folders);

					watchFolderPath(root_path, chokidarVars, () => {
						createFolderJsonModel({ path: root_path }, folders => {
							props.setFolders(folders);
						});
					});
				},
			);
		}

		if (!openProjectExists(props.workspace)) {
			props.setFolders([]);
		}

		handleSetState({
			prev_workspace: JSON.parse(
				JSON.stringify(props.workspace ? props.workspace : {}),
			),
		});
	}, [props.workspace]);

	const handleToggleFolderExpand = React.useCallback((node, nodePath) => {
		props.expandOrCollapseFolder(nodePath, !node.isExpanded);
	}, []);

	const handleNodeSelection = React.useCallback(nodePath => {
		props.setIsSelected(nodePath);
	});

	const handleNodeClick = React.useCallback((node, nodePath) => {
		if (node.hasCaret) {
			handleToggleFolderExpand(node, nodePath);
		} else {
			openFile(node.id);
		}

		handleNodeSelection(nodePath);
	}, []);

	const { foldersVisible, scrolled, foldersMenuIsOpen } = state;

	const { folders } = props.files;

	const isOpenProject = openProjectExists(props.workspace);

	return Object.keys(props.workspace.projects).length > 0 ? (
		<div
			className={clsx(
				classes.rootStyle,
				props.settings.prefersDarkMode
					? 'folders-dark'
					: 'folders-light',
			)}
			tabIndex="0"
			data-test="folders"
		>
			<div className={classes.titleSectionStyle}>
				{foldersVisible ? (
					<Icon
						className={classes.iconStyle}
						icon="chevron-down"
						onClick={() =>
							handleSetState(
								handleToggleFoldersVisible(foldersVisible),
							)
						}
					/>
				) : (
					<Icon
						className={classes.iconStyle}
						icon="chevron-right"
						onClick={() =>
							handleSetState(
								handleToggleFoldersVisible(foldersVisible),
							)
						}
					/>
				)}
				<h2
					className={classes.titleStyle}
					onClick={() =>
						handleSetState(
							handleToggleFoldersVisible(foldersVisible),
						)
					}
				>
					Folders
				</h2>

				<Popover2
					content={
						<Menu className={classes.menuStyle}>
							<MenuItem
								className={classes.menuItemStyle}
								onClick={async () =>
									createFolderJsonModel(
										await selectFolderStructureRootPath(),
										(folders, root_path) => {
											props.setFolders(folders);
											watchFolderPath(
												root_path,
												chokidarVars,
												() => {
													createFolderJsonModel(
														{ path: root_path },
														folders => {
															props.setFolders(
																folders,
															);
														},
													);
												},
											);
										},
									)
								}
								text="Switch Folder"
							/>
						</Menu>
					}
					placement="top-start"
					interactionKind="click"
					minimal={true}
					openOnTargetFocus={false}
					isOpen={foldersMenuIsOpen}
					onInteraction={bool =>
						handleSetState({ foldersMenuIsOpen: bool })
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
				ref={foldersContainerEl}
				className={clsx(
					classes.foldersSectionStyle,
					commonClasses.scrollBarStyle,
					commonClasses.scrollBarDarkStyle,
					{
						[classes.scrolledStyle]: scrolled,
					},
					{
						[classes.foldersVisible]:
							isOpenProject && foldersVisible,
						[classes.foldersHidden]: !foldersVisible,
					},
				)}
			>
				{isOpenProject && folders ? (
					<Tree
						contents={folders}
						onNodeClick={handleNodeClick}
						onNodeCollapse={handleToggleFolderExpand}
						onNodeExpand={handleToggleFolderExpand}
						className={Classes.ELEVATION_0}
					/>
				) : null}
			</div>
		</div>
	) : null;
}

const mapStateToProps = state => ({
	query: state.query,
	workspace: state.workspace,
	files: state.files,
	settings: state.settings,
});

const mapDispatchToProps = dispatch => ({
	enQueueQuery: query => dispatch(queryActions.enQueueQuery(query)),
	expandOrCollapseFolder: (nodePath, bool) =>
		dispatch(filesActions.expandOrCollapseFolder(nodePath, bool)),
	setFolders: folders => dispatch(filesActions.setFolders(folders)),
	setIsSelected: nodePath => dispatch(filesActions.setIsSelected(nodePath)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Folders);
