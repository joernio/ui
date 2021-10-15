import React from 'react';
import clsx from 'clsx';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Icon } from '@blueprintjs/core';
import { MenuDivider, Menu, MenuItem } from '@blueprintjs/core';
import { ContextMenu2 } from '@blueprintjs/popover2';
import DiscardDialog from '../discard_dialog/DiscardDialog';
import styles from '../../assets/js/styles/components/cpg_script/cpgScriptStyles';
import {
  deleteFile,
  discardDialogHandler,
} from '../../assets/js/utils/scripts';
import {
  handleOpenScript,
  shouldOpenScriptsContextMenu,
} from './cpgScriptScripts';

const useStyles = makeStyles(styles);

function CpgScript(props) {
  const classes = useStyles(props);
  const [state, setState] = React.useState({
    openDiscardDialog: false,
    discardDialogCallback: () => {},
  });

  const handleSetState = obj => {
    if (obj) {
      Promise.resolve(obj).then(obj => {
        setState(state => ({ ...state, ...obj }));
      });
    }
  };

  const { openDiscardDialog, discardDialogCallback } = state;
  const {
    filename,
    path,
    selected,
    hasTag,
    handleSetState: parentHandleSetState,
    runScript,
    files,
  } = props;

  const { openFiles, openFilePath } = files;

  return (
    <ContextMenu2
      onContextMenu={() => {
        shouldOpenScriptsContextMenu(selected, parentHandleSetState);
      }}
      autoFocus={false}
      content={
        Object.keys(selected).length > 1 ? null : (
          <Menu className={classes.menuStyle}>
            {/* <MenuItem
              className={classes.menuItemStyle}
              onClick={e => {
                handleSetState(
                  discardDialogHandler(openFiles, openFilePath, () => {
                    runScript(handleOpenScript(e, path, selected));
                  }),
                );
              }}
              text="Run"
            />
            <MenuDivider className={classes.menuDividerStyle} /> */}
            <MenuItem
              className={classes.menuItemStyle}
              onClick={() => {
                deleteFile(path);
              }}
              text="Delete"
            />
          </Menu>
        )
      }
    >
      <div
        className={clsx(classes.scriptSectionStyle, {
          [classes.selectedStyle]: selected[path],
          [classes.taggedScriptSectionStyle]: hasTag,
        })}
        tabindex="0"
      >
        <h3
          className={classes.scriptNameStyle}
          key={path}
          onClick={e =>
            handleSetState(
              discardDialogHandler(openFiles, openFilePath, () => {
                parentHandleSetState(handleOpenScript(e, path, selected));
              }),
            )
          }
        >
          {filename}
        </h3>
        {/* {filename.endsWith('.sc') ? (
          <Icon
            icon="play"
            className={classes.iconStyle}
            onClick={e =>
              handleSetState(
                discardDialogHandler(openFiles, openFilePath, () => {
                  runScript(handleOpenScript(e, path, selected));
                }),
              )
            }
          />
        ) : null} */}
      </div>
      <DiscardDialog
        handleSetState={handleSetState}
        openDiscardDialog={openDiscardDialog}
        callback={discardDialogCallback}
      />
    </ContextMenu2>
  );
}

const mapStateToProps = state => {
  return {
    files: state.files,
    workspace: state.workspace,
    settings: state.settings,
  };
};

export default connect(mapStateToProps, null)(CpgScript);
