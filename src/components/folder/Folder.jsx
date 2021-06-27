import React from 'react';
import { dirPathKey } from '../../assets/js/utils/defaultVariables';
import { openFile } from '../../assets/js/utils/scripts';
import { Typography, Box } from '@material-ui/core';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { handleRootFolderCollapse, contructFilePath } from './folderScripts';

function Folder(props) {
  const [state, setState] = React.useState({
    root_folder_collapsed: true,
  });

  const handleSetState = obj => {
    if (obj) {
      Promise.resolve(obj).then(obj => {
        setState(state => ({ ...state, ...obj }));
      });
    }
  };

  const { root_folder_collapsed } = state;
  const { folder_json_model, root } = props;
  const keys =
    typeof folder_json_model[root] === 'object'
      ? Object.keys(folder_json_model[root])
      : null;
  return (
    <Box style={{ paddingLeft: '0.5em' }}>
      <Typography
        onClick={() =>
          openFile(contructFilePath(folder_json_model, root), props)
        }
      >
        {typeof folder_json_model[root] === 'object' ? (
          root_folder_collapsed ? (
            <ExpandMoreIcon
              onClick={e => handleSetState(handleRootFolderCollapse(e, state))}
            />
          ) : (
            <ChevronRightIcon
              onClick={e => handleSetState(handleRootFolderCollapse(e, state))}
            />
          )
        ) : null}
        {root}
      </Typography>

      {root_folder_collapsed
        ? keys?.map((key, _) => {
            if (key !== dirPathKey) {
              return (
                <Folder
                  {...props}
                  key={key}
                  folder_json_model={folder_json_model[root]}
                  root={key}
                />
              );
            }
          })
        : null}
    </Box>
  );
}

export default Folder;
