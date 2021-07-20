const styles = theme => ({
  rootStyle: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: props =>
      theme.palette.sideNav.background[
        props.settings.prefersDarkMode ? 'dark' : 'light'
      ],
    width: props => props.sideNavWidth,
    '& ul': {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
    },
    '& :nth-child(1)': {
      flexGrow: 1,
    },
    '& .bp3-overlay': {
      '& .bp3-tooltip2': {
        '& .bp3-popover2-content': {
          backgroundColor: theme.palette.explorer.background.light,
        },
        '& .bp3-popover2-arrow-fill': {
          fill: theme.palette.explorer.background.light,
        },
      },
    },
  },
  settingsDialogStyle: {
    '& > div > div:nth-child(1)': {
      backgroundColor: 'rgba(0, 0, 0, 0)',
    },
    '& > div > div:nth-child(2)': {
      alignItems: 'normal',
      minHeight: 'fit-content',
      '&:focus': {
        outline: 'none',
        border: 'none',
      },
      '& > div': {
        paddingBottom: 0,
        backgroundColor: 'white',
      },
    },
  },
  settingsDialogContentStyle: {
    margin: ' 1em',
    '& div': {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      '& h3': {
        width: '100%',
      },
      '& h4': {
        width: '50%',
        color: theme.palette.sideNav.base.light,
      },
      '& input': {
        height: '2.5em',
        width: '50%',
      },
    },
  },
  switchStyle: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 0,
    '& > span': {
      outline: 'none !important',
    },
  },
  submitSectionStyle: {
    display: 'flex',
    justifyContent: 'center',
    margin: '0.5em',
    cursor: 'pointer',
    '& h3': {
      margin: '0.5em 0 0.5em 0',
    },
    '&:hover': {
      backgroundColor: theme.palette.navBar.hover.light,
    },
  },
  toolTipTextStyle: {
    backgroundColor: theme.palette.explorer.background.light,
    color: theme.palette.explorer.base.light,
  },
  iconStyle: {
    color: props =>
      theme.palette.sideNav.base[
        props.settings.prefersDarkMode ? 'dark' : 'light'
      ],
    '&:hover': {
      color: props =>
        theme.palette.sideNav.hover[
          props.settings.prefersDarkMode ? 'dark' : 'light'
        ],
    },
    margin: '1em 0',
  },
});

export default styles;
