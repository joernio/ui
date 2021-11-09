import React from 'react';
import clsx from 'clsx';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import * as queryActions from '../../store/actions/queryActions';
import { Icon } from '@blueprintjs/core';
import { Dialog, Divider, MenuDivider } from '@blueprintjs/core';
import { Popover2 } from '@blueprintjs/popover2';
import styles from '../../assets/js/styles/components/cpg_scripts/cpgScriptsStyles';
import {
  handleScrollTop,
  watchFolderPath,
  openProjectExists,
  discardDialogHandler,
  openEmptyFile,
} from '../../assets/js/utils/scripts';
import {
  //   chokidarVars,
  //   getCpgScripts,
  //   switchDefaultScriptsFolder,
  //   handleToggleScriptsVisible,
  //   organisedScriptsToScripts,
  //   handleCPGScriptTagClick,
  //   handleRun,
  //   runSelected,
  //   collectArgsValues,
  toggleQueryShortcutDialog,
  runQueryWithArgs,
} from './queryShortcutDialogScripts';

const useStyles = makeStyles(styles);

function QueryShortcutDialog(props) {
  const queryShortcutArgsContainerEl = React.useRef(null);
  const classes = useStyles(props);
  const [state, setState] = React.useState({
    openDialog: false,
  });

  React.useEffect(() => {
    if (
      props.query.QueryShortcutDialog &&
      Object.keys(props.query.QueryShortcutDialog).length > 0
    ) {
      handleSetState({ openDialog: true });
    } else {
      handleSetState({ openDialog: false });
    }
  }, [props.query.QueryShortcutDialog]);

  const handleSetState = obj => {
    if (obj) {
      Promise.resolve(obj).then(obj => {
        setState(state => ({ ...state, ...obj }));
      });
    }
  };
  const { openDialog } = state;
  return (
    <Dialog
      portalClassName={classes.scriptsArgsDialogStyle}
      autoFocus={true}
      canEscapeKeyClose={true}
      canOutsideClickClose={true}
      enforceFocus={true}
      isOpen={openDialog}
      onClose={() => handleSetState(toggleQueryShortcutDialog(openDialog))}
      usePortal={true}
    >
      <div
        className={classes.scriptsArgsDialogContentStyle}
        ref={queryShortcutArgsContainerEl}
      >
        {dialogFields.map(script =>
          script.mainFunctionArgs.length > 0 ? (
            <>
              <div>
                <h3>{`${script.filename} > ${script.mainFunctionName} (`}</h3>
                {script.mainFunctionArgs.map(arg => (
                  <>
                    <h4>{arg}</h4>
                    <input
                      type="text"
                      id={`${script.filename.replaceAll('.', '-')}-${
                        script.mainFunctionName
                      }-${arg}`}
                      placeholder={`......`}
                    />
                  </>
                ))}
                <h3>{`)`}</h3>
              </div>
              <Divider className={classes.menuDividerStyle} />
            </>
          ) : null,
        )}
      </div>
      <div className={classes.runSectionStyle}>
        <h3
          onClick={() => handleSetState(toggleQueryShortcutDialog(openDialog))}
        >
          Cancel
        </h3>
        <h3
          className="run"
          onClick={() => {
            runQueryWithArgs(refs.queryShortcutArgsContainerEl, props);
            handleSetState(toggleQueryShortcutDialog(openDialog));
          }}
        >
          Run
        </h3>
      </div>
    </Dialog>
  );
}

const mapStateToProps = state => {
  return {
    settings: state.settings,
    query: state.query,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    //   setSettings: values => {
    //     return dispatch(settingsActions.setSettings(values));
    //   },
    //   enQueueScriptsQuery: query => {
    //     return dispatch(queryActions.enQueueScriptsQuery(query));
    //   },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(QueryShortcutDialog);
