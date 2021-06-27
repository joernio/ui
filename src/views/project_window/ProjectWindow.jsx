import React from 'react';
import clsx from 'clsx';
import { connect } from 'react-redux';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import * as queryActions from '../../store/actions/queryActions';
import RefreshIcon from '@material-ui/icons/Refresh';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Popover from '@material-ui/core/Popover';
import FolderWindow from '../folder_window/FolderWindow';
import ScriptWindow from '../script_window/ScriptWindow';
import ProjectContextMenu from '../../components/project_context_menu/ProjectContextMenu';
import {
  addToQueue,
  addWorkSpaceQueryToQueue,
  handleOpenProject,
  handleDeleteProject,
  handleCloseProject,
  handleOpenWorkSpaceContextMenu,
  handleCloseWorkSpaceContextMenu,
  handleSwitchWorkspace,
  contructQueryWithFilePath,
} from './projectWindowScripts';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    zIndex: 1000,
  },
  drawer: {
    width: props => props.drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    marginTop: '2.5em',
    backgroundColor: theme.palette.drawer.main,
    width: props => props.drawerWidth,
  },
  drawerClose: {
    marginTop: '2.5em',
    backgroundColor: theme.palette.drawer.main,
    overflowX: 'hidden',
    width: 0,
  },
  drawerPaddingLeft: {
    paddingLeft: '4em',
  },
}));

function ProjectWindow(props) {
  const classes = useStyles(props);

  const [state, setState] = React.useState({
    workspace_context_anchor_el: null,
  });

  React.useEffect(() => {
    addToQueue(addWorkSpaceQueryToQueue(), props);
  }, []);

  const handleSetState = obj => {
    if (obj) {
      Promise.resolve(obj).then(obj => {
        setState(state => ({ ...state, ...obj }));
      });
    }
  };

  const { drawerOpen } = props;
  const { workspace_context_anchor_el } = state;
  const workspace_context_menu_open = Boolean(workspace_context_anchor_el);
  const workspace_popover_id = workspace_context_menu_open
    ? 'workspace-context-popover'
    : undefined;

  return (
    <div className={classes.root}>
      <CssBaseline />

      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: drawerOpen,
          [classes.drawerClose]: !drawerOpen,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: drawerOpen,
            [classes.drawerClose]: !drawerOpen,
          }),
        }}
      >
        {Object.keys(props.query.results).length < 1 ? (
          <Box className={classes.drawerPaddingLeft}>Loading ...</Box>
        ) : Object.keys(props.workspace.projects).length > 0 ? (
          <Box className={classes.drawerPaddingLeft}>
            <Box>
              <ScriptWindow />
              <Typography style={{ marginTop: '3em' }}>Workspace</Typography>
              <RefreshIcon onClick={() => addWorkSpaceQueryToQueue(props)} />
              <MoreVertIcon
                aria-describedby={workspace_popover_id}
                onClick={e => {
                  handleSetState(handleOpenWorkSpaceContextMenu(e));
                }}
              />

              <Popover
                id={workspace_popover_id}
                open={workspace_context_menu_open}
                anchorEl={workspace_context_anchor_el}
                onClose={() => {
                  handleSetState(handleCloseWorkSpaceContextMenu());
                }}
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
                    onChange={e =>
                      addToQueue(
                        contructQueryWithFilePath(e, 'importCode'),
                        props,
                      )
                    }
                  />
                  import code
                </label>
                <label>
                  <input
                    type="file"
                    onChange={e =>
                      addToQueue(
                        contructQueryWithFilePath(e, 'importCpg'),
                        props,
                      )
                    }
                  />
                  import cpg
                </label>
                <button
                  onClick={async e =>
                    addToQueue(await handleSwitchWorkspace(e), props)
                  }
                >
                  switch workspace
                </button>
              </Popover>
            </Box>
            {Object.keys(props.workspace.projects).map((name, index) => (
              <ListItem
                button
                key={index}
                style={{ paddingTop: 0, paddingBottom: 0 }}
              >
                <ListItemText
                  primary={`${name} ${
                    props.workspace.projects[name].open ? ' OPEN' : ' CLOSED'
                  }`}
                />
                <ProjectContextMenu
                  name={name}
                  index={index}
                  handleOpenProject={() =>
                    addToQueue(handleOpenProject(name), props)
                  }
                  handleCloseProject={() =>
                    addToQueue(handleCloseProject(name), props)
                  }
                  handleDeleteProject={() =>
                    addToQueue(handleDeleteProject(name), props)
                  }
                />
              </ListItem>
            ))}
          </Box>
        ) : (
          <>
            <label>
              <input
                type="file"
                onChange={e =>
                  addToQueue(contructQueryWithFilePath(e, 'importCpg'), props)
                }
              />
              import code
            </label>
            <button
              onClick={async e =>
                addToQueue(await handleSwitchWorkspace(e), props)
              }
            >
              switch workspace
            </button>
          </>
        )}
        <FolderWindow />
      </Drawer>
    </div>
  );
}

const mapStateToProps = state => {
  return {
    query: state.query,
    workspace: state.workspace,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    enQueueQuery: query => {
      return dispatch(queryActions.enQueueQuery(query));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProjectWindow);
