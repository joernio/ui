import React from 'react';
import clsx from 'clsx';
import { connect } from 'react-redux';
import 'xterm/css/xterm.css';
import { makeStyles } from '@material-ui/core';
import * as queryActions from '../../store/actions/queryActions';
import {
  initXterm,
  openXTerm,
  sendQueryResultToXTerm,
} from './terminalWindowScripts';

const useStyles = makeStyles(theme => ({
  TerminalStyle: {
    width: '100%',
    backgroundColor: 'black',
    paddingLeft: props =>
      `calc(${
        props.drawerOpen ? props.drawerWidth : props.sideNavWidth
      } + 10px)`,
    paddingTop: '10px',
    position: 'absolute',
    right: 0,
    bottom: 0,
    '& .xterm .xterm-viewport': {
      overflowY: 'hidden',
    },
  },
  terminalOpen: {
    transition: theme.transitions.create('height', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    height: 'auto',
  },
  terminalClose: {
    transition: theme.transitions.create('height', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    height: 0,
    visibility: 'hidden',
  },
}));

function TerminalWindow(props) {
  const classes = useStyles(props);
  const terminalRef = React.useRef(null);

  const [state, setState] = React.useState({
    term: initXterm(),
  });

  React.useEffect(() => {
    openXTerm(terminalRef, state, props);
  }, [terminalRef]);

  React.useEffect(() => {
    sendQueryResultToXTerm(state, props);
  }, [props.query.results]);

  const { terminalOpen } = props;

  return (
    <div
      ref={terminalRef}
      className={clsx(classes.TerminalStyle, {
        [classes.terminalOpen]: terminalOpen,
        [classes.terminalClose]: !terminalOpen,
      })}
    ></div>
  );
}

const mapStateToProps = state => {
  return {
    query: state.query,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    enQueueQuery: query => {
      return dispatch(queryActions.enQueueQuery(query));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TerminalWindow);
