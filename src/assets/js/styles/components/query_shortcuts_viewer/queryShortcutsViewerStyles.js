const styles = theme => ({
  rootStyle: {
    width: '100%',
    height: '90%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: props =>
      theme.palette.editor.background[
        props.settings.prefersDarkMode ? 'dark' : 'light'
      ],
  },
  searchInputStyle: {
    height: '2em',
    width: '98%',
    margin: '0.5em auto',
    border: props =>
      `1px solid rgba(206, 206, 206, ${
        props.settings.prefersDarkMode ? '0' : '1'
      })`,
    backgroundColor: props =>
      `rgba(60, 60, 60, ${props.settings.prefersDarkMode ? '1' : '0'})`,
    color: props => (props.settings.prefersDarkMode ? '#C3CCCC' : '#616161'),
    '&:focus': {
      outline: '0',
      border: props =>
        `1px solid ${
          theme.palette.menu.hover[
            props.settings.prefersDarkMode ? 'dark' : 'light'
          ]
        }`,
    },
  },
  addShortcutStyle: {
    fontSize: '1rem',
    height: '2em',
    width: '98%',
    margin: '0 auto 0.5em auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
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
    '& span': {
      color: theme.palette.button.base.dark,
    },
    cursor: 'pointer',
    // margin: '0.3em 0.3em 0.3em 0.3em',
    // padding: '0.5em 0.5em 0.5em 0.7em',
  },

  shortcutQueriesListStyle: {
    width: '98%',
    height: '100%',
    margin: '0.5em auto',
    display: 'flex',
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
  shortcutQueriesStyle: {
    height: '100%',
    position: 'relative',
    minWidth: '100px',
    overflow: 'hidden',
  },
  headingStyle: {
    fontSize: '1.2rem',
    height: '2em',
    display: 'flex',
    alignItems: 'center',
    margin: 0,
    padding: '0 0.5em',
    backgroundColor: props =>
      theme.palette.explorer.background[
        props.settings.prefersDarkMode ? 'dark' : 'light'
      ],
  },
  queryColumnHeadingStyle: {
    paddingLeft: '4em',
  },
  resizeHandleStyle: {
    position: 'absolute',
    height: '95%',
    width: '5px',
    cursor: 'col-resize',
    // right: '-5px',
    left: 0,
    borderLeftWidth: '2px',
    '&:hover': {
      borderLeft: props =>
        props.settings.prefersDarkMode
          ? 'solid rgba(255, 255, 255, 0.5)'
          : 'solid rgba(0,0,0,0.5)',
    },
  },
  queriesColumnDividerStyle: {
    left: '3.5em',
  },
  queryShortcutOddStyle: {
    backgroundColor: 'transparent',
    color: props =>
      theme.palette.editor.base[
        props.settings.prefersDarkMode ? 'dark' : 'light'
      ],
  },
  queryShortcutEvenStyle: {
    backgroundColor: props =>
      theme.palette.explorer.background[
        props.settings.prefersDarkMode ? 'dark' : 'light'
      ],
    color: props =>
      theme.palette.editor.base[
        props.settings.prefersDarkMode ? 'dark' : 'light'
      ],
  },
  // iconStyle: {
  //     color: props =>
  //       props.settings.prefersDarkMode
  //         ? theme.palette.sideNav.hover.dark
  //         : theme.palette.sideNav.background.light
  // },
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
  editQueryShortCutIconStyle: {
    margin: '0 1em 0 0.5em',
  },
  tagSeparationStyle: {
    margin: '0 0.4em',
  },
  queryShortcutStyle: {
    marginBottom: 0,
    paddingLeft: '0.5em',
    height: '2em',
    display: 'flex',
    alignItems: 'center',
  },
  queryShortcutDialogStyle: {
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
  queryShortcutDialogContentStyle: {
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
  keybindingInputContainerStyle: {
    width: '50%',
    position: 'relative',
    backgroundColor: props =>
      `rgba(60, 60, 60, ${props.settings.prefersDarkMode ? '1' : '0'})`,
    border: props =>
      `1px solid rgba(206, 206, 206, ${
        props.settings.prefersDarkMode ? '0' : '1'
      })`,
    '& input': {
      width: '85%!important',
      border: 'transparent!important',
      '&:focus': {
        outline: '0',
        border: props =>
          `1px solid ${
            theme.palette.menu.hover[
              props.settings.prefersDarkMode ? 'dark' : 'light'
            ]
          }`,
      },
    },
    '& span': {
      position: 'absolute',
      right: '0.5em',
      cursor: 'pointer',
      color: props =>
        theme.palette.sideNav.base[
          props.settings.prefersDarkMode ? 'dark' : 'light'
        ],
      '&:hover': {
        color: props =>
          theme.palette.editor.base[
            props.settings.prefersDarkMode ? 'dark' : 'light'
          ],
      },
    },
  },
  selectInputStyle: {
    height: '2em',
    width: '50%',
    border: props =>
      `1px solid rgba(206, 206, 206, ${
        props.settings.prefersDarkMode ? '0' : '1'
      })`,
    backgroundColor: props =>
      `rgba(60, 60, 60, ${props.settings.prefersDarkMode ? '1' : '0'})`,
    '& select': {
      backgroundColor: props =>
        `rgba(60, 60, 60, ${props.settings.prefersDarkMode ? '1' : '0'})`,
      color: props => (props.settings.prefersDarkMode ? '#C3CCCC' : '#616161'),
      '&:focus': {
        outline: '0',
        border: props =>
          `1px solid ${
            theme.palette.menu.hover[
              props.settings.prefersDarkMode ? 'dark' : 'light'
            ]
          }`,
      },
    },
    '& span': {
      // color: props =>
      // props.settings.prefersDarkMode ? '#C3CCCC' : '#616161',
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
    },
  },
  switchInputStyle: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 0,
    '& > span': {
      outline: 'none !important',
    },
  },
  submitSectionStyle: {
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
    '& h3.save': {
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
});

export default styles;
