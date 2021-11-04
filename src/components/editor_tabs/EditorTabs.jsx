import React from 'react';
import clsx from 'clsx';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Icon } from '@blueprintjs/core';
import DiscardDialog from '../discard_dialog/DiscardDialog';
import styles from '../../assets/js/styles/components/editor_tabs/editorTabsStyles.js';
import {
  openFile,
  closeFile,
  discardDialogHandler,
  getExtension,
  openSyntheticFile,
} from '../../assets/js/utils/scripts';
import { syntheticFileExtensions } from '../../assets/js/utils/defaultVariables';

const useStyles = makeStyles(styles);

function EditorTabs(props) {
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

  const { openFiles, openFilePath } = props.files;
  const { openDiscardDialog, discardDialogCallback } = state;

  return (
    <div className={classes.editorTabsContainerStyle} data-test="editor-tabs">
      {Object.keys(openFiles ? openFiles : {}).map(path => {
        let filename = path.split('/');
        filename = filename[filename.length - 1];
        return (
          <div
            className={clsx(classes.editorTabStyle, {
              [classes.editorTabActiveStyle]:
                path === props.files.openFilePath ? true : false,
            })}
            key={path}
          >
            <div
              className={classes.editorTabTitleStyle}
              onClick={() =>
                handleSetState(
                  discardDialogHandler(openFiles, openFilePath, () => {
                    syntheticFileExtensions.includes(getExtension(path))
                      ? openSyntheticFile(path, openFiles[path])
                      : openFile(path);
                  }),
                )
              }
            >
              <Icon icon="document" className={classes.iconStyle} />
              {filename}
            </div>
            {openFiles[path] === false ? (
              <Icon
                icon="dot"
                className={clsx('unsaved-icon', classes.iconStyle)}
              />
            ) : null}
            <Icon
              icon="small-cross"
              className={clsx(classes.iconStyle, classes.closeIconStyle, {
                'unsaved-close-icon-style': openFiles[path] === false,
                'saved-close-icon-style': openFiles[path] !== false,
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
      })}
      <DiscardDialog
        handleSetState={handleSetState}
        openDiscardDialog={openDiscardDialog}
        callback={discardDialogCallback}
      />
    </div>
  );
}

const mapStateToProps = state => {
  return {
    files: state.files,
    settings: state.settings,
  };
};

export default connect(mapStateToProps, null)(EditorTabs);
