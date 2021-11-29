const styles = theme => ({
  imageViewerStyle: {
    width: '100%',
    height: '90%',
    display: 'flex',
    backgroundColor: props =>
      theme.palette.editor.background[
        props.settings.prefersDarkMode ? 'dark' : 'light'
      ],
    color: props =>
      theme.palette.editor.base[
        props.settings.prefersDarkMode ? 'dark' : 'light'
      ],
    overflow: 'scroll',
    '&::-webkit-scrollbar': {
      width: '12px',
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: props =>
        theme.palette.editor.background[
          props.settings.prefersDarkMode ? 'dark' : 'light'
        ],
    },

    '&::-webkit-scrollbar-corner': {
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

  zoomInStyle: {
    cursor: '-moz-zoom-in',
    cursor: '-webkit-zoom-in',
    cursor: 'zoom-in',
  },

  zoomOutStyle: {
    cursor: '-moz-zoom-out',
    cursor: '-webkit-zoom-out',
    cursor: 'zoom-out',
  },
});

export default styles;
