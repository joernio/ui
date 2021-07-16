const styles = theme => ({
    rootStyle: {
      borderTop: '1px solid rgba(255, 255, 255, 0.12)',
      overflowY: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    },
    titleSectionStyle: {
      display: 'flex',
      alignItems: 'center',
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
    foldersSectionStyle: {
      overflowY: 'scroll',
      maskImage:
        'linear-gradient(to top, transparent, black), linear-gradient(to left, transparent 17px, black 17px)',
      maskSize: '100% 20000px',
      maskPosition: 'left bottom',
      WebkitMaskImage:
        'linear-gradient(to top, transparent, black), linear-gradient(to left, transparent 17px, black 17px)',
      WebkitMaskSize: '100% 20000px',
      WebkitMaskPosition: 'left bottom',
      '&:hover': {
        WebkitMaskPosition: 'left top',
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
    foldersVisible: {
      transition: `mask-position 0.3s, -webkit-mask-position 0.3s,${theme.transitions.create(
        'height',
        {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        },
      )}`,
      height: 'auto',
      maxHeight: '100%',
    },
    foldersHidden: {
      transition: theme.transitions.create('height', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      height: 0,
    },
  });

export default styles;