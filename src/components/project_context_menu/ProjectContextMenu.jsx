import React from 'react';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Typography from '@material-ui/core/Typography';
import Popover from '@material-ui/core/Popover';
import {
  handleOpenProjectContextMenu,
  handleCloseProjectContextMenu,
} from './projectContextMenuScripts';

function ProjectContextMenu(props) {
  const [state, setState] = React.useState({
    project_context_anchor_el: null,
  });

  const handleSetState = obj => {
    if (obj) {
      Promise.resolve(obj).then(obj => {
        setState(state => ({ ...state, ...obj }));
      });
    }
  };

  const { project_context_anchor_el } = state;
  const project_context_menu_open = Boolean(project_context_anchor_el);
  const project_popover_id = project_context_menu_open
    ? 'project-context-popover'
    : undefined;

  const {
    name,
    index,
    handleOpenProject,
    handleCloseProject,
    handleDeleteProject,
  } = props;
  return (
    <>
      <MoreVertIcon
        key={`${name}-${index}`}
        aria-describedby={`${name}-${project_popover_id}`}
        onClick={e => handleSetState(handleOpenProjectContextMenu(e))}
      />
      <Popover
        key={name}
        id={`${name}-${project_popover_id}`}
        open={project_context_menu_open}
        anchorEl={project_context_anchor_el}
        onClose={() => handleSetState(handleCloseProjectContextMenu())}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <Typography onClick={handleOpenProject}>open project</Typography>
        <Typography onClick={handleCloseProject}>close project</Typography>
        <Typography onClick={handleDeleteProject}>delete project</Typography>
      </Popover>
    </>
  );
}

export default ProjectContextMenu;
