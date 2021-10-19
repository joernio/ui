import React from 'react';
import clsx from 'clsx';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import * as settingsActions from '../../store/actions/settingsActions';
import * as queryActions from '../../store/actions/queryActions';
import { Icon } from '@blueprintjs/core';
import {
  Menu,
  MenuItem,
  Dialog,
  Divider,
  MenuDivider,
} from '@blueprintjs/core';
import { Popover2 } from '@blueprintjs/popover2';
import CpgScript from '../cpg_script/CpgScript';
import DiscardDialog from '../discard_dialog/DiscardDialog';
import styles from '../../assets/js/styles/components/cpg_scripts/cpgScriptsStyles';
import {
  handleScrollTop,
  watchFolderPath,
  openProjectExists,
  discardDialogHandler,
  openEmptyFile,
} from '../../assets/js/utils/scripts';
import {
  chokidarVars,
  getCpgScripts,
  switchDefaultScriptsFolder,
  handleToggleScriptsVisible,
  organisedScriptsToScripts,
  handleRun,
  runSelected,
  deleteAll,
  deleteSelected,
  collectArgsValues,
  toggleScriptsArgsDialog,
} from './cpgScriptsScripts';
import { shouldGoToLine } from '../../views/editor_window/editorScripts';

const useStyles = makeStyles(styles);

