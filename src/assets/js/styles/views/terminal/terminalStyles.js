const styles = theme => ({
  terminalStyle: {
    width: '100%',
    zIndex: 0,
    backgroundColor: props =>
      props.settings.prefersDarkMode
        ? props.settings.prefersTerminalView
          ? '#000000'
          : theme.palette.explorer.background.dark
        : props.settings.prefersTerminalView
        ? '#ffffff'
        : theme.palette.explorer.background.light,
    borderTop: props =>
      `1px solid ${
        theme.palette.navBar.background[
          props.settings.prefersDarkMode ? 'dark' : 'light'
        ]
      }`,
    borderRight: props =>
      `1px solid ${
        theme.palette.navBar.background[
          props.settings.prefersDarkMode ? 'dark' : 'light'
        ]
      }`,
    borderLeft: props =>
      `1px solid ${
        theme.palette.navBar.background[
          props.settings.prefersDarkMode ? 'dark' : 'light'
        ]
      }`,
    position: 'absolute',
    bottom: 0,
    '& .xterm': {
      display: props => (props.settings.prefersTerminalView ? 'block' : 'none'),
    },
    '& .xterm .xterm-viewport': {
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
  },
  circuitUIStyle: {
    display: props => (props.settings.prefersTerminalView ? 'none' : 'flex'),
    height: '100%',
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    overflow: 'hidden',
    '& #circuit-ui-welcome-screen-container': {
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
      '& h1': {
        color: props =>
          theme.palette.explorer.background[
            props.settings.prefersDarkMode ? 'light' : 'dark'
          ],
        fontWeight: 'bolder',
        fontSize: '5em',
        margin: 0,
      },
      '& p': {
        color: props =>
          theme.palette.explorer.background[
            props.settings.prefersDarkMode ? 'light' : 'dark'
          ],
        fontSize: '1.3rem',
      },
    },
    '& #circuit-ui-results-container': {
      maxHeight: '95%',
      overflowY: 'scroll',
      paddingLeft: '1em',
      flexGrow: 1,
      '& .query': {
        display: 'flex',
        padding: '0.4em',
        backgroundColor: props =>
          theme.palette.navBar.background[
            props.settings.prefersDarkMode ? 'dark' : 'light'
          ],
        display: 'flex',
        alignItems: 'center',
        '& p': {
          width: 'fit-content',
          backgroundColor: props =>
            theme.palette.sideNav.background[
              props.settings.prefersDarkMode ? 'dark' : 'light'
            ],
          color: props =>
            theme.palette.sideNav.hover[
              props.settings.prefersDarkMode ? 'dark' : 'light'
            ],
          padding: '0.1em 0.3em',
          borderRadius: '3px',
          margin: 0,
        },
      },
      '& .response': {
        display: 'flex',
        margin: '0.5em 0',
        color: props =>
          theme.palette.explorer.base[
            props.settings.prefersDarkMode ? 'dark' : 'light'
          ],
        '& .error': {
          backgroundColor: '#c23030',
          color: props =>
            theme.palette.sideNav.hover[
              props.settings.prefersDarkMode ? 'dark' : 'light'
            ],
          padding: '0.1em 0.3em',
          borderRadius: '3px',
          margin: 0,
        },
      },
      '&::-webkit-scrollbar': {
        width: '12px',
      },
      '&::-webkit-scrollbar-track': {
        backgroundColor: props =>
          theme.palette.scrollbar.background[
            props.settings.prefersDarkMode ? 'dark' : 'light'
          ],
      },

      '&::-webkit-scrollbar-corner': {
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
    '& #circuit-ui-input-container': {
      height: '3em',
      minHeight: '3em',
      width: '100%',
      display: 'flex',
      fontFamily: 'monospace',
      '& input': {
        height: '100%',
        width: '88%',
        paddingLeft: '1em',
        border: props =>
          `1px solid ${
            theme.palette.sideNav.base[
              props.settings.prefersDarkMode ? 'dark' : 'light'
            ]
          }`,
        outline: 0,
        backgroundColor: props =>
          theme.palette.sideNav.background[
            props.settings.prefersDarkMode ? 'dark' : 'light'
          ],
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
        '&:focus': {
          color: props =>
            theme.palette.sideNav.hover[
              props.settings.prefersDarkMode ? 'dark' : 'light'
            ],
        },
      },
      '& button': {
        height: '100%',
        width: '12%',
        border: props =>
          `1px solid ${
            theme.palette.sideNav.base[
              props.settings.prefersDarkMode ? 'dark' : 'light'
            ]
          }`,
        borderLeft: 0,
        outline: 0,
        backgroundColor: props =>
          theme.palette.navBar.background[
            props.settings.prefersDarkMode ? 'dark' : 'light'
          ],
        color: props =>
          theme.palette.navBar.base[
            props.settings.prefersDarkMode ? 'dark' : 'light'
          ],
        '&:hover': {
          backgroundColor: props =>
            theme.palette.navBar.hover[
              props.settings.prefersDarkMode ? 'dark' : 'light'
            ],
        },
      },
      '& #suggestion-box-tracker': {
        position: 'absolute',
        visibility: 'hidden',
      },
    },
  },
  querySelectionTooltipStyle: {
    position: 'absolute',
  },
  querySelectionToolTipPortalStyle: {
    '& > div > div:nth-child(1)': {
      display: 'none',
    },
  },
  querySuggestionsStyle: {
    backgroundColor: props =>
      theme.palette.navBar.background[
        props.settings.prefersDarkMode ? 'dark' : 'light'
      ],
    color: props =>
      theme.palette.navBar.base[
        props.settings.prefersDarkMode ? 'dark' : 'light'
      ],
    padding: '0.4em',
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
  querySuggestionStyle: {
    display: 'flex',
    width: '100%',
    padding: '0.5em',
    justifyContent: 'space-between',
    cursor: 'pointer',
    '&:hover': {
      color: props =>
        theme.palette.sideNav.hover[
          props.settings.prefersDarkMode ? 'dark' : 'light'
        ],
    },
  },
  terminalOpen: {
    transition: theme.transitions.create('height', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    height: props => props.terminalHeight,
  },
  terminalClose: {
    transition: theme.transitions.create('height', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    height: 0,
    visibility: 'hidden',
  },
  terminalControlContainerStyle: {
    backgroundColor: props =>
      props.settings.prefersDarkMode
        ? props.settings.prefersTerminalView
          ? '#000000'
          : theme.palette.explorer.background.dark
        : props.settings.prefersTerminalView
        ? '#ffffff'
        : theme.palette.explorer.background.light,
    zIndex: 5,
    width: '100%',
    height: '2em',
    paddingTop: '0.5em',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
  },
  terminalControlItemsStyle: {
    color: props =>
      props.settings.prefersDarkMode
        ? props.settings.prefersTerminalView
          ? '#ffffff'
          : theme.palette.explorer.base.dark
        : props.settings.prefersTerminalView
        ? '#000000'
        : theme.palette.explorer.base.light,
    marginRight: '1.5em',
    zIndex: 4,
    cursor: 'pointer',
  },
  resizeHandleStyle: {
    position: 'absolute',
    height: '5px',
    width: '100%',
    cursor: 'row-resize',
    top: '-5px',
    backgroundColor: 'transparent',
    '&:hover': {
      backgroundColor: props =>
        props.settings.prefersDarkMode
          ? 'rgba(255, 255, 255, 0.5)'
          : 'rgba(0,0,0,0.5)',
    },
  },
});

export default styles;
