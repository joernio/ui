const styles = theme => ({
  rootStyle: {
    borderBottom: '1px solid rgba(0,0,0,0.2)',
    borderTop: '1px solid rgba(255,255,255,0.2)',
  },
  titleSectionStyle: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'context-menu',
  },
  titleStyle: {
    textTransform: 'uppercase',
    fontWeight: 'bold',
    fontSize: '0.8rem',
    marginTop: '0.3em',
    marginBottom: '0.3em',
    color: props =>
      theme.palette.explorer.base[
        props.settings.prefersDarkMode ? 'dark' : 'light'
      ],
  },
  emptyWorkspaceElementStyles: {
    fontSize: '1rem',
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
    cursor: 'pointer',
    margin: '1em 0 1em 1em',
  },
  projectsSectionStyle: {
    marginLeft: '1.3em',
    overflowY: 'scroll',
    maskImage:
      'linear-gradient(to top, transparent, black), linear-gradient(to left, transparent 17px, black 17px)',
    maskSize: '100% 20000px',
    maskPosition: 'left bottom',
    WebkitMaskImage:
      'linear-gradient(to top, transparent, black), linear-gradient(to left, transparent 17px, black 17px)',
    WebkitMaskSize: '100% 20000px',
    WebkitMaskPosition: 'left bottom',
    '&:hover': {
      WebkitMaskPosition: 'left top',
    },
  },
  projectsVisible: {
    transition: theme.transitions.create('height', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    height: 'auto',
    maxHeight: '12em',
  },
  projectsHidden: {
    transition: theme.transitions.create('height', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    height: 0,
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
  refreshIconStyle: {
    position: 'absolute',
    right: '20px',
  },
  scrolledStyle: {
    boxShadow: props =>
      `inset 0px 2px 8px 1px ${
        theme.palette.editor.background[
          props.settings.prefersDarkMode ? 'dark' : 'light'
        ]
      }`,
  },
  warningStyle: {
    color: theme.palette.warning.main,
    '& svg': {
      fill: theme.palette.warning.main,
    },
  },
  hidden: {
    display: 'none',
    width: 0,
    height: 0,
  },
});

export default styles;
