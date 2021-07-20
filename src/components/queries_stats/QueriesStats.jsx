import React from 'react';
import clsx from 'clsx';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Icon } from '@blueprintjs/core';
import { Popover2, Tooltip2 } from '@blueprintjs/popover2';
import { usePrevious } from '../../assets/js/utils/hooks';
import styles from '../../assets/js/styles/components/queries_stats/queriesStatsStyles';

import { queueEmpty, nFormatter } from '../../assets/js/utils/scripts';
import { getQueriesStats, updateQueriesStats } from './queriesStatsScripts';

const useStyles = makeStyles(styles);

function QueriesStats(props) {
  const classes = useStyles(props);
  let updateQueryIntervalID = null;

  const [state, setState] = React.useState({
    queriesStatsPopoverIsOpen: false,
    queriesStats: [],
  });

  const handleSetState = obj => {
    if (obj) {
      Promise.resolve(obj).then(obj => {
        setState(state => ({ ...state, ...obj }));
      });
    }
  };

  const prev_queue = usePrevious(
    props.query.queue ? { ...props.query.queue } : {},
  );

  React.useEffect(() => {
    if (props.query.queue) {
      handleSetState({
        ...getQueriesStats(props.query.queue, prev_queue, state.queriesStats),
      });
    }
  }, [props.query.queue]);

  React.useEffect(() => {
    if (state.queriesStatsPopoverIsOpen) {
      updateQueryIntervalID = setInterval(
        () =>
          setState(state => ({
            ...state,
            ...updateQueriesStats(state.queriesStats),
          })),
        100,
      );
    } else {
      clearInterval(updateQueryIntervalID);
    }

    return () => clearInterval(updateQueryIntervalID);
  }, [state.queriesStatsPopoverIsOpen]);

  const { queriesStatsPopoverIsOpen, queriesStats } = state;
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
                    popoverClassName={classes.queriesStatsToolTipStyle}
                    content={
                      <div className={classes.toolTipTextStyle}>
                        {query_stat.query}
                      </div>
                    }
                    placement="top"
                    usePortal={true}
                    inheritDarkTheme={false}
                  >
                    <div className={classes.queriesStatsQueryPreviewStyle}>
                      {query_stat.query}
                    </div>
                  </Tooltip2>

                  <div className={classes.quriesStatsEllapsedTimeStyle}>
                    {query_stat.t1
                      ? nFormatter(Math.ceil(query_stat.t1)) + ' ms'
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
      interactionKind="hover"
      isOpen={queriesStatsPopoverIsOpen}
      onInteraction={isOpen =>
        handleSetState({ queriesStatsPopoverIsOpen: isOpen })
      }
    >
      <div className={classes.queriesStatsSectionStyle}>
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
        <p className={classes.queriesStatsStyle}>
          {nFormatter(queriesStats.length)}
        </p>
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
