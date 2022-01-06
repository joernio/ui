const styles = theme => ({
  rootStyle: {
    borderTop: props =>
      `1px solid rgba${
        props.settings.prefersDarkMode ? '(255,255,255,0.2)' : '(0,0,0,0.2)'
      }`,
    borderBottom: props =>
      `1px solid rgba${
        props.settings.prefersDarkMode ? '(0,0,0,0.2)' : '(255,255,255,0.2)'
      }`,
    '&:focus': {
      border: '1px solid #0090F1',
      outline: 'none',
    },
  },
  titleSectionStyle: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
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
  },
  fileSectionStyle: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: '0.5em',
    cursor: 'pointer',
    '& > .unsaved-cross-icon': {
      display: 'none',
    },
    '& > .unsaved-icon': {
      display: 'block',
    },
    '&:hover': {
      '& > .unsaved-cross-icon': {
        display: 'block',
      },
      '& > .unsaved-icon': {
        display: 'none',
      },
      backgroundColor: props =>
        theme.palette.explorer.hover[
          props.settings.prefersDarkMode ? 'dark' : 'light'
        ],
    },
    '&:focus': {
      backgroundColor: '#0090F150',
      border: '1px solid #0090F1',
      outline: 'none',
    },
  },
  fileNameStyle: {
    flexGrow: 1,
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
