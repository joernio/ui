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
});

export default styles;
