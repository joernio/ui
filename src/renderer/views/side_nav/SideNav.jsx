import React from 'react';
import clsx from 'clsx';
import { connect } from 'react-redux';
import * as settingsActions from '../../store/actions/settingsActions';
import { makeStyles } from '@material-ui/core/styles';
import { Icon, Divider, Switch } from '@blueprintjs/core';
import { Dialog } from '@blueprintjs/core';
import { Tooltip2 } from '@blueprintjs/popover2';
import styles from '../../assets/js/styles/views/side_nav/sideNavStyles';

import {
  toggleSettingsDialog,
  handleDrawerToggle,
  handleTerminalToggle,
  getSettingsInitialValues,
  collectSettingsValues,
  handleOnChange,
  openShortcutsPage,
} from './sideNavScripts';

const useStyles = makeStyles(styles);

function SideNav(props) {
  const classes = useStyles(props);

  const [state, setState] = React.useState({
    anchorEl: null,
    settingsDialogIsOpen: false,
    values: {},
  });

  React.useEffect(() => {
    handleSetState({ values: getSettingsInitialValues(props.settings) });
  }, [props.settings]);

  const handleSetState = obj => {
    if (obj) {
      Promise.resolve(obj).then(obj => {
        setState(state => ({ ...state, ...obj }));
      });
    }
  };

  const { values } = state;

  return (
    <div data-test="side-nav">
      <div className={clsx(classes.rootStyle, 'side-nav')}>
        <div
          className={clsx(classes.topIconsContainerStyle, 'nav-upper-section')}
        >
          <Tooltip2
            popoverClassName={classes.toolTipStyle}
            content={<span className={classes.toolTipTextStyle}>explorer</span>}
            placement="right"
            usePortal={false}
            openOnTargetFocus={false}
          >
            <Icon
              icon="control"
              iconSize={25}
              className={classes.iconStyle}
              onClick={() => props.handleSetState(handleDrawerToggle(props))}
            />
          </Tooltip2>

          <Tooltip2
            popoverClassName={classes.toolTipStyle}
            content={
              <span className={classes.toolTipTextStyle}>query shortcuts</span>
            }
            placement="right"
            usePortal={false}
            openOnTargetFocus={false}
          >
            <Icon
              icon="key-enter"
              iconSize={25}
              className={clsx(classes.iconStyle, classes.shortcutsIconStyle)}
              onClick={openShortcutsPage}
            />
          </Tooltip2>
        </div>

        <Tooltip2
          popoverClassName={classes.toolTipStyle}
          content={<span className={classes.toolTipTextStyle}>terminal</span>}
          placement="right"
          usePortal={false}
          openOnTargetFocus={false}
        >
          <Icon
            icon="console"
            iconSize={25}
            className={classes.iconStyle}
            onClick={() => props.handleSetState(handleTerminalToggle(props))}
          />
        </Tooltip2>

        <Tooltip2
          popoverClassName={classes.toolTipStyle}
          content={<span className={classes.toolTipTextStyle}>settings</span>}
          placement="right"
          usePortal={false}
          openOnTargetFocus={false}
        >
          <Icon
            icon="cog"
            iconSize={25}
            className={classes.iconStyle}
            onClick={() => {
              handleSetState(toggleSettingsDialog(state.isSettingsDialogOpen));
            }}
          />
        </Tooltip2>
      </div>
      <Dialog
        portalClassName={classes.settingsDialogStyle}
        autoFocus={true}
        canEscapeKeyClose={true}
        canOutsideClickClose={true}
        enforceFocus={true}
        isOpen={state.isSettingsDialogOpen}
        title="Settings"
        isCloseButtonShown={false}
        onClose={() =>
          handleSetState(toggleSettingsDialog(state.isSettingsDialogOpen))
        }
        usePortal={true}
      >
        <div className={classes.settingsDialogContentStyle}>
          <div>
            <h3>Server</h3>

            <h4>URL</h4>
            <input
              id="server_url"
              type="text"
              placeholder="http://example.com"
              defaultValue={values['server_url']}
              onChange={e => handleSetState(handleOnChange(e, values))}
              onBlur={e => handleSetState(handleOnChange(e, values))}
            />

            <h4>Username</h4>
            <input
              type="text"
              id="server_username"
              placeholder="auth username here.."
              defaultValue={values['server_username']}
              onChange={e => handleSetState(handleOnChange(e, values))}
              onBlur={e => handleSetState(handleOnChange(e, values))}
            />

            <h4>Password</h4>
            <input
              type="text"
              id="server_password"
              placeholder="auth password here.."
              defaultValue={values['server_password']}
              onChange={e => handleSetState(handleOnChange(e, values))}
              onBlur={e => handleSetState(handleOnChange(e, values))}
            />
          </div>
          <Divider className={classes.menuDividerStyle} />
          <div>
            <h3>Web Socket</h3>
            <h4>URL</h4>
            <input
              type="text"
              id="ws_url"
              placeholder="ws://example.com/connect"
              defaultValue={values['ws_url']}
              onChange={e => handleSetState(handleOnChange(e, values))}
              onBlur={e => handleSetState(handleOnChange(e, values))}
            />
          </div>
          <Divider className={classes.menuDividerStyle} />
          <div>
            <h3>GUI</h3>
            <h4>Dark Theme</h4>
            <Switch
              className={classes.switchStyle}
              innerLabelChecked="on"
              id="prefers_dark_mode"
              innerLabel="off"
              defaultChecked={values['prefers_dark_mode']}
              onChange={e => handleSetState(handleOnChange(e, values))}
              onBlur={e => handleSetState(handleOnChange(e, values))}
            />

            <h4>Prefers Terminal View</h4>
            <Switch
              className={classes.switchStyle}
              innerLabelChecked="on"
              id="prefers_terminal_view"
              innerLabel="off"
              defaultChecked={values['prefers_terminal_view']}
              onChange={e => handleSetState(handleOnChange(e, values))}
              onBlur={e => handleSetState(handleOnChange(e, values))}
            />

            <h4>Font Size</h4>
            <input
              type="number"
              id="font_size"
              defaultValue={values['font_size']}
              onChange={e => handleSetState(handleOnChange(e, values))}
              onBlur={e => handleSetState(handleOnChange(e, values))}
            />

            <h4>Default Scripts Directory</h4>
            <input
              type="text"
              id="scripts_dir"
              placeholder="/home/........"
              defaultValue={values['scripts_dir']}
              onChange={e => handleSetState(handleOnChange(e, values))}
              onBlur={e => handleSetState(handleOnChange(e, values))}
            />

            <h4>CPG UI Ignore</h4>
            <input
              type="text"
              id="ui_ignore"
              placeholder="node_modules, .git, build....."
              defaultValue={values['ui_ignore']}
              onChange={e => handleSetState(handleOnChange(e, values))}
              onBlur={e => handleSetState(handleOnChange(e, values))}
            />
          </div>
        </div>
        <Divider className={classes.menuDividerStyle} />
        <div className={classes.submitSectionStyle}>
          <h3
            onClick={() =>
              handleSetState(toggleSettingsDialog(state.isSettingsDialogOpen))
            }
          >
            Cancel
          </h3>
          <h3
            className="save"
            onClick={() => {
              props.setSettings(collectSettingsValues(values));
              handleSetState(toggleSettingsDialog(state.isSettingsDialogOpen));
            }}
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
    settings: state.settings,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setSettings: values => {
      return dispatch(settingsActions.setSettings(values));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SideNav);
