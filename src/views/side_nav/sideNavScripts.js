export const toggleSettingsDialog = isSettingsDialogOpen => {
  return {
    isSettingsDialogOpen: !isSettingsDialogOpen,
  };
};

export const handleDrawerToggle = props => {
  return { drawerWidth: props.drawerWidth ? 0 : '250px' };
};

export const handleTerminalToggle = props => {
  const terminalHeight = props.terminalHeight ? 0 : '468px';
  return { terminalHeight };
};

export const handleOnChange = (e, values) => {
  if (e.target.id === 'prefers_dark_mode' ||
      e.target.id === 'prefers_terminal_view') {
    values[e.target.id] = e.target.checked;
  } else {
    values[e.target.id] = e.target.value;
  }
  return {values};
};

export const getSettingsInitialValues = settings => {
  const initialSettings = {};

  initialSettings['server_url'] = settings?.server?.url;
  initialSettings['server_username'] = settings?.server?.auth_username;
  initialSettings['server_password'] = settings?.server?.auth_password;

  initialSettings['ws_url'] = settings?.websocket?.url;

  initialSettings['prefers_dark_mode'] = settings?.prefersDarkMode;
  initialSettings['prefers_terminal_view'] = settings?.prefersTerminalView;
  initialSettings['font_size'] = Number(settings?.fontSize.split("px")[0]);

  return initialSettings;
};

export const collectSettingsValues = values => {
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
  };

  return settings;
};
