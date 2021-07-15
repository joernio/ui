import React from 'react';
import ExplorerWindow from '../explorer_window/ExplorerWindow';
import EditorWindow from '../editor_window/EditorWindow';
import TerminalWindow from '../terminal_window/TerminalWindow';
import SideNav from '../side_nav/SideNav';
import { makeStyles } from '@material-ui/core/styles';
import styles from '../../assets/js/styles/views/window/windowStyles';
import { getWindowHeight } from './windowScripts';

const useStyle = makeStyles(styles);

function Window(props) {
  const [state, setState] = React.useState({
    topNavHeight: '35px',
    statusBarHeight: '28px',
    drawerWidth: '250px',
    terminalHeight: '468px',
    sideNavWidth: '3.5em',
    clientHeight: document.documentElement.clientHeight,
  });

  React.useEffect(() => {
    const observer = new ResizeObserver(() =>
      handleSetState({ clientHeight: document.documentElement.clientHeight }),
    );
    observer.observe(document.querySelector('body'));
    return () => {
      observer.unobserve(document.querySelector('body'));
    };
  }, []);

  const windowHeight = getWindowHeight(
    state.clientHeight,
    state.topNavHeight,
    state.statusBarHeight,
  );

  const classes = useStyle({ windowHeight });

  const handleSetState = obj => {
    if (obj) {
      Promise.resolve(obj).then(obj => {
        setState(state => ({ ...state, ...obj }));
      });
    }
  };

  const {
    drawerOpen,
    sideNavWidth,
    topNavHeight,
    statusBarHeight,
    drawerWidth,
    terminalHeight,
  } = state;
  return (
    <div className={classes.windowStyle}>
      <div className={classes.sideNavAndExplorerSectionStyle}>
        <SideNav
          drawerWidth={drawerWidth}
          sideNavWidth={sideNavWidth}
          terminalHeight={terminalHeight}
          handleSetState={handleSetState}
        />
        <ExplorerWindow
          drawerOpen={drawerOpen}
          drawerWidth={drawerWidth}
          sideNavWidth={sideNavWidth}
          handleSetState={handleSetState}
        />
      </div>
      <div className={classes.editorAndTerminalSectionStyle}>
        <EditorWindow drawerWidth={drawerWidth} sideNavWidth={sideNavWidth} />
        <TerminalWindow
          terminalHeight={terminalHeight}
          topNavHeight={topNavHeight}
          statusBarHeight={statusBarHeight}
          handleSetState={handleSetState}
        />
      </div>
    </div>
  );
}

export default Window;
