import React from 'react';
import clsx from 'clsx';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Icon } from '@blueprintjs/core';
import * as filesActions from '../store/actions/filesActions';
import { ContextMenu2, Popover2 } from '@blueprintjs/popover2';
import { Menu, MenuDivider, MenuItem } from '@blueprintjs/core';
import { windowInfoApi } from '../assets/js/utils/ipcRenderer';
import styles from '../assets/js/styles/views/windowWrapperStyles';
import { usePrevious } from '../assets/js/utils/hooks';
import {
  openEmptyFile,
  sendWindowsMessage,
  wsReconnectToServer,
  wsDisconnectFromServer,
  openFile,
  queueEmpty,
  saveFile,
  nFormatter,
} from '../assets/js/utils/scripts';
import {
  handleOpenFile,
  getOpenFileName,
  getQueriesStats,
} from './windowWrapperScripts';

const useStyles = makeStyles(styles);

function WindowWrapper(props) {
  const hiddenInputEl = React.useRef(null);
  const classes = useStyles(props);

  const [state, setState] = React.useState({
    isMaximized: windowInfoApi.getWindowInfo(),
    filename: '',
    fileContextIsOpen: false,
    connectionStatusPopoverOpen: false,
    queriesStats: [],
    prev_queue: {},
  });

  const handleSetState = obj => {
    if (obj) {
      Promise.resolve(obj).then(obj => {
        setState(state => ({ ...state, ...obj }));
      });
    }
  };

  React.useEffect(() => {
    const filename = getOpenFileName(props);
    handleSetState({ filename });
  }, [props.files]);

  const prev_queue = usePrevious(
    props.query.queue ? { ...props.query.queue } : {},
  );

  React.useEffect(() => {
    if (props.query.queue) {
      handleSetState({
        ...getQueriesStats(props.query.queue, prev_queue, state.queriesStats),
      });
      //should only be concerned with the first item in the queue
      //when queue changes, if the first item in the queue is not in queryStats, add it and start the timer
      //then (track previous queue and current queue to keep track the item that was removed from the queue) if an item was removed from the queue, find the item that was removed and stop the timer
    }
  }, [props.query.queue]);

  const { isMaximized, filename, fileContextIsOpen, queriesStats } = state;

  return (
    <>
      <div className={classes.titleBarStyle}>
        <div className={classes.titleBarRightStyle}>
          <input
            ref={hiddenInputEl}
            className={classes.hiddenStyle}
            type="file"
            onChange={e => openFile(handleOpenFile(e), props)}
          />

          <Popover2
            content={
              <Menu>
                <MenuItem
                  text="New"
                  icon="document"
                  onClick={() => openEmptyFile()}
                />
                <MenuItem
                  text="Open"
                  onClick={() => hiddenInputEl.current.click()}
                  icon="folder-shared"
                />
                <MenuDivider />
                <MenuItem
                  text="Save"
                  icon="floppy-disk"
                  onClick={() => saveFile()}
                />
                <MenuDivider />
                <MenuItem
                  text="Reload"
                  icon="refresh"
                  onClick={() => sendWindowsMessage('reload')}
                />
                <MenuItem
                  text="Exit"
                  icon="cross"
                  onClick={() => sendWindowsMessage('close')}
                />
              </Menu>
            }
            placement="bottom-end"
            minimal={true}
            interactionKind="click"
            isOpen={fileContextIsOpen}
            onInteraction={isOpen =>
              handleSetState({ fileContextIsOpen: isOpen })
            }
          >
            <button
              className={clsx(classes.navItemStyle, classes.controlButtonStyle)}
            >
              File
            </button>
          </Popover2>

          <div className={classes.toolNameContainerStyle}>
            <h1>{filename ? `${filename} - ` : null}Joern Client</h1>
          </div>
        </div>

        <button
          className={classes.controlButtonStyle}
          onClick={() => sendWindowsMessage('minimize')}
        >
          <Icon icon="minus" className={classes.windowActionIconStyle} />
        </button>

        <button
          className={classes.controlButtonStyle}
          onClick={() => {
            sendWindowsMessage(
              windowInfoApi.getWindowInfo() ? 'unmaximize' : 'maximize',
            );
            handleSetState({ isMaximized: !isMaximized });
          }}
        >
          {isMaximized ? (
            <Icon icon="minimize" className={classes.windowActionIconStyle} />
          ) : (
            <Icon icon="maximize" className={classes.windowActionIconStyle} />
          )}
        </button>

        <button
          className={clsx('close', classes.controlButtonStyle)}
          onClick={() => sendWindowsMessage('close')}
        >
          <Icon icon="cross" className={classes.windowActionIconStyle} />
        </button>
      </div>
      {props.children}
      <div className={classes.statusBarStyle}>
        <div className={classes.statusBarRightStyle}>
          <div className={classes.queriesStatsSectionStyle}>
            <div className={classes.refreshIconContainerStyle}>
              {!queueEmpty(props.query.queue) ? (
                <Icon
                  icon="refresh"
                  className={clsx(
                    classes.refreshIconStyle,
                    'refresh-icon-animation',
                  )}
                />
              ) : (
                <Icon
                  icon="refresh"
                  className={clsx(classes.refreshIconStyle)}
                />
              )}
            </div>
            <p className={classes.queriesStatsStyle}>
              {nFormatter(queriesStats.length)}
            </p>
            {!queueEmpty(props.query.queue) ? <div>running...</div> : null}
          </div>
        </div>

        <ContextMenu2
          content={
            <div>
              <div
                className={classes.conStatContextContentStyle}
                onClick={() =>
                  wsReconnectToServer(props.settings.websocket.url)
                }
              >
                Reconnect
              </div>
              <div
                className={classes.conStatContextContentStyle}
                onClick={wsDisconnectFromServer}
              >
                Disconnect
              </div>
            </div>
          }
        >
          <div className={classes.connectionStatusStyle}>
            {props.status.connected ? (
              <>
                <h3>Connected</h3>
                <div className="ring-container">
                  <div className="ringring"></div>
                  <div className="circle"></div>
                </div>
              </>
            ) : props.status.connected === false ? (
              <>
                <h3>Failed</h3>
                <Icon icon="delete" intent="danger" />
              </>
            ) : (
              <>
                <h3>Connecting ...</h3>
                <div className={classes.refreshIconContainerStyle}>
                  <Icon
                    icon="refresh"
                    className={clsx(
                      classes.refreshIconStyle,
                      'refresh-icon-animation',
                    )}
                  />
                </div>
              </>
            )}
          </div>
        </ContextMenu2>
      </div>
    </>
  );
}

const mapStateToProps = state => {
  return {
    query: state.query,
    files: state.files,
    status: state.status,
    workspace: state.workspace,
    settings: state.settings,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setRecent: files => {
      return dispatch(filesActions.setRecent(files));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(WindowWrapper);
