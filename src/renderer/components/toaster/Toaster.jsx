import React from 'react';
import { connect } from 'react-redux';
import { toaster } from '../../assets/js/utils/toaster';

/**
 * Show notification.
 * @param {Object} status The state for the notification
 * @param {null} status.connected The status of the app
 * @param {null} status.toast The content of the toast
 * @returns {null} null
 */

function Toaster(props) {
	const [state] = React.useState({
		timeout: 4000,
	});

	React.useEffect(() => {
		if (props.status?.toast) {
			toaster.show({ timeout: state.timeout, ...props.status.toast });
		}
	}, [props.status?.toast]);

	return null;
}

const mapStateToProps = state => ({
	status: state.status,
});

export default connect(mapStateToProps, null)(Toaster);
