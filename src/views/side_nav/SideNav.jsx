import React from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import SearchIcon from '@material-ui/icons/Search';
import SettingsIcon from '@material-ui/icons/Settings';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import TerminalIcon from '../../assets/image/js/TerminalIcon';
import Popper from '@material-ui/core/Popper';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Paper from '@material-ui/core/Paper';

import {
  handleSettingsClick,
  handleDrawerToggle,
  handleTerminalToggle,
} from './sideNavScripts';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: 'none',
  },

  drawerDefault: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '2.5em',
    paddingBottom: '2.5em',
    backgroundColor: '#303030',
    width: props => props.SideNavWidth,
    '& ul': {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      '& .navTopSection': {
        flexGrow: 1,
      },
    },
  },
  drawerDefaultListItemStyle: {
    justifyContent: 'center',
    paddingLeft: 0,
    paddingRight: 0,
    '& .MuiListItemIcon-root': {
      minWidth: 0,
    },
  },
  IconStyle: {
    fill: '#C6C6C6',
    '&:hover': {
      fill: '#FFFFFF',
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
}));

function SideNav(props) {
  const classes = useStyles(props);
  const theme = useTheme();

  const [state, setState] = React.useState({
    anchorEl: null,
    popperOpen: false,
  });

  const handleSetState = obj => {
    if (obj) {
      Promise.resolve(obj).then(obj => {
        setState(state => ({ ...state, ...obj }));
      });
    }
  };

  const { prefersDarkMode, handleSetThemePreference } = props;
  return (
    <div className={classes.root}>
      <CssBaseline />

      <Popper
        open={state.popperOpen}
        anchorEl={state.anchorEl}
        placement="right"
        style={{
          zIndex: '10000',
          height: '10em',
          width: '13em',
        }}
      >
        <Paper>
          <FormControlLabel
            control={
              <Switch
                checked={prefersDarkMode}
                onChange={() => handleSetThemePreference(!prefersDarkMode)}
                color="primary"
              />
            }
            label="Dark Theme"
            labelPlacement="start"
          />
        </Paper>
      </Popper>

      <Drawer
        variant="permanent"
        classes={{
          paper: clsx({
            [classes.drawerDefault]: true,
          }),
        }}
      >
        <div className={classes.toolbar}>
          <IconButton
            onClick={() => props.handleSetState(handleDrawerToggle(props))}
          >
            {theme.direction === 'rtl' ? (
              <ChevronRightIcon className={classes.IconStyle} />
            ) : (
              <ChevronLeftIcon className={classes.IconStyle} />
            )}
          </IconButton>
        </div>
        <Divider />
        <List>
          <div className="navTopSection">
            <ListItem button className={classes.drawerDefaultListItemStyle}>
              <ListItemIcon>
                <FileCopyIcon className={classes.IconStyle} />
              </ListItemIcon>
            </ListItem>

            <ListItem button className={classes.drawerDefaultListItemStyle}>
              <ListItemIcon>
                <SearchIcon className={classes.IconStyle} />
              </ListItemIcon>
            </ListItem>
          </div>

          <ListItem
            button
            className={clsx(
              classes.drawerDefaultListItemStyle,
              classes.IconStyle,
            )}
            onClick={() => props.handleSetState(handleTerminalToggle(props))}
          >
            <ListItemIcon>
              <TerminalIcon />
            </ListItemIcon>
          </ListItem>

          <ListItem
            button
            className={classes.drawerDefaultListItemStyle}
            onClick={e => handleSetState(handleSettingsClick(e, state))}
          >
            <ListItemIcon>
              <SettingsIcon className={classes.IconStyle} />
            </ListItemIcon>
          </ListItem>
        </List>
      </Drawer>
    </div>
  );
}

export default SideNav;
