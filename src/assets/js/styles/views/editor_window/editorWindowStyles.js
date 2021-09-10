const styles = theme => ({
  editorContainerStyle: {
    height: '100%',
    backgroundColor: props =>
      theme.palette.editor.background[
        props.settings.prefersDarkMode ? 'dark' : 'light'
      ],
  },
  drawerCloseStyle: {
    width: props => `calc(100vw - ${props.sideNavWidth})`,
  },
  drawerOpenStyle: {
    width: props =>
      `calc(100vw - ${props.sideNavWidth} - ${props.drawerWidth})`,
  },
  editorModeStyle: {
    backgroundColor: '#0090F1',
    color: 'white',
    padding: '0.2em 0.7em',
  },
});

export default styles;
