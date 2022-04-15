import { openSyntheticFile } from '../../assets/js/utils/scripts';
/**
 * toggle settings dialog
 * @param {*} isSettingsDialogOpen
 * @returns
 */
export const toggleSettingsDialog = isSettingsDialogOpen => {
  console.log('toggleSettingsDialog: ', isSettingsDialogOpen);
  return {
    isSettingsDialogOpen: !isSettingsDialogOpen,
  };
};

/**
 * Function to toggles the explorer section visible or invisible
 * @param {*} props
 * @returns 0 if drawerWidth is true, otherwise 250px
 */
export const handleDrawerToggle = props => {
  console.log('handleDrawerToggle: ', props);
  return { drawerWidth: props.drawerWidth ? 0 : '250px' };
};

/**
 * Function to toggle terminal visible or invisible
 * @param {Object} props
 * @returns the height of the terminal
 */
export const handleTerminalToggle = props => {
  console.log('handleTerminalToggle: ', props);
  const terminalHeight = props.terminalHeight ? 0 : '468px';
  return { terminalHeight };
};

/**
 * handle onchange
 * @param {*} e
 * @param {*} values
 * @returns
 */
export const handleOnChange = (e, values) => {
  console.log('handleOnChange: ', { e, values });
  if (
    e.target.id === 'prefers_dark_mode' ||
    e.target.id === 'prefers_terminal_view'
  ) {
    values[e.target.id] = e.target.checked;
  } else {
    values[e.target.id] = e.target.value;
  }
  return { values };
};

/**
 * function to initiallize the app default settings.
 * @param {Object} settings This has the values required for the app startup
 * e.g server connections parameters, websocket url, script directory, default theme etc.
 * @returns the initial settings
 */

export const getSettingsInitialValues = settings => {
  console.log('getSettingsInitialValues: ', settings);
  const initialSettings = {};

  initialSettings['server_url'] = settings?.server?.url;
  initialSettings['server_username'] = settings?.server?.auth_username;
  initialSettings['server_password'] = settings?.server?.auth_password;

  initialSettings['ws_url'] = settings?.websocket?.url;

  initialSettings['prefers_dark_mode'] = settings?.prefersDarkMode;
  initialSettings['prefers_terminal_view'] = settings?.prefersTerminalView;
  initialSettings['font_size'] = Number(settings?.fontSize.split('px')[0]);
  initialSettings['scripts_dir'] = settings?.scriptsDir;
  initialSettings['ui_ignore'] = settings?.uiIgnore;

  return initialSettings;
};

/**
 * collect settings values
 * @param {*} values
 * @returns
 */
export const collectSettingsValues = values => {
  console.log('collectSettingsValues: ', values);
  const settings = {
    server: {
      url: values['server_url'],
      auth_username: values['server_username'],
      auth_password: values['server_password'],
    },
    websocket: {
      url: values['ws_url'],
    },
    prefersDarkMode: values['prefers_dark_mode'],
    prefersTerminalView: values['prefers_terminal_view'],
    fontSize: `${values['font_size']}px`,
    scriptsDir: values['scripts_dir'],
    uiIgnore: values['ui_ignore'],
  };

  return settings;
};

/**
 * Function to open the query shortcut page
 */
export const openShortcutsPage = () => {
  console.log('openShortcutsPage: =>');
  openSyntheticFile('Query Shortcuts', 'Query Shortcuts');
};
