import React from 'react';
import clsx from 'clsx';
import { connect } from 'react-redux';
import * as d3 from 'd3';
import 'd3-graphviz';
import {
  zoomOut,
  zoomIn,
  addRemoveKeyDownKeyUpEvent,
} from './dotGraphViewerScripts';
import { makeStyles } from '@material-ui/core';
import EditorWindowBanner from '../editor_window_banner/EditorWindowBanner';
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
    prevContent: null,
    errorMessage: '',
  });

  const handleSetState = obj => {
    if (obj) {
      Promise.resolve(obj).then(obj => {
        setState(state => ({ ...state, ...obj }));
      });
    }
  };

  React.useEffect(() => {
    if (refs.dotGraphViewerEl.current) {
      if (props.content && state.prevContent !== props.content) {
        addRemoveKeyDownKeyUpEvent(
          'removeEventListener',
          document,
          handleSetState,
        );
        addRemoveKeyDownKeyUpEvent(
          'addEventListener',
          document,
          handleSetState,
        );

        const node = d3.select(refs.dotGraphViewerEl.current.children[0]);
        handleSetState({ node, prevContent: props.content });
      }
    } else {
      addRemoveKeyDownKeyUpEvent(
        'removeEventListener',
        document,
        handleSetState,
      );
    }

    return () => {
      addRemoveKeyDownKeyUpEvent(
        'removeEventListener',
        document,
        handleSetState,
      );
    };
  }, [refs.dotGraphViewerEl.current, props.content]);

  React.useEffect(() => {
    if (state.node) {
      try {
        state.node.graphviz({ fit: true }).renderDot(props.content);
        handleSetState({ errorMessage: '' });
      } catch {
        const errorMessage =
          'There was an error parsing AST Graph. Displaying raw string instead';
        handleSetState({ errorMessage });
      }
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

  const { ctrlKeyPressed, errorMessage } = state;

  return (
    <>
      <EditorWindowBanner message={errorMessage} />
      {errorMessage ? (
        <div
          className={clsx(
            classes.rawStringContainerStyle,
            commonClasses.scrollBarStyle,
            commonClasses.scrollBarLightStyle,
          )}
        >
          {props.content.split('\n').map(str => (
            <p>{str}</p>
          ))}
        </div>
      ) : (
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
      )}
    </>
  );
}

const mapStateToProps = state => {
  return {
    settings: state.settings,
  };
};

export default connect(mapStateToProps, null)(DotGraphViewer);
