export const handleSettingsClick = (e, state) => {
  return {
    anchorEl: e.currentTarget,
    popperOpen: !state.popperOpen,
  };
};

export const handleDrawerToggle = props => {
  return { drawerOpen: !props.drawerOpen };
};

export const handleTerminalToggle = props => {
  return { terminalOpen: !props.terminalOpen };
};
