import React from 'react';
import { connect } from 'react-redux';
import clsx from 'clsx';
import {
  Dialog,
  Tag,
  Icon,
  HTMLSelect,
  Switch,
  Divider,
} from '@blueprintjs/core';
import * as settingsActions from '../../store/actions/settingsActions';
import {
  handleSaveQueryShortcut,
  buildPropertyColumns,
  deleteQueryShorcut,
  handleOnKeyDown,
  openDialog,
  closeDialog,
  resizeHandler,
  parseKeyBinding,
  clearKeybindingInput,
} from './queryShortcutsViewerScripts';
import { initResize } from '../../assets/js/utils/scripts';
import { makeStyles } from '@material-ui/core';
import styles from '../../assets/js/styles/components/query_shortcuts_viewer/queryShortcutsViewerStyles';

const useStyles = makeStyles(styles);

function QueryShortcutsViewer(props) {
  const classes = useStyles(props);
  const refs = {
    searchQueryShortcutsEl: React.useRef(null),
    shortcutDialogEl: React.useRef(null),
    keybindingColumnResizerEl: React.useRef(null),
    behaviourColumnResizerEl: React.useRef(null),
    backgroundColumnResizerEl: React.useRef(null),
  };
  const [state, setState] = React.useState({
    dialogOpen: false,
    values: {},
    queries: [],
    keybindings: [],
    behaviours: [],
    backgrounds: [],
    queryColumnWidth: 40,
    keybindingColumnWidth: 25,
    behaviourColumnWidth: 20,
    backgroundColumnWidth: 15,
  });

  // React.useEffect(() => {
  //   handleSetState(
  //     buildPropertyColumns(
  //       refs.searchQueryShortcutsEl.current?.value
  //         ? refs.searchQueryShortcutsEl.current.value
  //         : '',
  //       props.settings.queryShortcuts,
  //     ),
  //   );
  // }, [
  //   props.settings.queryShortcuts,
  //   refs.searchQueryShortcutsEl.current?.value,
  // ]);

  React.useEffect(() => {
    const callback = () =>
      handleSetState(
        buildPropertyColumns(
          refs.searchQueryShortcutsEl.current?.value
            ? refs.searchQueryShortcutsEl.current.value
            : '',
          props.settings.queryShortcuts,
        ),
      );
    callback();
    if (refs.searchQueryShortcutsEl.current) {
      refs.searchQueryShortcutsEl.current.removeEventListener(
        'keypress',
        callback,
      );
      refs.searchQueryShortcutsEl.current.addEventListener(
        'keypress',
        callback,
      );
      return () =>
        refs.searchQueryShortcutsEl.current &&
        refs.searchQueryShortcutsEl.current.removeEventListener(
          'keypress',
          callback,
        );
    }
  }, [props.settings.queryShortcuts, refs.searchQueryShortcutsEl.current]);

  // React.useEffect(() => {
  //   if (refs.backgroundColumnResizerEl.current) {
  //     const keybindingColumnResizeCallback = initResize(
  //       refs.keybindingColumnResizerEl.current,
  //       'col',
  //       (_, diff) => {
  //         handleSetState(
  //           resizeHandler(
  //             diff,
  //             'keybindingColumnWidth',
  //             refs.keybindingColumnResizerEl.current,
  //             state,
  //           ),
  //         );
  //       },
  //     );

  //     const behaviourColumnResizeCallback = initResize(
  //       refs.behaviourColumnResizerEl.current,
  //       'col',
  //       (_, diff) => {
  //         handleSetState(
  //           resizeHandler(
  //             diff,
  //             'behaviourColumnWidth',
  //             refs.behaviourColumnResizerEl.current,
  //             state,
  //           ),
  //         );
  //       },
  //     );

  //     const backgroundColumnResizeCallback = initResize(
  //       refs.backgroundColumnResizerEl.current,
  //       'col',
  //       (_, diff) => {
  //         handleSetState(
  //           resizeHandler(
  //             diff,
  //             'backgroundColumnWidth',
  //             refs.backgroundColumnResizerEl.current,
  //             state,
  //           ),
  //         );
  //       },
  //     );

  //     return () => {
  //       refs.keybindingColumnResizerEl.current &&
  //         refs.keybindingColumnResizerEl.current.removeEventListener(
  //           'mousedown',
  //           keybindingColumnResizeCallback,
  //         );
  //       refs.behaviourColumnResizerEl.current &&
  //         refs.behaviourColumnResizerEl.current.removeEventListener(
  //           'mousedown',
  //           behaviourColumnResizeCallback,
  //         );
  //       refs.backgroundColumnResizerEl.current &&
  //         refs.backgroundColumnResizerEl.current.removeEventListener(
  //           'mousedown',
  //           backgroundColumnResizeCallback,
  //         );
  //     };
  //   }
  // }, [refs.backgroundColumnResizerEl.current, state]);

  const handleSetState = obj => {
    if (obj) {
      Promise.resolve(obj).then(obj => {
        setState(state => ({ ...state, ...obj }));
      });
    }
  };

  const {
    queries,
    keybindings,
    behaviours,
    backgrounds,
    queryColumnWidth,
    keybindingColumnWidth,
    behaviourColumnWidth,
    backgroundColumnWidth,
    dialogOpen,
    values,
  } = state;

  const { queryShortcuts } = props.settings;

  return (
    <div className={classes.rootStyle}>
      <input
        className={classes.searchInputStyle}
        ref={refs.searchQueryShortcutsEl}
        id=""
        type="text"
        placeholder="Type to search query shortcut"
      />
      <div
        className={classes.addShortcutStyle}
        onClick={() => handleSetState(openDialog(null, queryShortcuts))}
      >
        <Icon icon="plus" className={classes.iconStyle} />
      </div>

      <div className={classes.shortcutQueriesListStyle}>
        {queries.length > 0 ? (
          <div
            className={classes.shortcutQueriesStyle}
            style={{ width: `${queryColumnWidth}%` }}
          >
            <div
              className={clsx(
                classes.resizeHandleStyle,
                classes.queriesColumnDividerStyle,
              )}
            ></div>
            {queries.map((query, index) => {
              if (index % 2 === 0) {
                return index === 0 ? (
                  <h2
                    key={`${query}-${index}`}
                    className={clsx(
                      classes.headingStyle,
                      classes.queryColumnHeadingStyle,
                      {
                        [classes.queryShortcutOddStyle]: index % 2 > 0,
                        [classes.queryShortcutEvenStyle]: index % 2 === 0,
                      },
                    )}
                  >
                    {query}
                  </h2>
                ) : (
                  <p
                    key={`${query}-${index}`}
                    className={clsx(classes.queryShortcutStyle, {
                      [classes.queryShortcutOddStyle]: index % 2 > 0,
                      [classes.queryShortcutEvenStyle]: index % 2 === 0,
                    })}
                  >
                    <Icon
                      icon="trash"
                      className={classes.iconStyle}
                      onClick={() =>
                        props.setQueryShortcuts(
                          deleteQueryShorcut(
                            keybindings[index],
                            queryShortcuts,
                          ),
                        )
                      }
                    />
                    <Icon
                      icon="edit"
                      className={clsx(
                        classes.iconStyle,
                        classes.editQueryShortCutIconStyle,
                      )}
                      onClick={() =>
                        handleSetState(
                          openDialog(keybindings[index], queryShortcuts),
                        )
                      }
                    />
                    {query}
                  </p>
                );
              } else {
                return (
                  <p
                    key={`${query}-${index}`}
                    className={clsx(classes.queryShortcutStyle, {
                      [classes.queryShortcutOddStyle]: index % 2 > 0,
                      [classes.queryShortcutEvenStyle]: index % 2 === 0,
                    })}
                  >
                    <Icon
                      icon="trash"
                      className={classes.iconStyle}
                      onClick={() =>
                        props.setQueryShortcuts(
                          deleteQueryShorcut(
                            keybindings[index],
                            queryShortcuts,
                          ),
                        )
                      }
                    />
                    <Icon
                      icon="edit"
                      className={clsx(
                        classes.iconStyle,
                        classes.editQueryShortCutIconStyle,
                      )}
                      onClick={() =>
                        handleSetState(
                          openDialog(keybindings[index], queryShortcuts),
                        )
                      }
                    />
                    {query}
                  </p>
                );
              }
            })}
          </div>
        ) : null}

        {keybindings.length > 0 ? (
          <div
            className={classes.shortcutQueriesStyle}
            style={{ width: `${keybindingColumnWidth}%` }}
          >
            <div
              ref={refs.keybindingColumnResizerEl}
              className={classes.resizeHandleStyle}
            ></div>
            {keybindings.map((keybinding, index) => {
              if (index % 2 === 0) {
                return index === 0 ? (
                  <h2
                    key={`${keybinding}-${index}`}
                    className={clsx(classes.headingStyle, {
                      [classes.queryShortcutOddStyle]: index % 2 > 0,
                      [classes.queryShortcutEvenStyle]: index % 2 === 0,
                    })}
                  >
                    {keybinding}
                  </h2>
                ) : (
                  <p
                    key={`${keybinding}-${index}`}
                    className={clsx(classes.queryShortcutStyle, {
                      [classes.queryShortcutOddStyle]: index % 2 > 0,
                      [classes.queryShortcutEvenStyle]: index % 2 === 0,
                    })}
                  >
                    {parseKeyBinding(keybinding).map(value =>
                      value === ' ' || value === '+' ? (
                        <span className={classes.tagSeparationStyle}>
                          {value}
                        </span>
                      ) : (
                        <Tag className={classes.keybindingStyle} key={index}>
                          {value}
                        </Tag>
                      ),
                    )}
                  </p>
                );
              } else {
                return (
                  <p
                    key={`${keybinding}-${index}`}
                    className={clsx(classes.queryShortcutStyle, {
                      [classes.queryShortcutOddStyle]: index % 2 > 0,
                      [classes.queryShortcutEvenStyle]: index % 2 === 0,
                    })}
                  >
                    {parseKeyBinding(keybinding).map(value =>
                      value === ' ' || value === '+' ? (
                        <span className={classes.tagSeparationStyle}>
                          {value}
                        </span>
                      ) : (
                        <Tag className={classes.keybindingStyle} key={index}>
                          {value}
                        </Tag>
                      ),
                    )}
                  </p>
                );
              }
            })}
          </div>
        ) : null}

        {behaviours.length > 0 ? (
          <div
            className={classes.shortcutQueriesStyle}
            style={{ width: `${behaviourColumnWidth}%` }}
          >
            <div
              ref={refs.behaviourColumnResizerEl}
              className={classes.resizeHandleStyle}
            ></div>
            {behaviours.map((behaviour, index) => {
              if (index % 2 === 0) {
                return index === 0 ? (
                  <h2
                    key={`${behaviour}-${index}`}
                    className={clsx(classes.headingStyle, {
                      [classes.queryShortcutOddStyle]: index % 2 > 0,
                      [classes.queryShortcutEvenStyle]: index % 2 === 0,
                    })}
                  >
                    {behaviour}
                  </h2>
                ) : (
                  <p
                    key={`${behaviour}-${index}`}
                    className={clsx(classes.queryShortcutStyle, {
                      [classes.queryShortcutOddStyle]: index % 2 > 0,
                      [classes.queryShortcutEvenStyle]: index % 2 === 0,
                    })}
                  >
                    {behaviour}
                  </p>
                );
              } else {
                return (
                  <p
                    key={`${behaviour}-${index}`}
                    className={clsx(classes.queryShortcutStyle, {
                      [classes.queryShortcutOddStyle]: index % 2 > 0,
                      [classes.queryShortcutEvenStyle]: index % 2 === 0,
                    })}
                  >
                    {behaviour}
                  </p>
                );
              }
            })}
          </div>
        ) : null}

        {backgrounds.length > 0 ? (
          <div
            className={classes.shortcutQueriesStyle}
            style={{ width: `${backgroundColumnWidth}%` }}
          >
            <div
              ref={refs.backgroundColumnResizerEl}
              className={classes.resizeHandleStyle}
            ></div>
            {backgrounds.map((background, index) => {
              if (index % 2 === 0) {
                return index === 0 ? (
                  <h2
                    key={`${background}-${index}`}
                    className={clsx(classes.headingStyle, {
                      [classes.queryShortcutOddStyle]: index % 2 > 0,
                      [classes.queryShortcutEvenStyle]: index % 2 === 0,
                    })}
                  >
                    {String(background)}
                  </h2>
                ) : (
                  <p
                    key={`${background}-${index}`}
                    className={clsx(classes.queryShortcutStyle, {
                      [classes.queryShortcutOddStyle]: index % 2 > 0,
                      [classes.queryShortcutEvenStyle]: index % 2 === 0,
                    })}
                  >
                    {String(background)}
                  </p>
                );
              } else {
                return (
                  <p
                    key={`${background}-${index}`}
                    className={clsx(classes.queryShortcutStyle, {
                      [classes.queryShortcutOddStyle]: index % 2 > 0,
                      [classes.queryShortcutEvenStyle]: index % 2 === 0,
                    })}
                  >
                    {String(background)}
                  </p>
                );
              }
            })}
          </div>
        ) : null}
      </div>

      <Dialog
        portalClassName={classes.queryShortcutCreationDialogStyle}
        autoFocus={true}
        canEscapeKeyClose={false}
        canOutsideClickClose={true}
        enforceFocus={true}
        isOpen={dialogOpen}
        title="New Query Shortcut"
        isCloseButtonShown={false}
        onClose={() => handleSetState(closeDialog())}
        usePortal={true}
      >
        <div className={classes.queryShortcutCreationDialogContentStyle}>
          <div id="shortcut-dialog-content">
            <h4>Query</h4>
            <input
              id="query"
              type="text"
              placeholder="i.e. workspace"
              defaultValue={values['query']}
              onChange={e => handleSetState(handleOnKeyDown(e, values))}
            />

            <h4>Keybinding</h4>
            {/* <InputGroup */}
            {/* // rightElement={<Icon icon="cross" />} */}
            <div className={classes.keybindingInputContainerStyle}>
              <input
                type="text"
                id="keybinding"
                placeholder="i.e ctrl+i"
                defaultValue={values['keybinding']}
                onKeyDown={e => handleSetState(handleOnKeyDown(e, values))}
              />
              <Icon
                icon="cross"
                onClick={e => handleSetState(clearKeybindingInput(e, values))}
              />
            </div>
            {/* /> */}

            <h4>Behaviour</h4>
            <HTMLSelect
              className={classes.selectInputStyle}
              minimal={true}
              id="behaviour"
              defaultValue={values['behaviour']}
              onChange={e => handleSetState(handleOnKeyDown(e, values))}
            >
              <option value="run as soon as possible">
                Run as soon as possible
              </option>
              <option value="paste to terminal">Paste to terminal</option>
            </HTMLSelect>

            <h4>Background</h4>
            <Switch
              className={classes.switchInputStyle}
              innerLabelChecked="on"
              id="background"
              innerLabel="off"
              defaultChecked={values['background']}
              onChange={e => handleSetState(handleOnKeyDown(e, values))}
            />
          </div>
        </div>
        <Divider className={classes.menuDividerStyle} />
        <div className={classes.submitSectionStyle}>
          <h3 onClick={() => handleSetState(closeDialog())}>Cancel</h3>
          <h3
            className="save"
            onClick={() =>
              handleSetState(
                handleSaveQueryShortcut(values, queryShortcuts, props),
              )
            }
          >
            Save
          </h3>
        </div>
      </Dialog>
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
    setQueryShortcuts: shortcut => {
      return dispatch(settingsActions.setQueryShortcuts(shortcut));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(QueryShortcutsViewer);
