import React from 'react';
import clsx from 'clsx';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Icon } from '@blueprintjs/core';
import { Popover2, Tooltip2 } from '@blueprintjs/popover2';
import styles from '../../assets/js/styles/components/queries_stats/queriesStatsStyles';

import { queueEmpty, nFormatter } from '../../assets/js/utils/scripts';
import { countQueries, updateQueriesStats } from './queriesStatsScripts';

const useStyles = makeStyles(styles);

function QueriesStats(props) {
  const classes = useStyles(props);
  let updateQueryIntervalID = null;

  const [state, setState] = React.useState({
    queriesStatsPopoverIsOpen: false,
    queriesCount: 0,
    queriesStats: [],
  });

  const handleSetState = obj => {
    if (obj) {
      Promise.resolve(obj).then(obj => {
        setState(state => ({ ...state, ...obj }));
      });
    }
  };

  React.useEffect(() => {
    if (props.query?.results) {
      handleSetState(countQueries(props.query.results));
    }
  }, [props.query?.results]);

  React.useEffect(() => {
    if (state.queriesStatsPopoverIsOpen && props.query?.results) {
      updateQueryIntervalID = setInterval(
        () =>
          setState(state => ({
            ...state,
            ...updateQueriesStats(props.query.results),
          })),
        100,
      );
    } else {
      clearInterval(updateQueryIntervalID);
    }

    return () => clearInterval(updateQueryIntervalID);
  }, [state.queriesStatsPopoverIsOpen]);

  const { queriesStatsPopoverIsOpen, queriesCount, queriesStats } = state;
  return (
    <Popover2
      className={classes.queriesStatsPopoverStyles}
      content={
        <div className={classes.queriesStatsPopoverContentContainerStyle}>
          {queriesStats &&
            queriesStats.map(query_stat => (
              <div className={classes.queriesStatsQueryContainerStyle}>
                <div>
                  <Tooltip2
                    popoverClassName={classes.toolTipStyle}
                    content={
                      <div className={classes.toolTipTextStyle}>
                        {query_stat.query}
                      </div>
                    }
                    placement="top"
                    openOnTargetFocus={false}
                    usePortal={true}
                    inheritDarkTheme={false}
                  >
                    <div className={classes.queriesStatsQueryPreviewStyle}>
                      {query_stat.query}
                    </div>
                  </Tooltip2>

                  <div className={classes.quriesStatsEllapsedTimeStyle}>
                    {query_stat.t_elapsed
                      ? nFormatter(Math.ceil(query_stat.t_elapsed)) + ' ms'
                      : null}
                  </div>
                </div>
                <div
                  className={clsx({
                    [classes.queriesStatsQueryStatusPendingStyle]:
                      !query_stat.completed,
                    [classes.queriesStatsQueryStatusCompletedStyle]:
                      query_stat.completed,
                  })}
                >
                  {query_stat.completed ? 'completed' : 'pending'}
                </div>
              </div>
            ))}
        </div>
      }
      placement="top-end"
      minimal={true}
      openOnTargetFocus={false}
      interactionKind="hover"
      isOpen={queriesStatsPopoverIsOpen}
      onInteraction={isOpen =>
        handleSetState({ queriesStatsPopoverIsOpen: isOpen })
      }
    >
      <div
        className={classes.queriesStatsSectionStyle}
        data-test="queries-stats"
      >
        <div className={classes.refreshIconContainerStyle}>
          {!queueEmpty(props.query.queue) ? (
            <Icon
              icon="refresh"
              className={clsx(
                classes.refreshIconStyle,
                'refresh-icon-animation',
              )}
            />
          ) : (
            <Icon icon="refresh" className={clsx(classes.refreshIconStyle)} />
          )}
        </div>
        <p className={classes.queriesStatsStyle}>{nFormatter(queriesCount)}</p>
        {!queueEmpty(props.query.queue) ? <div>running...</div> : null}
      </div>
    </Popover2>
  );
}

const mapStateToProps = state => {
  return {
    query: state.query,
    settings: state.settings,
  };
};

export default connect(mapStateToProps, null)(QueriesStats);
