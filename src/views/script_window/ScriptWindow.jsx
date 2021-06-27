import React from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import * as queryActions from '../../store/actions/queryActions';
import * as filesActions from '../../store/actions/filesActions';
import Typography from '@material-ui/core/Typography';
import { openFile } from '../../assets/js/utils/scripts';
import {
  runScript,
  getJoernScripts,
  getJoernScriptsFromRecent,
} from './scriptWindowScripts';

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

function ScriptWindow(props) {
  const [state, setState] = React.useState({
    scripts: {},
  });

  React.useEffect(async () => {
    const scripts = await getJoernScripts(state, props);
    handleSetState({ scripts: scripts ? scripts : {} });
  }, [props.workspace]);

  React.useEffect(() => {
    const scripts = getJoernScriptsFromRecent(state, props);
    handleSetState({ scripts: scripts ? scripts : {} });
  }, [props.files]);

  const handleSetState = obj => {
    if (obj) {
      Promise.resolve(obj).then(obj => {
        setState(state => ({ ...state, ...obj }));
      });
    }
  };

  const { scripts } = state;

  return (
    <div>
      <Typography style={{ marginBottom: '0.5em' }}>Scripts</Typography>
      {scripts
        ? Object.keys(scripts).map(path => {
            let filename = path.split('/');
            filename = filename[filename.length - 1];
            return (
              <Typography
                key={path}
                onClick={() => (path ? openFile(path, props) : null)}
              >
                {filename}
                {filename.endsWith('.sc') ? (
                  <span
                    onClick={() => runScript(path, props)}
                    style={{ paddingLeft: '0.3em' }}
                  >
                    Run
                  </span>
                ) : null}
              </Typography>
            );
          })
        : null}
    </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(ScriptWindow);
