import React from 'react';
import { connect } from 'react-redux';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { Menu, MenuItem, Icon, Classes, Tree } from '@blueprintjs/core';
import { Popover2 } from '@blueprintjs/popover2';
import * as filesActions from '../../store/actions/filesActions';
import * as filesSelectors from '../../store/selectors/filesSelectors';
import * as settingsSelectors from '../../store/selectors/settingsSelectors';
import * as workSpaceSelectors from '../../store/selectors/workSpaceSelectors';
import {
	isElementScrolled,
	openProjectExists,
	openFile,
	watchPath,
	getFolderStructureRootPathFromWorkspaceProjects,
	deepClone,
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
		prev_projects: {},
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
		const callback = e =>
			handleSetState({ scrolled: isElementScrolled(e) });

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
				state.prev_projects,
				props.projects ? props.projects : {},
			)
		) {
			createFolderJsonModel(
				getFolderStructureRootPathFromWorkspaceProjects(props.projects),
				(folders, root_path) => {
					props.setFolders(folders);

					watchPath(root_path, chokidarVars, () => {
						createFolderJsonModel({ path: root_path }, folders => {
							props.setFolders(folders);
						});
					});
				},
			);
		}

		if (!openProjectExists(props.projects)) {
			props.setFolders([]);
		}

		handleSetState({
			prev_projects: deepClone(props.projects ? props.projects : {}),
		});
	}, [props.projects]);

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

	const { folders } = props;

	const isOpenProject = openProjectExists(props.projects);

	return Object.keys(props.projects).length > 0 ? (
		<div
			className={clsx(
				classes.rootStyle,
				props.prefersDarkMode ? 'folders-dark' : 'folders-light',
			)}
			tabIndex="0"
			data-test="folders"
		>
			<div className={classes.titleSectionStyle}>
				{foldersVisible ? (
					<Icon
						className={clsx(
							commonClasses.cursorPointer,
							commonClasses.iconStyle,
						)}
						icon="chevron-down"
						onClick={() =>
							handleSetState(
								handleToggleFoldersVisible(foldersVisible),
							)
						}
					/>
				) : (
					<Icon
						className={clsx(
							commonClasses.cursorPointer,
							commonClasses.iconStyle,
						)}
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
											watchPath(
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
							commonClasses.cursorPointer,
							commonClasses.iconStyle,
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
						[commonClasses.insetScrolledStyle]: scrolled,
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
	projects: workSpaceSelectors.selectProjects(state),
	folders: filesSelectors.selectFolders(state),
	prefersDarkMode: settingsSelectors.selectPrefersDarkMode(state),
});

const mapDispatchToProps = dispatch => ({
	expandOrCollapseFolder: (nodePath, bool) =>
		dispatch(filesActions.expandOrCollapseFolder(nodePath, bool)),
	setFolders: folders => dispatch(filesActions.setFolders(folders)),
	setIsSelected: nodePath => dispatch(filesActions.setIsSelected(nodePath)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Folders);
