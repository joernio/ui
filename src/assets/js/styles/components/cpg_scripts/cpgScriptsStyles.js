const styles = theme => ({
  rootStyle: {
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
  tagNameStyle: {
    textTransform: 'uppercase',
    fontSize: '0.8rem',
    marginTop: '0.3em',
    marginBottom: '0.3em',
    cursor: 'pointer',
    color: props =>
      theme.palette.explorer.base[
        props.settings.prefersDarkMode ? 'dark' : 'light'
      ],
  },
  scriptsSectionStyle: {
    paddingLeft: '1.3em',
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
  scriptsVisible: {
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
  scriptsHidden: {
    transition: theme.transitions.create('height', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    height: 0,
  },

  scriptsArgsDialogStyle: {
    '& > div > div:nth-child(1)': {
      backgroundColor: 'rgba(0, 0, 0, 0)',
    },
    '& > div > div.bp3-dialog-container': {
      alignItems: 'normal',
      minHeight: 'fit-content',
      '&:focus': {
        outline: 'none',
        border: 'none',
      },
      '& > div': {
        paddingBottom: 0,
        backgroundColor: props =>
          theme.palette.menu.background[
            props.settings.prefersDarkMode ? 'dark' : 'light'
          ],
        borderRadius: 0,
        '& > div:nth-child(1)': {
          borderRadius: 0,
          backgroundColor: props =>
            theme.palette.menu.background[
              props.settings.prefersDarkMode ? 'dark' : 'light'
            ],
          color: theme.palette.sideNav.base.light,
          margin: '1em',
          padding: 0,
          minHeight: 0,
          '& h4': {
            color: props =>
              props.settings.prefersDarkMode ? '#FFFFFF' : '#000000',
            outline: props =>
              `1px solid ${
                theme.palette.menu.background[
                  props.settings.prefersDarkMode ? 'dark' : 'light'
                ]
              }`,
            borderBottom: props =>
              `1px solid ${
                theme.palette.menu.base[
                  props.settings.prefersDarkMode ? 'dark' : 'light'
                ]
              }50`,
            paddingBottom: '0.8em',
          },
        },
      },
    },
  },
  scriptsArgsDialogContentStyle: {
    margin: ' 1em',
    backgroundColor: props =>
      theme.palette.menu.background[
        props.settings.prefersDarkMode ? 'dark' : 'light'
      ],
    '& div': {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      '& h3': {
        width: '100%',
        margin: '0.6em 0',
        color: theme.palette.sideNav.base.light,
      },
      '& h4': {
        width: '50%',
        margin: '0.6em 0',
        borderBottom: 0,
        color: theme.palette.sideNav.base.light,
      },
      '& input': {
        height: '2em',
        width: '50%',
        border: props =>
          `1px solid rgba(206, 206, 206, ${
            props.settings.prefersDarkMode ? '0' : '1'
          })`,
        backgroundColor: props =>
          `rgba(60, 60, 60, ${props.settings.prefersDarkMode ? '1' : '0'})`,
        color: props =>
          props.settings.prefersDarkMode ? '#C3CCCC' : '#616161',
        '&:focus': {
          outline: '0',
          border: props =>
            `1px solid ${
              theme.palette.menu.hover[
                props.settings.prefersDarkMode ? 'dark' : 'light'
              ]
            }`,
        },
        '&:disabled': {
          backgroundColor: props =>
            `rgba(60, 60, 60, ${
              props.settings.prefersDarkMode ? '0.5' : '0.05'
            })`,
        },
      },
    },
  },
  runSectionStyle: {
    display: 'flex',
    justifyContent: 'flex-end',
    paddingBottom: '0.2em',
    '& h3': {
      color: props =>
        theme.palette.button.base[
          props.settings.prefersDarkMode ? 'dark' : 'light'
        ],
      backgroundColor: props =>
        theme.palette.navBar.hover[
          props.settings.prefersDarkMode ? 'dark' : 'light'
        ],
      cursor: 'pointer',
      margin: '0.3em',
      padding: '0.5em 0.8em',
    },
    '& h3.run': {
      margin: '0.3em 1em',
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
  dangerStyle: {
    color: theme.palette.error.main,
    '& svg': {
      fill: theme.palette.error.main,
    },
  },
});

export default styles;
