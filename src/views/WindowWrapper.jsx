import React from 'react';
import clsx from 'clsx';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import MinimizeIcon from '@material-ui/icons/Remove';
import CloseIcon from '@material-ui/icons/Close';
import MaximizeIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import RestoreIcon from '@material-ui/icons/AspectRatio';
import * as filesActions from '../store/actions/filesActions';
import { windowInfoApi } from '../assets/js/utils/ipcRenderer';
import { openFile } from '../assets/js/utils/scripts';
import {
  sendWindowsMessage,
  handleOpenFile,
  handleOpenFileContextMenu,
  handleCloseFileContextMenu,
  getOpenFileName,
} from './windowWrapperScripts';

const useStyles = makeStyles(theme => ({
  titleBarStyle: {
    position: 'fixed',
    top: 0,
    width: '100vw',
    height: '2.5em',
    backgroundColor: theme.palette.titlebar.main,
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
  },
  controlButtonStyle: {
    display: 'flex',
    width: '3em',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0)',
    border: 'none',
    cursor: 'pointer',
    // fill: "gray",
    '&:focus': {
      outline: 'none',
    },
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
    '&.close:hover': {
      backgroundColor: theme.palette.secondary.light,
    },
  },
  navItemStyle: {
    marginLeft: '0.5em',
    color: theme.palette.text.primary,
  },
  toolNameContainerStyle: {
    display: 'flex',
    flexGrow: 1,
    justifyContent: 'center',
  },
  windowActionIconStyle: {
    fill: theme.palette.text.primary,
    width: '0.6em',
    height: '0.6em',
  },
  connectionStatusStyle: {
    height: '2.5em',
    width: '13em',
    position: 'fixed',
    right: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    border: '1px solid gray',
    color: 'gray',
  },
}));

function WindowWrapper(props) {
  const classes = useStyles();

  const [state, setState] = React.useState({
    isMaximized: windowInfoApi.getWindowInfo(),
    filename: '',
    file_context_anchor_el: null,
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

  const { isMaximized, filename, file_context_anchor_el } = state;
  const file_context_menu_open = Boolean(file_context_anchor_el);
  const file_popover_id = file_context_menu_open
    ? 'file-context-popover'
    : undefined;

  return (
    <>
      <div className={classes.titleBarStyle}>
        <Popover
          id={file_popover_id}
          open={file_context_menu_open}
          anchorEl={file_context_anchor_el}
          onClose={() => handleSetState(handleCloseFileContextMenu())}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          <label>
            <input
              type="file"
              onChange={e => openFile(handleOpenFile(e), props)}
            />
            Open File
          </label>
        </Popover>
        <div style={{ flexGrow: 1, display: 'flex' }}>
          <button
            className={clsx(classes.navItemStyle, classes.controlButtonStyle)}
            aria-describedby={file_popover_id}
            onClick={e => handleSetState(handleOpenFileContextMenu(e))}
          >
            File
          </button>
          <button
            className={clsx(classes.navItemStyle, classes.controlButtonStyle)}
          >
            Edit
          </button>
          <button
            className={clsx(classes.navItemStyle, classes.controlButtonStyle)}
          >
            Selection
          </button>
          <button
            className={clsx(classes.navItemStyle, classes.controlButtonStyle)}
          >
            View
          </button>
          <button
            className={clsx(classes.navItemStyle, classes.controlButtonStyle)}
          >
            Go
          </button>
          <button
            className={clsx(classes.navItemStyle, classes.controlButtonStyle)}
          >
            Run
          </button>
          <button
            className={clsx(classes.navItemStyle, classes.controlButtonStyle)}
          >
            Terminal
          </button>
          <button
            className={clsx(classes.navItemStyle, classes.controlButtonStyle)}
          >
            Help
          </button>

          <div className={classes.toolNameContainerStyle}>
            <div>{filename ? `${filename} - ` : null}Joern Client</div>
          </div>
        </div>

        <button
          className={classes.controlButtonStyle}
          onClick={() => sendWindowsMessage('minimize')}
        >
          <MinimizeIcon className={classes.windowActionIconStyle} />
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
            <MaximizeIcon className={classes.windowActionIconStyle} />
          ) : (
            <RestoreIcon className={classes.windowActionIconStyle} />
          )}
        </button>

        <button
          className={clsx('close', classes.controlButtonStyle)}
          onClick={() => sendWindowsMessage('close')}
        >
          <CloseIcon className={classes.windowActionIconStyle} />
        </button>
      </div>
      {props.children}
      <div className={classes.connectionStatusStyle}>
        <h3>Connected</h3>
        <div className="ring-container">
          <div className="ringring"></div>
          <div className="circle"></div>
        </div>
      </div>
    </>
  );
}

const mapStateToProps = state => {
  return {
    files: state.files,
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
