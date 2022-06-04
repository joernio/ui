import React from 'react';
import clsx from 'clsx';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Icon, MenuDivider, Menu, MenuItem } from '@blueprintjs/core';
import { ContextMenu2 } from '@blueprintjs/popover2';
import DiscardDialog from '../discard_dialog/DiscardDialog';
import * as filesSelectors from '../../store/selectors/filesSelectors';
import * as settingsSelectors from '../../store/selectors/settingsSelectors';
import {
	deleteFile,
	discardDialogHandler,
} from '../../assets/js/utils/scripts';
import {
	handleOpenScript,
	shouldOpenScriptsContextMenu,
} from './cpgScriptScripts';
import styles from '../../assets/js/styles/components/cpg_script/cpgScriptStyles';

const useStyles = makeStyles(styles);

function CpgScript(props) {
	const classes = useStyles(props);
	const [state, setState] = React.useState({
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

	const { openDiscardDialog, discardDialogCallback } = state;
	const {
		filename,
		path,
		selected,
		hasTag,
		handleSetState: parentHandleSetState,
		runScript,
		openFiles,
		openFilePath,
	} = props;

	return (
		<ContextMenu2
			onContextMenu={() => {
				shouldOpenScriptsContextMenu(selected, parentHandleSetState);
			}}
			content={
				Object.keys(selected).length > 1 ? null : (
					<Menu className={classes.menuStyle}>
						<MenuItem
							className={classes.menuItemStyle}
							onClick={e => {
								handleSetState(
									discardDialogHandler(
										openFiles,
										openFilePath,
										() => {
											runScript(
												handleOpenScript(
													e,
													path,
													selected,
												),
											);
										},
									),
								);
							}}
							text="Run"
						/>
						<MenuDivider className={classes.menuDividerStyle} />
						<MenuItem
							className={classes.menuItemStyle}
							onClick={() => {
								deleteFile(path);
							}}
							tabIndex="0"
							text="Delete"
						/>
					</Menu>
				)
			}
		>
			<div
				className={clsx(classes.scriptSectionStyle, {
					[classes.selectedStyle]: selected[path],
					[classes.taggedScriptSectionStyle]: hasTag,
				})}
				tabIndex="0"
			>
				<h3
					className={classes.scriptNameStyle}
					key={path}
					onClick={e =>
						handleSetState(
							discardDialogHandler(
								openFiles,
								openFilePath,
								() => {
									parentHandleSetState(
										handleOpenScript(e, path, selected),
									);
								},
							),
						)
					}
				>
					{filename}
				</h3>
				{filename.endsWith('.sc') ? (
					<Icon
						icon="play"
						className={classes.iconStyle}
						onClick={e =>
							handleSetState(
								discardDialogHandler(
									openFiles,
									openFilePath,
									() => {
										runScript(
											handleOpenScript(e, path, selected),
										);
									},
								),
							)
						}
					/>
				) : null}
			</div>
			<DiscardDialog
				handleSetState={handleSetState}
				openDiscardDialog={openDiscardDialog}
				callback={discardDialogCallback}
			/>
		</ContextMenu2>
	);
}

const mapStateToProps = state => ({
	openFiles: filesSelectors.selectOpenFiles(state),
	openFilePath: filesSelectors.selectOpenFilePath(state),
	prefersDarkMode: settingsSelectors.selectPrefersDarkMode(state),
});

export default connect(mapStateToProps, null)(CpgScript);
