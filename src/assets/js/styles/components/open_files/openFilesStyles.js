const styles = theme => ({
  rootStyle: {
    borderBottom: '1px solid rgba(0,0,0,0.2)',
  },
  titleSectionStyle: {
    display: 'flex',
    alignItems: 'center',
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
  filesSectionStyle: {
    paddingLeft: '1.3em',
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
  fileSectionStyle: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: '0.5em',
  },
  fileNameStyle: {
    maxWidth: '180px',
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
  filesVisible: {
    transition: `mask-position 0.3s, -webkit-mask-position 0.3s,${theme.transitions.create(
      'height',
      {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      },
    )}`,
    height: 'auto',
    maxHeight: '12em',
  },
  filesHidden: {
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
  scrolledStyle: {
    boxShadow: props =>
      `inset 0px 2px 8px 1px ${
        theme.palette.editor.background[
          props.settings.prefersDarkMode ? 'dark' : 'light'
        ]
      }`,
  },
});

export default styles;
