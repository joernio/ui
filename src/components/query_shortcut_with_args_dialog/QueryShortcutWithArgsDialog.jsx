import React from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import * as queryActions from '../../store/actions/queryActions';
import { Dialog, Divider } from '@blueprintjs/core';
import styles from '../../assets/js/styles/components/cpg_scripts/cpgScriptsStyles';
import {
  closeDialog,
  runQueryWithArgs,
} from './queryShortcutWithArgsDialogScripts';

const useStyles = makeStyles(styles);

function QueryShortcutWithArgsDialog(props) {
  const queryShortcutArgsContainerEl = React.useRef(null);
  const classes = useStyles(props);
  const [state, setState] = React.useState({
    dialogOpen: false,
  });

  React.useEffect(() => {
    if (
      props.query.queryShortcut &&
      Object.keys(props.query.queryShortcut).length > 0
    ) {
      handleSetState({ dialogOpen: true });
    } else {
      handleSetState({ dialogOpen: false });
    }
  }, [props.query.queryShortcut]);

  const handleSetState = obj => {
    if (obj) {
      Promise.resolve(obj).then(obj => {
        setState(state => ({ ...state, ...obj }));
      });
    }
  };
  const { dialogOpen } = state;
  const { queryShortcut } = props.query;
  return Object.keys(queryShortcut).length > 0 ? (
    <Dialog
      portalClassName={classes.scriptsArgsDialogStyle}
      autoFocus={true}
      canEscapeKeyClose={true}
      canOutsideClickClose={true}
      enforceFocus={true}
      title="Add Query Shortcut Parameters"
      isCloseButtonShown={false}
      isOpen={dialogOpen}
      onClose={() => handleSetState(closeDialog())}
      usePortal={true}
    >
      <div
        className={classes.scriptsArgsDialogContentStyle}
        ref={queryShortcutArgsContainerEl}
      >
        {queryShortcut.query.split('\\0').map((str, index) =>
          index === 0 ? (
            <div key={`${str}-${index}`}>
              <h3>{str}</h3>
            </div>
          ) : (
            <>
              <div key={`${str}-${index}`}>
                <input type="text" id={`arg-${index}`} placeholder={`......`} />
              </div>
              <div>
                <h3>{str}</h3>
              </div>
            </>
          ),
        )}
      </div>
      <Divider className={classes.menuDividerStyle} />
      <div className={classes.runSectionStyle}>
        <h3 onClick={() => handleSetState(closeDialog())}>Cancel</h3>
        <h3
          className="run"
          onClick={() => {
            runQueryWithArgs(queryShortcutArgsContainerEl, props);
            handleSetState(closeDialog());
            props.setQueryShortcut({});
          }}
        >
          Run
        </h3>
      </div>
    </Dialog>
  ) : null;
}

const mapStateToProps = state => {
  return {
    settings: state.settings,
    query: state.query,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setQueryShortcut: queryShortcut => {
      return dispatch(queryActions.setQueryShortcut(queryShortcut));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(QueryShortcutWithArgsDialog);
