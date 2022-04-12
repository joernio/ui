const styles = theme => ({
  rawStringContainerStyle: {
    height: '90%',
    overflow: 'auto',
    marginLeft: '1em',
    paddingTop: '1em',
    color: props => (props.settings.prefersDarkMode ? '#C3CCCC' : '#616161'),
  },
  synthFileViewerStyle: {
    width: '100%',
    height: '90%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    '& svg': {
      height: '100% !important',
      width: '100% !important',
    },
    '& div': {
      height: '100%',
      width: '100%',
    },
    backgroundColor: props =>
      theme.palette.editor.background[
        props.settings.prefersDarkMode ? 'dark' : 'light'
      ],
    color: props =>
      theme.palette.editor.base[
        props.settings.prefersDarkMode ? 'dark' : 'light'
      ],
    '& > div': {
      stroke: props =>
        theme.palette.editor.background[
          props.settings.prefersDarkMode ? 'light' : 'dark'
        ],
      backgroundColor: props =>
        theme.palette.editor.background[
          props.settings.prefersDarkMode ? 'dark' : 'light'
        ],
      '& polygon': {
        fill: 'transparent',
      },
      '& .node ellipse': {
        stroke: props =>
          theme.palette.editor.background[
            props.settings.prefersDarkMode ? 'light' : 'dark'
          ],
      },
      '& .edge *': {
        stroke: props =>
          theme.palette.editor.background[
            props.settings.prefersDarkMode ? 'light' : 'dark'
          ],
      },
    },
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
