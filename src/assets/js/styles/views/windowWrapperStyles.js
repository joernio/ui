const styles = theme => ({
  titleBarStyle: {
    width: '100vw',
    height: '35px',
    backgroundColor: props =>
      theme.palette.navBar.background[
        props.settings.prefersDarkMode ? 'dark' : 'light'
      ],
    display: 'flex',
    alignItems: 'center',
  },
  titleBarRightStyle: {
    flexGrow: 1,
    display: 'flex',
  },
  statusBarStyle: {
    height: '28px',
    width: '100%',
    display: 'flex',
    backgroundColor: props =>
      theme.palette.navBar.background[
        props.settings.prefersDarkMode ? 'dark' : 'light'
      ],
    color: props =>
      theme.palette.navBar.base[
        props.settings.prefersDarkMode ? 'dark' : 'light'
      ],
  },
  statusBarRightStyle: {
    height: '100%',
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
  },
  queriesStatsSectionStyle: {
    display: 'flex',
    alignItems: 'center',
    height: '100%',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: props =>
        theme.palette.navBar.hover[
          props.settings.prefersDarkMode ? 'dark' : 'light'
        ],
    },
  },
  refreshIconContainerStyle: {
    position: 'relative',
    height: '16px',
    width: '16px',
    margin: '0 0.5em 0 1em',
  },
  controlButtonStyle: {
    color: props =>
      theme.palette.navBar.base[
        props.settings.prefersDarkMode ? 'dark' : 'light'
      ],
    fontSize: '1em',
    display: 'flex',
    width: '3em',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    border: 'none',
    cursor: 'pointer',
    backgroundColor: 'rgba(0,0,0,0)',
    '&:focus': {
      outline: 'none',
    },
    '&:hover': {
      backgroundColor: props =>
        theme.palette.navBar.hover[
          props.settings.prefersDarkMode ? 'dark' : 'light'
        ],
    },
    '&.close:hover': {
      backgroundColor: theme.palette.secondary.light,
    },
  },
  navItemStyle: {
    height: '2.5em',
  },
  toolNameContainerStyle: {
    display: 'flex',
    flexGrow: 1,
    justifyContent: 'center',
    '& h1': {
      fontSize: '1em',
      color: props =>
        theme.palette.navBar.base[
          props.settings.prefersDarkMode ? 'dark' : 'light'
        ],
    },
  },
  windowActionIconStyle: {
    fill: props =>
      theme.palette.navBar.base[
        props.settings.prefersDarkMode ? 'dark' : 'light'
      ],
    width: '0.6em',
    height: '0.6em',
  },
  connectionStatusStyle: {
    height: '100%',
    width: 'fit-content',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    cursor: 'context-menu',
    padding: '0 1em',
    '&:hover': {
      backgroundColor: props =>
        theme.palette.navBar.hover[
          props.settings.prefersDarkMode ? 'dark' : 'light'
        ],
    },
    '& h3': {
      marginRight: '1em',
    },
  },
  conStatContextContentStyle: {
    padding: '0.5em',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: theme.palette.navBar.hover.light,
    },
  },
  refreshIconStyle: {
    position: 'absolute',
    left: '2',
  },
  queriesStatsStyle: {
    margin: 'auto 0.5em auto 0',
  },
  hiddenStyle: {
    display: 'none',
    width: 0,
    height: 0,
  },
});

export default styles;
