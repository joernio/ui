import React from 'react';
import clsx from 'clsx';
import { MenuDivider, Menu, MenuItem } from '@blueprintjs/core';
import { ContextMenu2 } from '@blueprintjs/popover2';
import { Icon } from '@blueprintjs/core';
import { makeStyles } from '@material-ui/core/styles';
import styles from '../../assets/js/styles/components/project/projectStyles';

import {
  addToQueue,
  handleOpenProject,
  handleCloseProject,
  handleDeleteProject,
} from './projectScripts';

const useStyles = makeStyles(styles);

function Project(props) {
  const classes = useStyles(props);

  const { name, index } = props;

  return (
    <ContextMenu2
      content={
        <Menu>
          <MenuItem
            className={classes.contextMenuItemStyle}
            onClick={() => addToQueue(handleOpenProject(name), props)}
            text="open"
          />
          <MenuItem
            className={classes.contextMenuItemStyle}
            onClick={() => addToQueue(handleCloseProject(name), props)}
            text="close"
          />
          <MenuDivider />
          <MenuItem
            className={clsx(classes.contextMenuItemStyle, classes.dangerStyle)}
            onClick={() => addToQueue(handleDeleteProject(name), props)}
            text="delete"
          />
        </Menu>
      }
    >
      <div key={index} className={classes.projectSectionStyle}>
        <h3 className={classes.projectNameStyle} key={`${name}-${index}`}>
          {name}
        </h3>
        {props.workspace.projects[name].open ? (
          <Icon icon="dot" className={classes.iconStyle} />
        ) : null}
      </div>
    </ContextMenu2>
  );
}

export default Project;