function CpgScripts(props) {
  const scriptsContainerEl = React.useRef(null);
  const classes = useStyles(props);
  const [state, setState] = React.useState({
    scripts: {},
    scriptsVisible: true,
    scrolled: false,
    selected: {},
    dialogFields: [],
    openDialog: false,
    scriptsMenuIsOpen: false,
    openDiscardDialog: false,
    discardDialogCallback: () => {},
  });

  const refs = {
    dialogEl: React.useRef(null),
  };

  React.useEffect(() => {
    const handleGetCpgScripts = async () => {
      const scripts = await getCpgScripts(props);
      handleSetState({ scripts: scripts ? scripts : {} });
    };
    handleGetCpgScripts();
    watchFolderPath(
      props.settings.scriptsDir,
      chokidarVars,
      handleGetCpgScripts,
    );
  }, [props.settings.scriptsDir]);

  React.useEffect(() => {
    const callback = e => handleSetState(handleScrollTop(e));

    if (scriptsContainerEl.current) {
      scriptsContainerEl.current.addEventListener('scroll', callback);

      return () =>
        scriptsContainerEl.current &&
        scriptsContainerEl.current.removeEventListener('scroll', callback);
    }
  }, [scriptsContainerEl.current]);

  const handleSetState = obj => {
    if (obj) {
      Promise.resolve(obj).then(obj => {
        setState(state => ({ ...state, ...obj }));
      });
    }
  };

  let {
    scripts,
    selected,
    scriptsVisible,
    scrolled,
    openDialog,
    dialogFields,
    scriptsMenuIsOpen,
    openDiscardDialog,
    discardDialogCallback,
  } = state;

  const { openFiles, openFilePath } = props.files;

  return Object.keys(props.workspace.projects).length > 0 ? (
    <ClickAwayListener
      onClickAway={() => {
        handleSetState({ selected: {} });
      }}
    >
      <div className={classes.rootStyle} tabIndex="0" data-test="cpg-scripts">
        <div className={classes.titleSectionStyle}>
          {scriptsVisible ? (
            <Icon
              className={classes.iconStyle}
              icon="chevron-down"
              onClick={() =>
                handleSetState(handleToggleScriptsVisible(scriptsVisible))
              }
            />
          ) : (
            <Icon
              className={classes.iconStyle}
              icon="chevron-right"
              onClick={() =>
                handleSetState(handleToggleScriptsVisible(scriptsVisible))
              }
            />
          )}
          <h2
            className={classes.titleStyle}
            onClick={() =>
              handleSetState(handleToggleScriptsVisible(scriptsVisible))
            }
          >
            scripts
          </h2>

          <Popover2
            content={
              <Menu className={classes.menuStyle}>
                {/* <MenuItem
                  className={classes.menuItemStyle}
                  onClick={() =>
                    handleSetState(
                      handleRun(
                        organisedScriptsToScripts(scripts),
                        scripts,
                        props,
                      ),
                    )
                  }
                  text="Run All"
                />
                <MenuItem
                  className={classes.menuItemStyle}
                  onClick={() =>
                    handleSetState(handleRun(selected, scripts, props))
                  }
                  text="Run Selected"
                />
                <MenuDivider className={classes.menuDividerStyle} /> */}
                <MenuItem
                  className={classes.menuItemStyle}
                  onClick={() =>
                    handleSetState(
                      discardDialogHandler(openFiles, openFilePath, () => {
                        openEmptyFile();
                      }),
                    )
                  }
                  text="New Script"
                />
                <MenuItem
                  className={classes.menuItemStyle}
                  onClick={() => deleteAll(scripts)}
                  text="Delete All"
                />
                <MenuItem
                  className={classes.menuItemStyle}
                  onClick={() => deleteSelected(selected)}
                  text="Delete Selected"
                />
                <MenuDivider className={classes.menuDividerStyle} />
                <MenuItem
                  className={classes.menuItemStyle}
                  onClick={() => switchDefaultScriptsFolder(props)}
                  text="Switch Default Scripts Folder"
                />
              </Menu>
            }
            placement="top-start"
            interactionKind="click"
            minimal={true}
            openOnTargetFocus={false}
            isOpen={scriptsMenuIsOpen}
            onInteraction={bool => handleSetState({ scriptsMenuIsOpen: bool })}
          >
            <Icon
              icon="more"
              className={clsx(classes.iconStyle, classes.verticalMoreStyle)}
            />
          </Popover2>
        </div>
        <div
          ref={scriptsContainerEl}
          className={clsx(
            classes.scriptsSectionStyle,
            {
              [classes.scrolledStyle]: scrolled,
            },
            {
              [classes.scriptsVisible]: scriptsVisible,
              [classes.scriptsHidden]: !scriptsVisible,
            },
          )}
        >
          {openProjectExists(props.workspace) && scriptsVisible && scripts
            ? Object.keys(scripts).map(value => {
                if (!scripts[value].tag) {
                  let filename = value.split('/');
                  filename = filename[filename.length - 1];
                  return (
                    <CpgScript
                      filename={filename}
                      path={value}
                      mainFunctionName={scripts[value].mainFunctionName}
                      mainFunctionArgs={scripts[value].mainFunctionArgs}
                      selected={selected}
                      hasTag={false}
                      handleSetState={handleSetState}
                      runScript={({ selected }) =>
                        handleSetState(handleRun(selected, scripts, props))
                      }
                    />
                  );
                } else if (scripts[value].tag) {
                  return (
                    <>
                      <h3 className={classes.tagNameStyle}>{value}</h3>
                      {Object.keys(scripts[value]).map(path => {
                        if (scripts[value][path] !== true) {
                          let filename = path.split('/');
                          filename = filename[filename.length - 1];
                          return (
                            <CpgScript
                              filename={filename}
                              path={path}
                              mainFunctionName={
                                scripts[value][path].mainFunctionName
                              }
                              mainFunctionArgs={
                                scripts[value][path].mainFunctionArgs
                              }
                              selected={selected}
                              hasTag={true}
                              handleSetState={handleSetState}
                              runScript={({ selected }) =>
                                handleSetState(
                                  handleRun(selected, scripts, props),
                                )
                              }
                            />
                          );
                        }
                      })}
                    </>
                  );
                } else {
                  return null;
                }
              })
            : null}

          <Dialog
            portalClassName={classes.scriptsArgsDialogStyle}
            autoFocus={true}
            canEscapeKeyClose={true}
            canOutsideClickClose={true}
            enforceFocus={true}
            isOpen={openDialog}
            onClose={() => handleSetState(toggleScriptsArgsDialog(openDialog))}
            usePortal={true}
          >
            <div
              className={classes.scriptsArgsDialogContentStyle}
              ref={refs.dialogEl}
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
                onClick={() =>
                  handleSetState(toggleScriptsArgsDialog(openDialog))
                }
              >
                Cancel
              </h3>
              <h3
                className="run"
                onClick={() => {
                  runSelected(
                    collectArgsValues(refs.dialogEl, dialogFields),
                    selected,
                    scripts,
                    props,
                  );
                  handleSetState(toggleScriptsArgsDialog(openDialog));
                }}
              >
                Run
              </h3>
            </div>
          </Dialog>
          <DiscardDialog
            handleSetState={handleSetState}
            openDiscardDialog={openDiscardDialog}
            callback={discardDialogCallback}
          />
        </div>
      </div>
    </ClickAwayListener>
  ) : null;
}

const mapStateToProps = state => {
  return {
    workspace: state.workspace,
    settings: state.settings,
    files: state.files,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setSettings: values => {
      return dispatch(settingsActions.setSettings(values));
    },
    enQueueScriptsQuery: query => {
      return dispatch(queryActions.enQueueScriptsQuery(query));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CpgScripts);
