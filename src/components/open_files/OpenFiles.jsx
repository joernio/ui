import React from 'react';
import clsx from 'clsx';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Icon } from '@blueprintjs/core';
import {
  openFile,
  closeFile,
  handleScrollTop,
  discardDialogHandler,
  openSyntheticFile,
} from '../../assets/js/utils/scripts';
import { syntheticFiles } from '../../assets/js/utils/defaultVariables';
import styles from '../../assets/js/styles/components/open_files/openFilesStyles';
import {
  getEditorFilesFromOpenFiles,
  handleToggleFilesVisible,
} from './openFilesScripts';
import DiscardDialog from '../discard_dialog/DiscardDialog';

const useStyles = makeStyles(styles);

function OpenFiles(props) {
  const filesContainerEl = React.useRef(null);
  const classes = useStyles(props);
  const [state, setState] = React.useState({
    files: {},
    filesVisible: true,
    scrolled: false,
    openDiscardDialog: false,
    discardDialogCallback: () => {},
  });

  React.useEffect(() => {
    if (props.files?.openFiles) {
      const files = getEditorFilesFromOpenFiles(props);
      handleSetState({ files: files ? files : {} });
    }
  }, [props.files.openFiles]);

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

  const {
    files,
    filesVisible,
    scrolled,
    openDiscardDialog,
    discardDialogCallback,
  } = state;

  const { openFiles, openFilePath } = props.files;

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
                    onClick={() =>
                      handleSetState(
                        discardDialogHandler(openFiles, openFilePath, () => {
                          syntheticFiles.includes(path)
                            ? openSyntheticFile(path, openFiles[path])
                            : openFile(path);
                        }),
                      )
                    }
                  >
                    {filename}
                  </h3>

                  {files[path] === false ? (
                    <Icon
                      icon="dot"
                      className={clsx('unsaved-icon', classes.iconStyle)}
                    />
                  ) : null}

                  <Icon
                    icon="small-cross"
                    className={clsx(classes.iconStyle, {
                      'unsaved-cross-icon': files[path] === false,
                    })}
                    onClick={() =>
                      handleSetState(
                        discardDialogHandler(openFiles, openFilePath, () => {
                          closeFile(path);
                        }),
                      )
                    }
                  />
                </div>
              );
            })
          : null}
      </div>
      <DiscardDialog
        handleSetState={handleSetState}
        openDiscardDialog={openDiscardDialog}
        callback={discardDialogCallback}
      />
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

export default connect(mapStateToProps, null)(OpenFiles);
