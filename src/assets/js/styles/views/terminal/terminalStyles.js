const styles = theme => ({
  terminalStyle: {
    width: '100%',
    zIndex: 0,
    backgroundColor: props =>
      props.settings.prefersDarkMode ? '#000000' : '#ffffff',
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
    position: 'absolute',
    bottom: 0,
    '& .xterm .xterm-viewport': {
      overflowY: 'scroll',
      '&::-webkit-scrollbar':{
        width: '12px',
    },
    '&::-webkit-scrollbar-track':{
        backgroundColor: props=>theme.palette.scrollbar.background[props.settings.prefersDarkMode ? 'dark' : 'light'],
    },
    
    '&::-webkit-scrollbar-thumb':{
      backgroundColor: props=>theme.palette.scrollbar.base[props.settings.prefersDarkMode ? 'dark' : 'light'],
    },
    
    '&::-webkit-scrollbar-thumb:hover':{
        backgroundColor: props=>theme.palette.scrollbar.hover[props.settings.prefersDarkMode ? 'dark' : 'light'],
    }
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
      props.settings.prefersDarkMode ? '#000000' : '#ffffff',
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
    color: props => (props.settings.prefersDarkMode ? '#ffffff' : '#000000'),
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
