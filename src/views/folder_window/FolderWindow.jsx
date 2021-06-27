import React from 'react';
import { connect } from 'react-redux';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import * as queryActions from '../../store/actions/queryActions';
import * as filesActions from '../../store/actions/filesActions';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { dirPathKey } from '../../assets/js/utils/defaultVariables';
import { getFolderStructureRootPath } from '../../assets/js/utils/scripts';

import {
  handleRootFolderCollapse,
  createFolderJsonModel,
} from './folderWindowScripts';
import Folder from '../../components/folder/Folder';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    zIndex: 1000,
  },
  drawer: {
    width: props => props.drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    marginTop: '2.5em',
    backgroundColor: theme.palette.drawer.main,
    width: props => props.drawerWidth,
  },
  drawerClose: {
    marginTop: '2.5em',
    backgroundColor: theme.palette.drawer.main,
    overflowX: 'hidden',
    width: 0,
  },
  drawerPaddingLeft: {
    paddingLeft: '4em',
  },
}));

function FolderWindow(props) {
  const [state, setState] = React.useState({
    folder_json_model: null,
    root_folder_collapsed: true,
  });

  React.useEffect(() => {
    createFolderJsonModel(props, handleSetState);
  }, [props.workspace]);

  const handleSetState = obj => {
    if (obj) {
      Promise.resolve(obj).then(obj => {
        setState(state => ({ ...state, ...obj }));
      });
    }
  };

  const { folder_json_model, root_folder_collapsed } = state;

  const { root } = getFolderStructureRootPath(props.workspace);
  const keys = folder_json_model ? Object.keys(folder_json_model) : null;

  return (
    <Box
      style={{
        BorderTop: '2px solid red',
        paddingLeft: '5em',
        marginTop: '3em',
      }}
    >
      <Typography>
        {typeof folder_json_model === 'object' ? (
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
        ? keys?.map((key, index) => {
            if (key !== dirPathKey) {
              return (
                <Folder
                  {...props}
                  key={key}
                  folder_json_model={folder_json_model}
                  root={key}
                />
              );
            }
          })
        : null}
    </Box>
  );
}

const mapStateToProps = state => {
  return {
    query: state.query,
    workspace: state.workspace,
    files: state.files,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    enQueueQuery: query => {
      return dispatch(queryActions.enQueueQuery(query));
    },
    setRecent: files => {
      return dispatch(filesActions.setRecent(files));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FolderWindow);
