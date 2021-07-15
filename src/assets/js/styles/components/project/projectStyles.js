const styles = theme => ({
    projectSectionStyle: {
      cursor: 'context-menu',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingRight: '0.5em',
    },
    projectNameStyle: {
      color: props =>
        theme.palette.explorer.base[
          props.settings.prefersDarkMode ? 'dark' : 'light'
        ],
      textOverflow: 'ellipsis',
      maxWidth: '180px',
      overflow: 'hidden',
      fontSize: '0.9rem',
      fontWeight: 400,
      marginTop: '0.2em',
      marginBottom: '0.2em',
    },
    contextMenuItemStyle: {
      textTransform: 'capitalize',
      backgroundColor: 'rgba(0,0,0,0)',
      paddingRight: '12px',
      paddingLeft: '12px',
      '&:hover': {
        backgroundColor: theme.palette.action.hover,
      },
      '& svg': {
        marginRight: '0.5em',
      },
    },
    iconStyle: {
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
    dangerStyle: {
      color: theme.palette.error.main,
      '& svg': {
        fill: theme.palette.error.main,
      },
    },
  });

export default styles;