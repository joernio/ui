import React from 'react';
import clsx from 'clsx';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Icon } from '@blueprintjs/core';
import styles from '../../assets/js/styles/components/editor_tabs/editorTabsStyles.js';
import { openFile, closeFile } from '../../assets/js/utils/scripts';

const useStyles = makeStyles(styles);

function EditorTabs(props) {
  const classes = useStyles(props);

  const { openFiles } = props.files;
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
              onClick={() => (path ? openFile(path) : null)}
            >
              <Icon icon="document" className={classes.iconStyle} />
              {filename}
            </div>
            <Icon
              icon="small-cross"
              className={clsx(
                'close-icon',
                classes.iconStyle,
                classes.closeIconStyle,
              )}
              onClick={() => (path ? closeFile(path) : null)}
            />
          </div>
        );
      })}
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
