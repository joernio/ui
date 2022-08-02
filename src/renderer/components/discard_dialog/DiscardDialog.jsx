import React from 'react';
import { Dialog } from '@blueprintjs/core';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import * as settingsSelectors from '../../store/selectors/settingsSelectors';
import * as statusSelectors from '../../store/selectors/statusSelectors';
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

	const { openDiscardDialog, callback } = props;

	return (
		<Dialog
			portalClassName={classes.discardDialogStyle}
			autoFocus={true}
			canEscapeKeyClose={true}
			canOutsideClickClose={true}
			enforceFocus={true}
			isOpen={openDiscardDialog}
			onClose={() => handleCancel()}
			usePortal={true}
		>
			<div className={classes.discardDialogContentStyle}>
				<div>
					<h3>{`Do you want to save the changes made to ${getOpenFileName()}`}</h3>
					<h4>
						{' '}
						Your changes will be lost if you don&apos;t save them
					</h4>
				</div>
			</div>
			<div className={classes.actionSectionStyle}>
				<h3 className="save" onClick={() => handleSave(callback)}>
					Save
				</h3>
				<h3 onClick={() => handleDiscard(callback)}>Don&apos;t Save</h3>
				<h3 onClick={() => handleCancel()}>Cancel</h3>
			</div>
		</Dialog>
	);
}

const mapStateToProps = state => ({
	prefersDarkMode: settingsSelectors.selectPrefersDarkMode(state),
	openDiscardDialog: statusSelectors.selectDiscardDialog(state).open,
	callback: statusSelectors.selectDiscardDialog(state).callback,
});

export default connect(mapStateToProps)(DiscardDialog);
