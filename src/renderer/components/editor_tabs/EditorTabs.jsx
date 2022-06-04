import React from 'react';
import clsx from 'clsx';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Icon } from '@blueprintjs/core';
import DiscardDialog from '../discard_dialog/DiscardDialog';
import * as filesSelectors from '../../store/selectors/filesSelectors';
import * as settingsSelectors from '../../store/selectors/settingsSelectors';
import {
	openFile,
	closeFile,
	discardDialogHandler,
	openSyntheticFile,
	getExtension,
} from '../../assets/js/utils/scripts';
import {
	syntheticFiles,
	imageFileExtensions,
} from '../../assets/js/utils/defaultVariables';
import styles from '../../assets/js/styles/components/editor_tabs/editorTabsStyles';
import commonStyles from '../../assets/js/styles';

const useCommonStyles = makeStyles(commonStyles);
const useStyles = makeStyles(styles);

function EditorTabs(props) {
	const classes = useStyles(props);
	const commonClasses = useCommonStyles(props);

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

	const { openFiles, openFilePath } = props;
	const { openDiscardDialog, discardDialogCallback } = state;

	return (
		<div
			className={clsx(
				classes.editorTabsContainerStyle,
				commonClasses.scrollBarStyle,
				commonClasses.scrollBarLightStyle,
				commonClasses.scrollBarHorizontalStyle,
			)}
			data-test="editor-tabs"
		>
			{Object.keys(openFiles || {}).map(path => {
				let filename = path.split('/');
				filename = filename[filename.length - 1];
				return (
					<div
						className={clsx(classes.editorTabStyle, {
							[classes.editorTabActiveStyle]:
								path === openFilePath,
						})}
						key={path}
					>
						<div
							className={classes.editorTabTitleStyle}
							onClick={() =>
								handleSetState(
									discardDialogHandler(
										openFiles,
										openFilePath,
										() => {
											syntheticFiles.filter(type =>
												path.endsWith(type),
											).length > 0
												? openSyntheticFile(
														path,
														openFiles[path],
												  )
												: openFile(path);
										},
									),
								)
							}
						>
							{imageFileExtensions.includes(getExtension(path)) ||
							syntheticFiles.filter(type => path.endsWith(type))
								.length > 0 ? (
								<Icon
									icon="align-left"
									className={classes.iconStyle}
								/>
							) : (
								<Icon
									icon="document"
									className={classes.iconStyle}
								/>
							)}

							{filename}
						</div>
						{openFiles[path] === false ? (
							<Icon
								icon="dot"
								className={clsx(
									'unsaved-icon',
									classes.iconStyle,
								)}
							/>
						) : null}
						<Icon
							icon="small-cross"
							className={clsx(
								classes.iconStyle,
								classes.closeIconStyle,
								{
									'unsaved-close-icon-style':
										openFiles[path] === false,
									'saved-close-icon-style':
										openFiles[path] !== false,
								},
							)}
							onClick={() =>
								handleSetState(
									discardDialogHandler(
										openFiles,
										openFilePath,
										() => {
											closeFile(path);
										},
									),
								)
							}
						/>
					</div>
				);
			})}
			<DiscardDialog
				handleSetState={handleSetState}
				openDiscardDialog={openDiscardDialog}
				callback={discardDialogCallback}
			/>
		</div>
	);
}

const mapStateToProps = state => ({
	openFiles: filesSelectors.selectOpenFiles(state),
	openFilePath: filesSelectors.selectOpenFilePath(state),
	prefersDarkMode: settingsSelectors.selectPrefersDarkMode(state),
});

export default connect(mapStateToProps, null)(EditorTabs);
