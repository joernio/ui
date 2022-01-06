import React from 'react';
import clsx from 'clsx';
import { connect } from 'react-redux';
import 'xterm/css/xterm.css';
import { makeStyles } from '@material-ui/core';
import { Icon } from '@blueprintjs/core';
import { Popover2 } from '@blueprintjs/popover2';
import * as terminalActions from '../../store/actions/terminalActions';
import * as queryActions from '../../store/actions/queryActions';
import * as settingsActions from '../../store/actions/settingsActions';
import styles from '../../assets/js/styles/views/terminal/terminalStyles';
import {
  initResize,
  throttle,
  areResultsEqual,
} from '../../assets/js/utils/scripts';
import {
  initXterm,
  initCircuitUI,
  initFitAddon,
  handleResize,
  handleMaximize,
  resizeHandler,
  openXTerm,
  sendQueryResultToXTerm,
  handleTerminalMaximizeToggle,
  handleAddQueryToHistory,
  handleEmptyWorkspace,
  handleSuggestionClick,
  calculateSuggestionsPopoverMarginLeft,
  data_obj,
} from './terminalWindowScripts';
import commonStyles from '../../assets/js/styles';

const useStyles = makeStyles(styles);
const useCommonStyles = makeStyles(commonStyles);

function TerminalWindow(props) {
  const classes = useStyles(props);
  const commonClasses = useCommonStyles(props);

  const refs = {
    terminalRef: React.useRef(null),
    circuitUIRef: React.useRef(null),
    suggestionsPopoverMarginLeftTrackerEl: React.useRef(null),
    suggestionsContainerEl: React.useRef(null),
    resizeEl: React.useRef(null),
  };

  const resize = e => {
    handleResize(props.terminal.fitAddon);
  };

  React.useEffect(() => {
    (async () => {
      props.setTerm(await initXterm(props.settings.prefersDarkMode));
      props.setRefs(refs);
    })();
  }, []);

  React.useEffect(() => {
    props.setIsMaximized(
      handleEmptyWorkspace(props.workspace, props.terminal.prev_workspace),
    );
    props.setPrevWorkspace({
      prev_workspace: props.workspace
        ? JSON.parse(JSON.stringify(props.workspace))
        : {},
    });
  }, [props.workspace]);

  React.useEffect(() => {
    if (refs.terminalRef.current && props.terminal.term) {
      openXTerm(refs, props.terminal.term);
      props.setFitAddon(initFitAddon(props.terminal.term));
      window.addEventListener('resize', resize);

      return () => window && window.removeEventListener('resize', resize);
    }
  }, [refs.terminalRef, props.terminal.term]);

  React.useEffect(() => {
    if (refs.circuitUIRef.current) {
      return initCircuitUI(refs);
    }
  }, [refs.circuitUIRef]);

  React.useEffect(() => {
    const observer = new MutationObserver(() =>
      calculateSuggestionsPopoverMarginLeft(refs),
    );
    refs.suggestionsPopoverMarginLeftTrackerEl.current &&
      observer.observe(refs.suggestionsPopoverMarginLeftTrackerEl.current, {
        childList: true,
      });
    return () =>
      refs.suggestionsPopoverMarginLeftTrackerEl.current &&
      observer.disconnect(refs.suggestionsPopoverMarginLeftTrackerEl.current);
  }, [refs.suggestionsPopoverMarginLeftTrackerEl]);

  React.useEffect(() => {
    if (
      props.terminal.query_suggestions.length > 0 &&
      !props.settings.prefersTerminalView
    ) {
      props.setSuggestionDialogOpen(true);
    } else {
      props.setSuggestionDialogOpen(false);
    }
  }, [props.terminal.query_suggestions]);

  React.useEffect(() => {
    const observer = new ResizeObserver(throttle(resize, 50));
    refs.terminalRef.current && observer.observe(refs.terminalRef.current);

    return () =>
      refs.terminalRef.current && observer.unobserve(refs.terminalRef.current);
  }, [props.terminal.fitAddon]);

  React.useEffect(() => {
    if (props.terminal.term) {
      props.terminal.term.setOption('theme', {
        background: props.settings.prefersDarkMode ? '#000000' : '#ffffff',
        foreground: props.settings.prefersDarkMode ? '#ffffff' : '#000000',
        cursorAccent: props.settings.prefersDarkMode ? '#ffffff' : '#000000',
        cursor: props.settings.prefersDarkMode ? '#ffffff' : '#000000',
      });

      props.terminal.term.setOption(
        'fontSize',
        props?.settings?.fontSize
          ? Number(props.settings.fontSize.split('px')[0])
          : 16,
      );
    }
  }, [props.settings.prefersDarkMode, props.settings.fontSize]);

  React.useEffect(() => {
    props.handleSetState(handleMaximize(window, props));
  }, [props.terminal.isMaximized]);

  React.useEffect(() => {
    setTimeout(resize, 500);
  }, [props.terminalHeight]);

  React.useEffect(() => {
    if (props.query?.queue && Object.keys(props.query.queue).length) {
      handleAddQueryToHistory(props.query.queue);
    }
  }, [props.query.queue]);

  React.useEffect(() => {
    (async () => {
      if (props.query?.results) {
        const bool = areResultsEqual(
          props.terminal.prev_results,
          props.query.results,
        );
        const wroteToTerminal =
          !bool && (await sendQueryResultToXTerm(props.query.results, refs));

        wroteToTerminal && props.setPrevResults(props.query.results);
      }
    })();
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

  const { terminalHeight } = props;
  const { isMaximized, query_suggestions, suggestion_dialog_open } =
    props.terminal;
  const { prefersTerminalView } = props.settings;

  return (
    <div
      ref={refs.terminalRef}
      className={clsx(classes.terminalStyle, commonClasses.scrollBarStyle, {
        [classes.terminalOpen]: terminalHeight,
        [classes.terminalClose]: !terminalHeight,
      })}
      data-test="terminal-window"
    >
      <div ref={refs.resizeEl} className={classes.resizeHandleStyle}></div>
      <div className={classes.terminalControlContainerStyle}>
        {prefersTerminalView ? (
          <Icon
            icon="application"
            className={classes.terminalControlItemsStyle}
            onClick={() =>
              props.setSettings({ prefersTerminalView: !prefersTerminalView })
            }
          />
        ) : (
          <Icon
            icon="console"
            className={classes.terminalControlItemsStyle}
            onClick={() =>
              props.setSettings({ prefersTerminalView: !prefersTerminalView })
            }
          />
        )}

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
              props.setIsMaximized(handleTerminalMaximizeToggle(isMaximized))
            }
          />
        ) : (
          <Icon
            icon="maximize"
            className={classes.terminalControlItemsStyle}
            onClick={() =>
              props.setIsMaximized(handleTerminalMaximizeToggle(isMaximized))
            }
          />
        )}
      </div>
      <div ref={refs.circuitUIRef} className={classes.circuitUIStyle}>
        <div
          className={clsx(commonClasses.scrollBarStyle)}
          id="circuit-ui-results-container"
        >
          <div id="circuit-ui-welcome-screen-container">
            <h1>CPG Explorer</h1>
            <p>Let's Explore</p>
            <p>
              {!props.status.connected
                ? 'Waiting for CPG server connection...'
                : Object.keys(props.workspace.projects).length < 1
                ? 'Click on File -> Import File / Import Directory to begin importing your code'
                : 'Start writing some queries below. Type "help" for more instructions'}
            </p>
          </div>
        </div>
        <div id="circuit-ui-input-container">
          <input type="text" placeholder="▰  query" />
          <button>Run Query ↵</button>
          <Popover2
            shouldReturnFocusOnClose={true}
            placement="auto-end"
            interactionKind="click"
            minimal={true}
            isOpen={suggestion_dialog_open}
            onClose={() => props.setSuggestionDialogOpen(false)}
            className={classes.querySuggestionPopoverStyle}
            portalClassName={clsx(
              classes.querySuggestionPopoverPortalStyle,
              'query-suggestion-popover-portal',
            )}
            shouldReturnFocusOnClose={true}
            content={
              <div
                ref={refs.suggestionsContainerEl}
                className={clsx(
                  classes.querySuggestionsStyle,
                  commonClasses.scrollBarStyle,
                  commonClasses.scrollBarDarkStyle,
                )}
              >
                {query_suggestions.map((query_suggestion, index) => (
                  <div
                    tabIndex="0"
                    autofocus={index === 0 ? true : false}
                    key={query_suggestion.suggestion}
                    className={clsx(classes.querySuggestionStyle, {
                      'query-suggestion-selected': index === 0 ? true : false,
                    })}
                    onClick={e =>
                      handleSuggestionClick(e, refs, props.terminal.term)
                    }
                  >
                    <Icon
                      icon={query_suggestion.origin}
                      className={classes.querySuggestionOriginIconStyle}
                    />

                    {!data_obj.data
                      ? query_suggestion.suggestion
                      : query_suggestion.suggestion
                          .split(data_obj.data)
                          .map((str, index) => {
                            return index === 0 ? (
                              <span
                                className={classes.querySuggestionMatchStyle}
                              >
                                {data_obj.data}
                              </span>
                            ) : (
                              <span>{str}</span>
                            );
                          })}
                  </div>
                ))}
              </div>
            }
          >
            <span
              id="suggestion-box-tracker"
              ref={refs.suggestionsPopoverMarginLeftTrackerEl}
            ></span>
          </Popover2>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = state => {
  return {
    terminal: state.terminal,
    query: state.query,
    workspace: state.workspace,
    status: state.status,
    settings: state.settings,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setTerm: term => {
      return dispatch(terminalActions.setTerm(term));
    },
    setRefs: refs => {
      return dispatch(terminalActions.setRefs(refs));
    },
    setFitAddon: fit_addon => {
      return dispatch(terminalActions.setFitAddon(fit_addon));
    },
    setPrevResults: prev_results => {
      return dispatch(terminalActions.setPrevResults(prev_results));
    },
    setPrevWorkspace: prev_workspace => {
      return dispatch(terminalActions.setPrevWorkspace(prev_workspace));
    },
    setIsMaximized: obj => {
      return dispatch(terminalActions.setIsMaximized(obj));
    },
    setSuggestionDialogOpen: bool => {
      return dispatch(terminalActions.setSuggestionDialogOpen(bool));
    },
    setSettings: values => {
      return dispatch(settingsActions.setSettings(values));
    },
    enQueueQuery: query => {
      return dispatch(queryActions.enQueueQuery(query));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TerminalWindow);
