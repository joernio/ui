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
