import React from 'react';
import { Dialog } from '@blueprintjs/core';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import * as filesActions from '../../store/actions/filesActions';
import * as filesSelectors from '../../store/selectors/filesSelectors';
import * as settingsSelectors from '../../store/selectors/settingsSelectors';
import styles from '../../assets/js/styles/components/discard_dialog/discardDialogStyles';
import { getOpenFileName } from '../../assets/js/utils/scripts';
import {
	handleSave,
	handleDiscard,
	handleCancel,
} from './discardDialogScripts';

const useStyles = makeStyles(styles);

function DiscardDialog(props) {
	const classes = useStyles(props);

	const {
		openDiscardDialog,
		callback,
		handleSetState,
		openFiles,
		openFilePath,
	} = props;

	return (
		<Dialog
			portalClassName={classes.discardDialogStyle}
			autoFocus={true}
			canEscapeKeyClose={true}
			canOutsideClickClose={true}
			enforceFocus={true}
			isOpen={openDiscardDialog}
			onClose={() => handleSetState(handleCancel())}
			usePortal={true}
		>
			<div className={classes.discardDialogContentStyle}>
				<div>
					<h3>{`Do you want to save the changes made to ${getOpenFileName(
						openFilePath,
					)}`}</h3>
					<h4>
						{' '}
						Your changes will be lost if you don&apos;t save them
					</h4>
				</div>
			</div>
			<div className={classes.actionSectionStyle}>
				<h3
					className="save"
					onClick={async () =>
						handleSetState(await handleSave(openFilePath, callback))
					}
				>
					Save
				</h3>
				<h3
					onClick={() =>
						handleSetState(
							handleDiscard(
								openFilePath,
								openFiles,
								callback,
								props.setOpenFiles,
							),
						)
					}
				>
					Don&apos;t Save
				</h3>
				<h3 onClick={() => handleSetState(handleCancel())}>Cancel</h3>
			</div>
		</Dialog>
	);
}

const mapStateToProps = state => ({
	openFiles: filesSelectors.selectOpenFiles(state),
	openFilePath: filesSelectors.selectOpenFilePath(state),
	prefersDarkMode: settingsSelectors.selectPrefersDarkMode(state),
});

const mapDispatchToProps = dispatch => ({
	setOpenFiles: openFiles => dispatch(filesActions.setOpenFiles(openFiles)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DiscardDialog);
