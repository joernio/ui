const styles = theme => ({
  editorTabsContainerStyle: {
    display: 'flex',
    maxWidth: '100%',
    backgroundColor: props =>
      theme.palette.editorNavBar.background[
        props.settings.prefersDarkMode ? 'dark' : 'light'
      ],
    overflowX: 'scroll',
    '&::-webkit-scrollbar': {
      height: '4px',
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: props =>
        theme.palette.editor.background[
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
  editorTabStyle: {
    display: 'flex',
    flexWrap: 'nowrap',
    alignItems: 'center',
    padding: '0 0.2em',

    height: '2.1em',
    borderLeft: props =>
      `0.5px solid ${
        theme.palette.editor.background[
          props.settings.prefersDarkMode ? 'dark' : 'light'
        ]
      }`,
    borderRight: props =>
      `0.5px solid ${
        theme.palette.editor.background[
          props.settings.prefersDarkMode ? 'dark' : 'light'
        ]
      }`,
    color: props =>
      theme.palette.editorNavBar.base[
        props.settings.prefersDarkMode ? 'dark' : 'light'
      ],
    '& > .unsaved-close-icon-style': {
      display: 'none',
    },
    '& > .saved-close-icon-style': {
      visibility: 'hidden',
    },
    '& > .unsaved-icon': {
      display: 'block',
    },
    '&:hover': {
      '& > .unsaved-close-icon-style': {
        display: 'block',
      },
      '& > .saved-close-icon-style': {
        visibility: 'visible',
      },
      '& > .unsaved-icon': {
        display: 'none',
      },
    },
  },
  editorTabActiveStyle: {
    backgroundColor: props =>
      theme.palette.editor.background[
        props.settings.prefersDarkMode ? 'dark' : 'light'
      ],
    color: props =>
      theme.palette.editor.base[
        props.settings.prefersDarkMode ? 'dark' : 'light'
      ],
  },
  editorTabTitleStyle: {
    cursor: 'pointer',
    display: 'flex',
    flexWrap: 'nowrap',
    alignItems: 'center',
    flexGrow: 1,
    fontSize: '0.9rem',
    minWidth: '160px',
    whiteSpace: 'nowrap',
    fontWeight: 400,
  },
  iconStyle: {
    cursor: 'pointer',
    padding: '0.2em 0.2em',
    margin: '0 0.3em',
  },
  closeIconStyle: {
    '&:hover': {
      backgroundColor: props =>
        theme.palette.editorNavBar.hover[
          props.settings.prefersDarkMode ? 'dark' : 'light'
        ],
    },
  },
});

export default styles;
