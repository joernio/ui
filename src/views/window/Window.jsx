import React from 'react';
import ProjectWindow from '../project_window/ProjectWindow';
import EditorWindow from '../editor_window/EditorWindow';
import TerminalWindow from '../terminal_window/TerminalWindow';
import SideNav from '../side_nav/SideNav';

function Window(props) {
  const [state, setState] = React.useState({
    sideNavWidth: '49px',
    drawerWidth: '240px',
    drawerOpen: true,
    terminalOpen: true,
  });

  const handleSetState = obj => {
    if (obj) {
      Promise.resolve(obj).then(obj => {
        setState(state => ({ ...state, ...obj }));
      });
    }
  };

  const { drawerOpen, terminalOpen, sideNavWidth, drawerWidth } = state;
  return (
    <>
      <ProjectWindow
        {...props}
        drawerOpen={drawerOpen}
        drawerWidth={drawerWidth}
      />
      <SideNav
        {...props}
        drawerOpen={drawerOpen}
        terminalOpen={terminalOpen}
        sideNavWidth={sideNavWidth}
        handleSetState={handleSetState}
      />
      <EditorWindow
        {...props}
        drawerOpen={drawerOpen}
        sideNavWidth={sideNavWidth}
        drawerWidth={drawerWidth}
      />
      <TerminalWindow
        {...props}
        drawerOpen={drawerOpen}
        terminalOpen={terminalOpen}
        sideNavWidth={sideNavWidth}
        drawerWidth={drawerWidth}
      />
    </>
  );
}

export default Window;
