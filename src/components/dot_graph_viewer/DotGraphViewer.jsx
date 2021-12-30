import React from 'react';
import clsx from 'clsx';
import { connect } from 'react-redux';
import * as d3 from 'd3';
import 'd3-graphviz';
import {
  isCtrlKeyPressed,
  isCtrlKeyUnpressed,
  zoomOut,
  zoomIn,
} from './dotGraphViewerScripts';
import { makeStyles } from '@material-ui/core';
import styles from '../../assets/js/styles/components/dot_graph_viewer/dotGraphViewerStyles';
import commonStyles from '../../assets/js/styles';

const useCommonStyles = makeStyles(commonStyles);
const useStyles = makeStyles(styles);

function DotGraphViewer(props) {
  const commonClasses = useCommonStyles(props);
  const classes = useStyles(props);

  const refs = {
    dotGraphViewerEl: React.useRef(null),
  };

  const [state, setState] = React.useState({
    node: null,
    ctrlKeyPressed: false,
    dotGraphViewerScale: 100,
  });

  const handleSetState = obj => {
    if (obj) {
      Promise.resolve(obj).then(obj => {
        setState(state => ({ ...state, ...obj }));
      });
    }
  };

  React.useEffect(() => {
    const ctrlKeyPressedCallback = e => {
      handleSetState(isCtrlKeyPressed(e));
    };

    const ctrlKeyUnpressedCallback = e => {
      handleSetState(isCtrlKeyUnpressed(e));
    };

    if (refs.dotGraphViewerEl.current) {
      document.addEventListener('keydown', ctrlKeyPressedCallback);
      document.addEventListener('keyup', ctrlKeyUnpressedCallback);

      const node = d3.select(refs.dotGraphViewerEl.current.children[0]);
      handleSetState({ node });
    } else {
      document.removeEventListener('keydown', ctrlKeyPressedCallback);
      document.removeEventListener('keyup', ctrlKeyUnpressedCallback);
    }

    return () => {
      document.removeEventListener('keydown', ctrlKeyPressedCallback);
      document.removeEventListener('keyup', ctrlKeyUnpressedCallback);
    };
  }, [refs.dotGraphViewerEl.current]);

  React.useEffect(() => {
    if (state.node) {
      state.node.graphviz({ fit: true }).renderDot(props.content);
    }
  }, [state.node]);

  React.useEffect(() => {
    const zoomCallback = e => {
      if (e.ctrlKey) {
        handleSetState(zoomOut(state));
      } else {
        handleSetState(zoomIn(state));
      }
    };

    if (refs.dotGraphViewerEl.current && state.dotGraphViewerScale) {
      refs.dotGraphViewerEl.current.removeEventListener('click', zoomCallback);
      refs.dotGraphViewerEl.current.addEventListener('click', zoomCallback);
    }

    return () => {
      refs.dotGraphViewerEl.current &&
        refs.dotGraphViewerEl.current.removeEventListener(
          'click',
          zoomCallback,
        );
    };
  }, [state.node, state.dotGraphViewerScale]);

  const { ctrlKeyPressed } = state;

  return (
    <div
      ref={refs.dotGraphViewerEl}
      className={clsx(
        commonClasses.scrollBarStyle,
        commonClasses.scrollBarLightStyle,
        classes.synthFileViewerStyle,
        {
          [classes.zoomInStyle]: !ctrlKeyPressed,
          [classes.zoomOutStyle]: ctrlKeyPressed,
        },
      )}
    >
      <div></div>
    </div>
  );
}

const mapStateToProps = state => {
  return {
    settings: state.settings,
  };
};

export default connect(mapStateToProps, null)(DotGraphViewer);
