import React from 'react';
import clsx from 'clsx';
import { connect } from 'react-redux';
import 'xterm/css/xterm.css';
import { makeStyles } from '@material-ui/core';
import { Icon } from '@blueprintjs/core';
import * as queryActions from '../../store/actions/queryActions';
import styles from '../../assets/js/styles/views/terminal/terminalStyles';
import {
  initResize,
  throttle,
  areResultsEqual,
} from '../../assets/js/utils/scripts';
import {
  initXterm,
  initFitAddon,
  handleResize,
  handleMaximize,
  resizeHandler,
  openXTerm,
  sendQueryResultToXTerm,
  handleTerminalMaximizeToggle,
} from './terminalWindowScripts';

const useStyles = makeStyles(styles);

function TerminalWindow(props) {
  const classes = useStyles(props);

  const refs = {
    terminalRef: React.useRef(null),
    resizeEl: React.useRef(null),
  };

  const [state, setState] = React.useState({
    term: initXterm(props.settings.prefersDarkMode),
    fitAddon: null,
    prev_results: null,
    isMaximized: false,
  });

  const resize = e => {
    handleResize(state);
  };

  React.useEffect(() => {
    if (refs.terminalRef.current) {
      openXTerm(refs.terminalRef, state, props);
      handleSetState(initFitAddon(state));
      window.addEventListener('resize', resize);

      return () => window && window.removeEventListener('resize', resize);
    }
  }, [refs.terminalRef]);

  React.useEffect(() => {
    const observer = new ResizeObserver(throttle(resize, 100));
    refs.terminalRef.current && observer.observe(refs.terminalRef.current);
    return () => {};
  }, [state.fitAddon]);

  React.useEffect(() => {
    if (state.term) {
      state.term.setOption('theme', {
        background: props.settings.prefersDarkMode ? '#000000' : '#ffffff',
        foreground: props.settings.prefersDarkMode ? '#ffffff' : '#000000',
        cursorAccent: props.settings.prefersDarkMode ? '#ffffff' : '#000000',
        cursor: props.settings.prefersDarkMode ? '#ffffff' : '#000000',
      });
    }
  }, [props.settings.prefersDarkMode]);

  React.useEffect(() => {
    props.handleSetState(handleMaximize(window, state, props));
  }, [state.isMaximized]);

  React.useEffect(() => {
    setTimeout(resize, 1000);
  }, [props.terminalHeight]);

  React.useEffect(() => {
    if (props.query?.results) {
      const bool = areResultsEqual(state.prev_results, props.query.results);
      const wroteToTerminal =
        !bool && sendQueryResultToXTerm(state, props.query.results);

      wroteToTerminal && handleSetState({ prev_results: props.query.results });
    }
  }, [props.query.results]);

  React.useEffect(() => {
    if (refs.resizeEl.current) {
      const callback = initResize(
        refs.resizeEl.current,
        'row',
        (terminalHeight, diff) =>
          props.handleSetState(
            resizeHandler(terminalHeight, diff, props, window),
          ),
      );
      return () => {
        refs.resizeEl.current &&
          refs.resizeEl.current.removeEventListener('mousedown', callback);
      };
    }
  }, [refs.resizeEl.current]);

  const handleSetState = obj => {
    if (obj) {
      Promise.resolve(obj).then(obj => {
        setState(state => ({ ...state, ...obj }));
      });
    }
  };

  const { terminalHeight } = props;
  const { isMaximized } = state;

  return (
    <div
      ref={refs.terminalRef}
      className={clsx(classes.terminalStyle, {
        [classes.terminalOpen]: terminalHeight,
        [classes.terminalClose]: !terminalHeight,
      })}
    >
      <div ref={refs.resizeEl} className={classes.resizeHandleStyle}></div>
      <div className={classes.terminalControlContainerStyle}>
        <Icon
          icon="minus"
          className={classes.terminalControlItemsStyle}
          onClick={() => props.handleSetState({ terminalHeight: 0 })}
        />

        {isMaximized ? (
          <Icon
            icon="minimize"
            className={classes.terminalControlItemsStyle}
            onClick={() =>
              handleSetState(handleTerminalMaximizeToggle(isMaximized))
            }
          />
        ) : (
          <Icon
            icon="maximize"
            className={classes.terminalControlItemsStyle}
            onClick={() =>
              handleSetState(handleTerminalMaximizeToggle(isMaximized))
            }
          />
        )}
      </div>
    </div>
  );
}

const mapStateToProps = state => {
  return {
    query: state.query,
    settings: state.settings,
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
