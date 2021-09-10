import React from 'react';
import clsx from 'clsx';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Icon } from '@blueprintjs/core';
import { MenuDivider, Menu, MenuItem } from '@blueprintjs/core';
import { ContextMenu2 } from '@blueprintjs/popover2';
import styles from '../../assets/js/styles/components/joern_script/joernScriptStyles';
import { deleteFile } from '../../assets/js/utils/scripts';
import {
  handleOpenScript,
  shouldOpenScriptsContextMenu,
} from './joernScriptScripts';

const useStyles = makeStyles(styles);

function JoernScript(props) {
  const classes = useStyles(props);
  const { filename, path, selected, hasTag, handleSetState, runScript } = props;

  return (
    <ContextMenu2
      onContextMenu={() => {
        shouldOpenScriptsContextMenu(selected, handleSetState);
      }}
      content={
        Object.keys(selected).length > 1 ? null : (
          <Menu className={classes.menuStyle}>
            <MenuItem
              className={classes.menuItemStyle}
              onClick={e => {
                runScript(handleOpenScript(e, path, selected));
              }}
              text="Run"
            />
            <MenuDivider className={classes.menuDividerStyle} />
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
          onClick={e => handleSetState(handleOpenScript(e, path, selected))}
        >
          {filename}
        </h3>
        {filename.endsWith('.sc') ? (
          <Icon
            icon="play"
            className={classes.iconStyle}
            onClick={e => runScript(handleOpenScript(e, path, selected))}
          />
        ) : null}
      </div>
    </ContextMenu2>
  );
}

const mapStateToProps = state => {
  return {
    workspace: state.workspace,
    settings: state.settings,
  };
};

export default connect(mapStateToProps, null)(JoernScript);
