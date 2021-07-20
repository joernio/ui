const styles = theme => ({
  queriesStatsPopoverStyles: {
    height: '100%',
  },
  queriesStatsPopoverContentContainerStyle: {
    width: '300px',
    maxHeight: '50vh',
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
  queriesStatsSectionStyle: {
    display: 'flex',
    alignItems: 'center',
    height: '100%',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: props =>
        theme.palette.navBar.hover[
          props.settings.prefersDarkMode ? 'dark' : 'light'
        ],
    },
  },
  queriesStatsQueryContainerStyle: {
    display: 'flex',
    width: '100%',
    padding: '0.5em',
    justifyContent: 'space-between',
    '& > div:nth-child(1)': {
      display: 'flex',
      width: '170px',
      justifyContent: 'space-between',
    },
  },
  queriesStatsToolTipStyle: {
    '& .bp3-popover2-content': {
      backgroundColor: theme.palette.explorer.background.light,
    },
    '& .bp3-popover2-arrow-fill': {
      fill: theme.palette.explorer.background.light,
    },
  },
  toolTipTextStyle: {
    backgroundColor: theme.palette.explorer.background.light,
    color: theme.palette.explorer.base.light,
  },
  queriesStatsQueryPreviewStyle: {
    maxWidth: '100px',
    overflow: 'hidden',
    marginRight: '1em',
    display: '-webkit-box',
    WebkitLineClamp: 1,
    WebkitBoxOrient: 'vertical',
  },

  queriesStatsQueryStatusCompletedStyle: {
    color: '#62bd19',
  },
  queriesStatsQueryStatusPendingStyle: {
    color: 'grey',
  },
  refreshIconContainerStyle: {
    position: 'relative',
    height: '16px',
    width: '16px',
    margin: '0 0.5em 0 1em',
  },
  refreshIconStyle: {
    position: 'absolute',
    left: '2',
  },
  queriesStatsStyle: {
    margin: 'auto 0.5em auto 0',
  },
  hiddenStyle: {
    display: 'none',
    width: 0,
    height: 0,
  },
});

export default styles;
