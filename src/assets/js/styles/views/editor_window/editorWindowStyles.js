const styles = theme => ({
    editorContainerStyle: {
      paddingTop: '1.5em',
      height: '100%',
      backgroundColor: theme.palette.background.paper,
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