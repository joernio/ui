import React from 'react';
import clsx from 'clsx';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import * as filesActions from '../../store/actions/filesActions';
import { Icon } from '@blueprintjs/core';
import {
  openFile,
  closeFile,
  handleScrollTop,
} from '../../assets/js/utils/scripts';
import styles from '../../assets/js/styles/components/open_files/openFilesStyles';
import {
  getEditorFilesFromRecent,
  handleToggleFilesVisible,
} from './openFilesScripts';

const useStyles = makeStyles(styles);

function OpenFiles(props) {
  const filesContainerEl = React.useRef(null);
  const classes = useStyles(props);
  const [state, setState] = React.useState({
    files: {},
    filesVisible: true,
    scrolled: false,
  });

  React.useEffect(() => {
    if (props.files?.recent) {
      const files = getEditorFilesFromRecent(props);
      handleSetState({ files: files ? files : {} });
    }
  }, [props.files.recent]);

  React.useEffect(() => {
    const callback = e => handleSetState(handleScrollTop(e));

    if (filesContainerEl.current) {
      filesContainerEl.current.addEventListener('scroll', callback);

      return () =>
        filesContainerEl.current &&
        filesContainerEl.current.removeEventListener('scroll', callback);
    }
  }, [filesContainerEl.current]);

  const handleSetState = obj => {
    if (obj) {
      Promise.resolve(obj).then(obj => {
        setState(state => ({ ...state, ...obj }));
      });
    }
  };

  const { files, filesVisible, scrolled } = state;

  return Object.keys(props.workspace.projects).length > 0 ? (
    <div className={classes.rootStyle} tabIndex="0" data-test="open-files">
      <div
        className={classes.titleSectionStyle}
        onClick={() => handleSetState(handleToggleFilesVisible(filesVisible))}
      >
        {filesVisible ? (
          <Icon className={classes.iconStyle} icon="chevron-down" />
        ) : (
          <Icon className={classes.iconStyle} icon="chevron-right" />
        )}
        <h2 className={classes.titleStyle}>Open Editor</h2>
      </div>
      <div
        ref={filesContainerEl}
        className={clsx(
          classes.filesSectionStyle,
          {
            [classes.scrolledStyle]: scrolled,
          },
          {
            [classes.filesVisible]: filesVisible,
            [classes.filesHidden]: !filesVisible,
          },
        )}
      >
        {filesVisible && files
          ? Object.keys(files).map(path => {
              let filename = path.split('/');
              filename = filename[filename.length - 1];
              return (
                <div className={classes.fileSectionStyle} tabIndex="0">
                  <h3
                    className={classes.fileNameStyle}
                    key={path}
                    onClick={() => (path ? openFile(path) : null)}
                  >
                    {filename}
                  </h3>
                  <Icon
                    icon="small-cross"
                    className={classes.iconStyle}
                    onClick={() => (path ? closeFile(path) : null)}
                  />
                </div>
              );
            })
          : null}
      </div>
    </div>
  ) : null;
}

const mapStateToProps = state => {
  return {
    query: state.query,
    files: state.files,
    settings: state.settings,
    workspace: state.workspace,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setRecent: files => {
      return dispatch(filesActions.setRecent(files));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(OpenFiles);
