import React from 'react';
import { connect } from 'react-redux';
import { toaster } from '../../assets/js/utils/toaster';

function Toaster(props) {
  const [state, _] = React.useState({
    timeout: 4000,
  });

  React.useEffect(() => {
    if (props.status?.toast) {
      toaster.show({ timeout: state.timeout, ...props.status.toast });
    }
  }, [props.status?.toast]);

  return null;
}

const mapStateToProps = state => {
  return {
    status: state.status,
  };
};

export default connect(mapStateToProps, null)(Toaster);
