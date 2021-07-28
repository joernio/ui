const styles = theme => ({
  rootStyle: {
    borderBottom: props=> `1px solid rgba${props.settings.prefersDarkMode ? '(0,0,0,0.2)' : '(255,255,255,0.2)'}` ,
    '&:focus': {
      border: '1px solid #0090F1',
      outline: 'none'
    }
  },
  titleSectionStyle: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer'
  },
  titleStyle: {
    textTransform: 'uppercase',
    fontWeight: 'bold',
    fontSize: '0.8rem',
    marginTop: '0.3em',
    marginBottom: '0.3em',
    color: props =>
      theme.palette.explorer.base[
        props.settings.prefersDarkMode ? 'dark' : 'light'
      ],
  },
  scriptsSectionStyle: {
    paddingLeft: '1.3em',
    overflowY: 'scroll',
    '&::-webkit-scrollbar':{
      width: '12px',
  },
  '&::-webkit-scrollbar-track':{
      backgroundColor: props=>theme.palette.scrollbar.background[props.settings.prefersDarkMode ? 'dark' : 'light'],
  },
  
  '&::-webkit-scrollbar-thumb':{
      backgroundColor: props=>theme.palette.scrollbar.background[props.settings.prefersDarkMode ? 'dark' : 'light'],
  },
  
  '&:hover::-webkit-scrollbar-thumb': {
      backgroundColor: props=>theme.palette.scrollbar.base[props.settings.prefersDarkMode ? 'dark' : 'light'],
  },
  
  '&::-webkit-scrollbar-thumb:hover':{
      backgroundColor: props=>theme.palette.scrollbar.hover[props.settings.prefersDarkMode ? 'dark' : 'light'],
  }
  },
  scriptSectionStyle: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: '0.5em',
    cursor: 'context-menu',
    '&:hover': {
      backgroundColor: props => theme.palette.explorer.hover[props.settings.prefersDarkMode ? 'dark' : 'light']
    },
    '&:focus': {
      backgroundColor: '#0090F150',
      border: '1px solid #0090F1',
      outline: 'none'
    }
  },
  menuStyle:{
    backgroundColor: props => theme.palette.menu.background[props.settings.prefersDarkMode ? 'dark' : 'light'],
    borderRadius: 0
   },
   menuItemStyle:{
     borderRadius: 0,
     color: props => theme.palette.menu.base[props.settings.prefersDarkMode ? 'dark' : 'light'],
     '& span': {
       color: props => `${theme.palette.menu.base[props.settings.prefersDarkMode ? 'dark' : 'light']} !important`,
     },
     '&:hover':{
       backgroundColor: props => theme.palette.menu.hover[props.settings.prefersDarkMode ? 'dark' : 'light'],
       color: "#FFFFFF",
       '& span': {
         color: "#FFFFFF !important"
       },
     }
   },
   menuDividerStyle: {
     borderTop: props =>  `1px solid ${theme.palette.menu.base[props.settings.prefersDarkMode ? 'dark' : 'light']}50`,
   },
  scriptNameStyle: {
    maxWidth: '180px',
    color: props =>
      theme.palette.explorer.base[
        props.settings.prefersDarkMode ? 'dark' : 'light'
      ],
    textOverflow: 'ellipsis',
    maxWidth: '180px',
    overflow: 'hidden',
    fontSize: '0.9rem',
    fontWeight: 400,
    marginTop: '0.2em',
    marginBottom: '0.2em',
  },
  scriptsVisible: {
    transition: `mask-position 0.3s, -webkit-mask-position 0.3s,${theme.transitions.create(
      'height',
      {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      },
    )}`,
    height: 'auto',
    maxHeight: '12em',
  },
  scriptsHidden: {
    transition: theme.transitions.create('height', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    height: 0,
  },
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
  scrolledStyle: {
    boxShadow: props =>
      `inset 0px 2px 8px 1px ${
        theme.palette.editor.background[
          props.settings.prefersDarkMode ? 'dark' : 'light'
        ]
      }`,
  },
  contextMenuItemStyle: {
    textTransform: 'capitalize',
    backgroundColor: 'rgba(0,0,0,0)',
    paddingRight: '12px',
    paddingLeft: '12px',
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
    '& svg': {
      marginRight: '0.5em',
    },
  },
  dangerStyle: {
    color: theme.palette.error.main,
    '& svg': {
      fill: theme.palette.error.main,
    },
  },
});

export default styles;
