import React from 'react';
import { connect } from 'react-redux';
import { Dialog } from '@blueprintjs/core';
import * as queryActions from '../../store/actions/queryActions';
import { collectShortcutDialogValues } from './queryShortcutsViewerScripts';

function QueryShortcutsViewer(props) {
  const refs = {
    shortcutDialogEl: React.useRef(null),
  };
  const [state, setState] = React.useState({
    isShortcutDialogOpen: false,
  });

  const handleSetState = obj => {
    if (obj) {
      Promise.resolve(obj).then(obj => {
        setState(state => ({ ...state, ...obj }));
      });
    }
  };

  console.log('QueryShortcutsViewer');

  const { queryShortcuts } = props.query;
  return (
    <div style={{ width: '100%', height: '90%' }}>
      <button
        style={{ width: '100%' }}
        onClick={() => handleSetState({ isShortcutDialogOpen: true })}
      >
        Add shortcut
      </button>
      {Object.keys(queryShortcuts).map(sequence => (
        <div key={sequence} style={{ width: '100%' }}>
          {queryShortcuts[sequence].command +
            '      ' +
            sequence +
            '     ' +
            queryShortcuts[sequence].behaviour +
            '     ' +
            queryShortcuts[sequence].background}
        </div>
      ))}
      <Dialog
        // portalClassName={classes.settingsDialogStyle}
        autoFocus={true}
        canEscapeKeyClose={true}
        canOutsideClickClose={true}
        enforceFocus={true}
        isOpen={state.isShortcutDialogOpen}
        title="New Shortcut"
        isCloseButtonShown={false}
        onClose={() => handleSetState({ isShortcutDialogOpen: false })}
        usePortal={true}
      >
        <div ref={refs.shortcutDialogEl}>
          <input type="text" placeholder="command" />
          <input type="text" placeholder="keybinding" />
          <input type="text" placeholder="behaviour" />
          <input type="checkbox" placeholder="checkbox" />
        </div>
        <h3 onClick={() => handleSetState({ isShortcutDialogOpen: false })}>
          Cancel
        </h3>
        <h3
          className="save"
          onClick={() => {
            props.setQueryShortcut(
              collectShortcutDialogValues(refs.shortcutDialogEl.current),
            );
            handleSetState({ isShortcutDialogOpen: false });
          }}
        >
          Save
        </h3>
      </Dialog>
    </div>
  );
}

const mapStateToProps = state => {
  return {
    query: state.query,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setQueryShortcut: shortcut => {
      return dispatch(queryActions.setQueryShortcut(shortcut));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(QueryShortcutsViewer);
