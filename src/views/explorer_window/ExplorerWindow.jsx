import React from 'react';
import clsx from 'clsx';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Icon } from '@blueprintjs/core';
import Folders from '../../components/folders/Folders';
import Workspace from '../../components/workspace/Workspace';
import CpgScripts from '../../components/cpg_scripts/CpgScripts';
import OpenFiles from '../../components/open_files/OpenFiles';
import { initResize } from '../../assets/js/utils/scripts';
import { resizeHandler } from './explorerWindowScripts';
import styles from '../../assets/js/styles/views/explorer_window/explorerWindowStyles';

const useStyles = makeStyles(styles);

function ExplorerWindow(props) {
  const resizeEl = React.useRef(null);
  const classes = useStyles(props);

  React.useEffect(() => {
    if (resizeEl.current) {
      const callback = initResize(
        resizeEl.current,
        'col',
        (drawerWidth, diff) => {
          props.handleSetState(resizeHandler(drawerWidth, diff));
        },
      );
      return () => {
        resizeEl.current &&
          resizeEl.current.removeEventListener('mousedown', callback);
      };
    }
  }, [resizeEl.current]);

  const { drawerWidth } = props;

  return (
    <div
      className={clsx(classes.root, {
        [classes.drawerOpen]: drawerWidth,
        [classes.drawerClose]: !drawerWidth,
      })}
      data-test="explorer-window"
    >
      <div ref={resizeEl} className={classes.resizeHandleStyle}></div>
      <h1 className={classes.titleStyle}>explorer</h1>
      {Object.keys(props.query.results).length < 1 ? (
        <Icon
          icon="refresh"
          iconSize={40}
          className={clsx(classes.refreshIconStyle, 'refresh-icon-animation')}
        />
      ) : (
        <>
          <CpgScripts />
          <OpenFiles />
          <Workspace />
          <Folders />
        </>
      )}
    </div>
  );
}

const mapStateToProps = state => {
  return {
    query: state.query,
    settings: state.settings,
  };
};

export default connect(mapStateToProps, null)(ExplorerWindow);
