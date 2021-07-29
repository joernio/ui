const styles = theme => ({
  queriesStatsPopoverStyles: {
    height: '100%',
  },
  queriesStatsPopoverContentContainerStyle: {
    backgroundColor: props =>
      theme.palette.navBar.background[
        props.settings.prefersDarkMode ? 'dark' : 'light'
      ],
    color: props =>
      theme.palette.navBar.base[
        props.settings.prefersDarkMode ? 'dark' : 'light'
      ],
    padding: '0.4em',
    width: '300px',
    maxHeight: '50vh',
    overflowY: 'scroll',

    '&::-webkit-scrollbar': {
      width: '12px',
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: props =>
        theme.palette.scrollbar.background[
          props.settings.prefersDarkMode ? 'dark' : 'light'
        ],
    },

    '&::-webkit-scrollbar-thumb': {
      backgroundColor: props =>
        theme.palette.scrollbar.background[
          props.settings.prefersDarkMode ? 'dark' : 'light'
        ],
    },

    '&:hover::-webkit-scrollbar-thumb': {
      backgroundColor: props =>
        theme.palette.scrollbar.base[
          props.settings.prefersDarkMode ? 'dark' : 'light'
        ],
      transition: theme.transitions.create('background-color', {
        easing: theme.transitions.easing.linear,
        duration: 1000,
      }),
    },

    '&::-webkit-scrollbar-thumb:hover': {
      backgroundColor: props =>
        theme.palette.scrollbar.hover[
          props.settings.prefersDarkMode ? 'dark' : 'light'
        ],
    },
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
  queriesStatsQueryContainerStyle: {
    display: 'flex',
    width: '100%',
    padding: '0.5em',
    justifyContent: 'space-between',
    '& > div:nth-child(1)': {
      display: 'flex',
      width: '170px',
      justifyContent: 'space-between',
    },
  },
  toolTipStyle: {
    '& .bp3-popover2-content': {
      backgroundColor: props =>
        theme.palette.navBar.background[
          props.settings.prefersDarkMode ? 'dark' : 'light'
        ],
    },
    '& .bp3-popover2-arrow-fill': {
      fill: props =>
        theme.palette.navBar.background[
          props.settings.prefersDarkMode ? 'dark' : 'light'
        ],
    },
  },
  toolTipTextStyle: {
    backgroundColor: props =>
      theme.palette.navBar.background[
        props.settings.prefersDarkMode ? 'dark' : 'light'
      ],
    color: props =>
      theme.palette.navBar.base[
        props.settings.prefersDarkMode ? 'dark' : 'light'
      ],
  },
  queriesStatsQueryPreviewStyle: {
    maxWidth: '100px',
    overflow: 'hidden',
    marginRight: '1em',
    display: '-webkit-box',
    WebkitLineClamp: 1,
    WebkitBoxOrient: 'vertical',
  },

  queriesStatsQueryStatusCompletedStyle: {
    color: '#62bd19',
  },
  queriesStatsQueryStatusPendingStyle: {
    color: 'grey',
  },
  refreshIconContainerStyle: {
    position: 'relative',
    height: '16px',
    width: '16px',
    margin: '0 0.5em 0 1em',
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
