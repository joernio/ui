import React from 'react';
import { connect } from 'react-redux';
import * as statusSelectors from '../../store/selectors/statusSelectors';
import { toaster } from '../../assets/js/utils/toaster';

function Toaster(props) {
	const [state] = React.useState({
		timeout: 4000,
	});

	React.useEffect(() => {
		if (props.toast) {
			toaster.show({ timeout: state.timeout, ...props.toast });
		}
	}, [props.toast]);

	return null;
}

const mapStateToProps = state => ({
	toast: statusSelectors.selectToast(state),
});

export default connect(mapStateToProps, null)(Toaster);
