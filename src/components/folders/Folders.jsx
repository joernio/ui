import React from 'react';
import { connect } from 'react-redux';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import * as queryActions from '../../store/actions/queryActions';
import * as filesActions from '../../store/actions/filesActions';
import { Icon } from '@blueprintjs/core';
import { Classes, Tree } from '@blueprintjs/core';
import { handleScrollTop, openFile } from '../../assets/js/utils/scripts';
import styles from '../../assets/js/styles/components/folders/foldersStyles';

import {
  createFolderJsonModel,
  handleToggleFoldersVisible,
} from './foldersScripts';

const useStyles = makeStyles(styles);

function Folders(props) {
  const foldersContainerEl = React.useRef(null);
  const classes = useStyles(props);
  const [state, setState] = React.useState({
    scrolled: false,
    foldersVisible: true,
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
    createFolderJsonModel(props.workspace, folders =>
      props.setFolders(folders),
    );
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

  const handleNodeClick = React.useCallback((node, nodePath, e) => {
    if (node.hasCaret) {
      handleToggleFolderExpand(node, nodePath);
    } else {
      openFile(node.id, props);
    }
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
    setRecent: files => {
      return dispatch(filesActions.setRecent(files));
    },
    expandOrCollapseFolder: (nodePath, bool) => {
      return dispatch(filesActions.expandOrCollapseFolder(nodePath, bool));
    },
    setFolders: folders => {
      return dispatch(filesActions.setFolders(folders));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Folders);
