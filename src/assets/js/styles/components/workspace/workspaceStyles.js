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
  },
  titleStyle: {
    flexGrow: 1,
    textTransform: 'uppercase',
    fontWeight: 'bold',
    fontSize: '0.8rem',
    marginTop: '0.3em',
    marginBottom: '0.3em',
    cursor: 'pointer',
    color: props =>
      theme.palette.explorer.base[
        props.settings.prefersDarkMode ? 'dark' : 'light'
      ],
  },
  emptyWorkspaceElementStyle: {
    fontSize: '1rem',
    color: theme.palette.button.base.dark,
    backgroundColor: props =>
      theme.palette.button.background[
        props.settings.prefersDarkMode ? 'dark' : 'light'
      ],
    '&:hover': {
      backgroundColor: props =>
        theme.palette.button.hover[
          props.settings.prefersDarkMode ? 'dark' : 'light'
        ],
    },
    cursor: 'pointer',
    margin: '0.3em 0.3em 0.3em 0.3em',
    padding: '0.5em 0.5em 0.5em 0.7em',
  },
  menuStyle: {
    backgroundColor: props =>
      theme.palette.menu.background[
        props.settings.prefersDarkMode ? 'dark' : 'light'
      ],
    borderRadius: 0,
  },
  menuItemStyle: {
    borderRadius: 0,
    color: props =>
      theme.palette.menu.base[
        props.settings.prefersDarkMode ? 'dark' : 'light'
      ],
    '& span': {
      color: props =>
        `${
          theme.palette.menu.base[
            props.settings.prefersDarkMode ? 'dark' : 'light'
          ]
        } !important`,
    },
    '&:hover': {
      backgroundColor: props =>
        theme.palette.menu.hover[
          props.settings.prefersDarkMode ? 'dark' : 'light'
        ],
      color: '#FFFFFF',
      '& span': {
        color: '#FFFFFF !important',
      },
    },
  },
  menuDividerStyle: {
    borderTop: props =>
      `1px solid ${
        theme.palette.menu.base[
          props.settings.prefersDarkMode ? 'dark' : 'light'
        ]
      }50`,
  },
  projectsSectionStyle: {
    marginLeft: '1.3em',
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
    },

    '&::-webkit-scrollbar-thumb:hover': {
      backgroundColor: props =>
        theme.palette.scrollbar.hover[
          props.settings.prefersDarkMode ? 'dark' : 'light'
        ],
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
    cursor: 'pointer',
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
  verticalMoreStyle: {
    transform: 'rotate(90deg)',
    marginRight: '1.3em',
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
