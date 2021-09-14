const styles = theme => ({
  rootStyle: {
    borderTop: props =>
      `1px solid rgba${
        props.settings.prefersDarkMode ? '(255,255,255,0.2)' : '(0,0,0,0.2)'
      }`,
    overflowY: 'hidden',
    display: 'flex',
    flexDirection: 'column',
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

  titleSectionStyle: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'context-menu',
  },
  titleStyle: {
    flexGrow: 1,
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
  foldersSectionStyle: {
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
  scrolledStyle: {
    boxShadow: props =>
      `inset 0px 2px 8px 1px ${
        theme.palette.editor.background[
          props.settings.prefersDarkMode ? 'dark' : 'light'
        ]
      }`,
  },
  verticalMoreStyle: {
    transform: 'rotate(90deg)',
    marginRight: '1.3em',
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
  foldersVisible: {
    transition: `mask-position 0.3s, -webkit-mask-position 0.3s,${theme.transitions.create(
      'height',
      {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      },
    )}`,
    height: 'auto',
    maxHeight: '100%',
  },
  foldersHidden: {
    transition: theme.transitions.create('height', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    height: 0,
  },
});

export default styles;
