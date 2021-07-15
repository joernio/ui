const styles = theme => ({
    root: {
      display: 'flex',
      height: '100%',
      overflow: 'hidden',
      flexDirection: 'column',
    },
    drawerOpen: {
      backgroundColor: props =>
        theme.palette.explorer.background[
          props.settings.prefersDarkMode ? 'dark' : 'light'
        ],
      width: props => props.drawerWidth,
    },
    drawerClose: {
      backgroundColor: props =>
        theme.palette.explorer.background[
          props.settings.prefersDarkMode ? 'dark' : 'light'
        ],
      overflowX: 'hidden',
      width: 0,
    },
    refreshIconStyle: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      color: props =>
        theme.palette.sideNav.base[
          props.settings.prefersDarkMode ? 'dark' : 'light'
        ],
      '&:hover': {
        color: props =>
          props.settings.prefersDarkMode
            ? theme.palette.sideNav.hover.dark
            : theme.palette.sideNav.background.light,
      },
    },
    resizeHandleStyle: {
      position: 'absolute',
      height: '100%',
      width: '5px',
      cursor: 'col-resize',
      right: '-5px',
      backgroundColor: 'transparent',
      '&:hover': {
        backgroundColor: props =>
          props.settings.prefersDarkMode
            ? 'rgba(255, 255, 255, 0.5)'
            : 'rgba(0,0,0,0.5)',
      },
    },
    titleStyle: {
      textTransform: 'uppercase',
      margin: '0.7em 0 0.9em 1.3em',
      fontSize: '0.8rem',
      fontWeight: 400,
      color: props =>
        theme.palette.explorer.base[
          props.settings.prefersDarkMode ? 'dark' : 'light'
        ],
    },
    drawerPaddingLeft: {
      paddingLeft: '3.3em',
    },
  });

export default styles;