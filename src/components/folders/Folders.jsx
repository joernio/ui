import React from 'react';
import { connect } from 'react-redux';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import * as queryActions from '../../store/actions/queryActions';
import * as filesActions from '../../store/actions/filesActions';
import { Menu, MenuItem } from '@blueprintjs/core';
import { ContextMenu2 } from '@blueprintjs/popover2';
import { Icon } from '@blueprintjs/core';
import { Classes, Tree } from '@blueprintjs/core';
import {
  handleScrollTop,
  openProjectExists,
  openFile,
  getFolderStructureRootPathFromWorkspace,
} from '../../assets/js/utils/scripts';
import styles from '../../assets/js/styles/components/folders/foldersStyles';

import {
  createFolderJsonModel,
  handleToggleFoldersVisible,
  selectFolderStructureRootPath,
  shouldSwitchFolder,
  watchFolderPath,
} from './foldersScripts';

const useStyles = makeStyles(styles);

function Folders(props) {
  const foldersContainerEl = React.useRef(null);
  const classes = useStyles(props);
  const [state, setState] = React.useState({
    scrolled: false,
    foldersVisible: true,
    prev_workspace: {},
  });

  React.useEffect(() => {
    const callback = e => handleSetState(handleScrollTop(e));

    if (foldersContainerEl.current) {
      foldersContainerEl.current.addEventListener('scroll', callback);

      return () =>
        foldersContainerEl.current &&
        foldersContainerEl.current.removeEventListener('scroll', callback);
    }
  }, [foldersContainerEl.current]);

  React.useEffect(() => {
    if (
      shouldSwitchFolder(
        state.prev_workspace,
        props.workspace ? props.workspace : {},
      )
    ) {
      createFolderJsonModel(
        getFolderStructureRootPathFromWorkspace(props.workspace),
        (folders, root_path) => {
          console.log('root_path: ', root_path);
          props.setFolders(folders);
          watchFolderPath(root_path);
        },
      );
    }

    if (!openProjectExists(props.workspace)) {
      props.setFolders([]);
    }

    handleSetState({
      prev_workspace: JSON.parse(
        JSON.stringify(props.workspace ? props.workspace : {}),
      ),
    });
  }, [props.workspace]);

  const handleSetState = obj => {
    if (obj) {
      Promise.resolve(obj).then(obj => {
        setState(state => ({ ...state, ...obj }));
      });
    }
  };

  const handleToggleFolderExpand = React.useCallback((node, nodePath) => {
    props.expandOrCollapseFolder(nodePath, !node.isExpanded);
  }, []);

  const handleNodeSelection = React.useCallback(nodePath => {
    props.setIsSelected(nodePath);
  });

  const handleNodeClick = React.useCallback((node, nodePath, e) => {
    if (node.hasCaret) {
      handleToggleFolderExpand(node, nodePath);
    } else {
      openFile(node.id);
    }

    handleNodeSelection(nodePath);
  }, []);

  const { foldersVisible, scrolled } = state;

  const { projects } = props.workspace;
  const { folders } = props.files;
  let isOpenProject =
    projects &&
    Object.keys(projects).filter(name => (projects[name].open ? true : false));
  isOpenProject = isOpenProject && isOpenProject.length;

  return Object.keys(props.workspace.projects).length > 0 ? (
    <div
      className={clsx(
        classes.rootStyle,
        props.settings.prefersDarkMode ? 'folders-dark' : 'folders-light',
      )}
      tabIndex="0"
      data-test="folders"
    >
      <ContextMenu2
        content={
          <Menu className={classes.menuStyle}>
            <MenuItem
              className={classes.menuItemStyle}
              onClick={async () =>
                createFolderJsonModel(
                  await selectFolderStructureRootPath(),
                  (folders, root_path) => {
                    console.log('root_path: ', root_path);
                    props.setFolders(folders);
                    watchFolderPath(root_path);
                  },
                )
              }
              text="Switch Folder"
            />
          </Menu>
        }
      >
        <div
          className={classes.titleSectionStyle}
          onClick={() =>
            handleSetState(handleToggleFoldersVisible(foldersVisible))
          }
        >
          {foldersVisible ? (
            <Icon className={classes.iconStyle} icon="chevron-down" />
          ) : (
            <Icon className={classes.iconStyle} icon="chevron-right" />
          )}
          <h2 className={classes.titleStyle}>Folders</h2>
        </div>
      </ContextMenu2>
      <div
        ref={foldersContainerEl}
        className={clsx(
          classes.foldersSectionStyle,
          {
            [classes.scrolledStyle]: scrolled,
          },
          {
            [classes.foldersVisible]: isOpenProject && foldersVisible,
            [classes.foldersHidden]: !foldersVisible,
          },
        )}
      >
        {isOpenProject && folders ? (
          <Tree
            contents={folders}
            onNodeClick={handleNodeClick}
            onNodeCollapse={handleToggleFolderExpand}
            onNodeExpand={handleToggleFolderExpand}
            className={Classes.ELEVATION_0}
          />
        ) : null}
      </div>
    </div>
  ) : null;
}

const mapStateToProps = state => {
  return {
    query: state.query,
    workspace: state.workspace,
    files: state.files,
    settings: state.settings,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    enQueueQuery: query => {
      return dispatch(queryActions.enQueueQuery(query));
    },
    expandOrCollapseFolder: (nodePath, bool) => {
      return dispatch(filesActions.expandOrCollapseFolder(nodePath, bool));
    },
    setFolders: folders => {
      return dispatch(filesActions.setFolders(folders));
    },
    setIsSelected: nodePath => {
      return dispatch(filesActions.setIsSelected(nodePath));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Folders);
