import React from 'react';
import clsx from 'clsx';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import * as queryActions from '../../store/actions/queryActions';
import { MenuDivider, Menu, MenuItem } from '@blueprintjs/core';
import { ContextMenu2 } from '@blueprintjs/popover2';
import { Icon } from '@blueprintjs/core';
import Project from '../../components/project/Project';
import styles from '../../assets/js/styles/components/workspace/workspaceStyles';
import {
  latestIsManCommand,
  queueEmpty,
  addToQueue,
  addWorkSpaceQueryToQueue,
  handleSwitchWorkspace,
  contructQueryWithPath,
  handleScrollTop,
} from '../../assets/js/utils/scripts';
import { handleToggleProjectsVisible } from './workspaceScripts';

const useStyles = makeStyles(styles);

function Workspace(props) {
  const refs = {
    projectsContainerEl: React.useRef(null),
    workspaceRef: React.useRef(null),
    importCodeInputEl: React.useRef(null),
    importCpgInputEl: React.useRef(null),
  };
  const classes = useStyles(props);

  const [state, setState] = React.useState({
    projectsVisible: true,
    scrolled: false,
  });

  React.useEffect(() => {
    const callback = e => handleSetState(handleScrollTop(e));

    if (refs.projectsContainerEl.current) {
      refs.projectsContainerEl.current.addEventListener('scroll', callback);
      return () =>
        refs.projectsContainerEl.current &&
        refs.projectsContainerEl.current.removeEventListener(
          'scroll',
          callback,
        );
    }
  }, [refs.projectsContainerEl.current]);

  const handleSetState = obj => {
    if (obj) {
      Promise.resolve(obj).then(obj => {
        setState(state => ({ ...state, ...obj }));
      });
    }
  };

  const { projectsVisible, scrolled } = state;

  return (
    <>
      {Object.keys(props.workspace.projects).length > 0 ||
      !queueEmpty(props.query.queue) ? (
        <ContextMenu2
          content={
            <Menu className={classes.menuStyle}>
              <MenuItem
                className={classes.menuItemStyle}
                onClick={() => addToQueue(addWorkSpaceQueryToQueue(), props)}
                text="Refresh"
              ></MenuItem>

              <MenuItem
                className={classes.menuItemStyle}
                onClick={async () =>
                  addToQueue(await contructQueryWithPath('importCode'), props)
                }
                text="Import Code"
              ></MenuItem>
              <MenuItem
                className={classes.menuItemStyle}
                onClick={async () =>
                  addToQueue(await contructQueryWithPath('importCpg'), props)
                }
                text="Import Cpg"
              ></MenuItem>
              <MenuDivider className={classes.menuDividerStyle} />
              <MenuItem
                className={classes.menuItemStyle}
                onClick={async () =>
                  addToQueue(await handleSwitchWorkspace(), props)
                }
                text="Switch Workspace"
              ></MenuItem>
            </Menu>
          }
        >
          <div className={classes.rootStyle} tabIndex="0">
            <div
              className={classes.titleSectionStyle}
              onClick={() =>
                handleSetState(handleToggleProjectsVisible(projectsVisible))
              }
            >
              {projectsVisible ? (
                <Icon className={classes.iconStyle} icon="chevron-down" />
              ) : (
                <Icon className={classes.iconStyle} icon="chevron-right" />
              )}
              <h2 className={classes.titleStyle}>Workspace</h2>
              {!queueEmpty(props.query.queue) &&
              latestIsManCommand(props.query.results) ? (
                <Icon
                  icon="refresh"
                  className={clsx(
                    classes.iconStyle,
                    classes.refreshIconStyle,
                    'refresh-icon-animation',
                  )}
                />
              ) : null}
            </div>

            <div
              ref={refs.projectsContainerEl}
              className={clsx(
                classes.projectsSectionStyle,
                {
                  [classes.scrolledStyle]: scrolled,
                },
                {
                  [classes.projectsVisible]: projectsVisible,
                  [classes.projectsHidden]: !projectsVisible,
                },
              )}
            >
              {projectsVisible &&
                Object.keys(props.workspace.projects).map((name, index) => (
                  <Project
                    key={`${name}-${index}`}
                    name={name}
                    index={index}
                    {...props}
                  />
                ))}
            </div>
          </div>
        </ContextMenu2>
      ) : (
        <>
          <div
            className={classes.emptyWorkspaceElementStyle}
            onClick={async () =>
              addToQueue(await contructQueryWithPath('importCode'), props)
            }
          >
            Import Code
          </div>

          <div
            className={classes.emptyWorkspaceElementStyle}
            onClick={async () =>
              addToQueue(await contructQueryWithPath('importCpg'), props)
            }
          >
            Import Cpg
          </div>

          <div
            className={classes.emptyWorkspaceElementStyle}
            onClick={async () =>
              addToQueue(await handleSwitchWorkspace(), props)
            }
          >
            Switch Workspace
          </div>
        </>
      )}
    </>
  );
}

const mapStateToProps = state => {
  return {
    query: state.query,
    workspace: state.workspace,
    settings: state.settings,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    enQueueQuery: query => {
      return dispatch(queryActions.enQueueQuery(query));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Workspace);
