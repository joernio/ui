import React from 'react';
import { dirPathKey } from '../../assets/js/utils/defaultVariables';
import { openFile } from '../../assets/js/utils/scripts';
import { Icon } from '@blueprintjs/core';
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
    <div style={{ paddingLeft: '0.5em' }}>
      <h3
        onClick={() =>
          openFile(contructFilePath(folder_json_model, root), props)
        }
      >
        {typeof folder_json_model[root] === 'object' ? (
          root_folder_collapsed ? (
            <Icon
              icon="chevron-down"
              onClick={e => handleSetState(handleRootFolderCollapse(e, state))}
            />
          ) : (
            <Icon
              icon="chevron-right"
              onClick={e => handleSetState(handleRootFolderCollapse(e, state))}
            />
          )
        ) : null}
        {root}
      </h3>

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
    </div>
  );
}

export default Folder;
