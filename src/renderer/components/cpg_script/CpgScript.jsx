import React from 'react';
import clsx from 'clsx';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Icon, MenuDivider, Menu, MenuItem } from '@blueprintjs/core';
import { ContextMenu2 } from '@blueprintjs/popover2';
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
import commonStyles from '../../assets/js/styles';

const useStyles = makeStyles(styles);
const useCommonStyles = makeStyles(commonStyles);

function CpgScript(props) {
	const classes = useStyles(props);
	const commonClasses = useCommonStyles(props);

	const {
		filename,
		path,
		selected,
		hasTag,
		handleSetState: parentHandleSetState,
		runScript,
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
							onClick={e =>
								discardDialogHandler(() => {
									runScript(
										handleOpenScript(e, path, selected),
									);
								})
							}
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
					[classes.selectedConfigStyle]: selected[path],
					[classes.taggedScriptSectionStyle]: hasTag,
				})}
				tabIndex="0"
			>
				<h3
					className={classes.scriptNameStyle}
					key={path}
					onClick={e =>
						discardDialogHandler(() => {
							parentHandleSetState(
								handleOpenScript(e, path, selected),
							);
						})
					}
				>
					{filename}
				</h3>
				{filename.endsWith('.sc') ? (
					<Icon
						icon="play"
						className={commonClasses.iconStyle}
						onClick={e =>
							discardDialogHandler(() => {
								runScript(handleOpenScript(e, path, selected));
							})
						}
					/>
				) : null}
			</div>
		</ContextMenu2>
	);
}

const mapStateToProps = state => ({
	prefersDarkMode: settingsSelectors.selectPrefersDarkMode(state),
});

export default connect(mapStateToProps, null)(CpgScript);
