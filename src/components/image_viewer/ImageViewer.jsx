import React from 'react';
import clsx from 'clsx';
import { connect } from 'react-redux';
import {
  isCtrlKeyPressed,
  isCtrlKeyUnpressed,
  zoomOut,
  zoomIn,
} from './imageViewerScripts';

import { makeStyles } from '@material-ui/core';
import styles from '../../assets/js/styles/components/image_viewer/imageViewerStyles';
import commonStyles from '../../assets/js/styles';

const useCommonStyles = makeStyles(commonStyles);
const useStyles = makeStyles(styles);

function ImageViewer(props) {
  const classes = useStyles(props);
  const commonClasses = useCommonStyles(props);

  const refs = {
    imageViewerEl: React.useRef(null),
  };

  const [state, setState] = React.useState({
    ctrlKeyPressed: false,
    imageViewerHeight: 100,
    imageViewerWidth: 100,
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

    const zoomCallback = e => {
      if (e.ctrlKey) {
        handleSetState(zoomOut(state));
      } else {
        handleSetState(zoomIn(state));
      }
    };

    if (refs.imageViewerEl.current) {
      document.addEventListener('keydown', ctrlKeyPressedCallback);
      document.addEventListener('keyup', ctrlKeyUnpressedCallback);
      refs.imageViewerEl.current.addEventListener('click', zoomCallback);
    } else {
      document.removeEventListener('keydown', ctrlKeyPressedCallback);
      document.removeEventListener('keyup', ctrlKeyUnpressedCallback);
    }

    return () => {
      refs.imageViewerEl.current &&
        refs.imageViewerEl.current.removeEventListener('click', zoomCallback);
      document.removeEventListener('keydown', ctrlKeyPressedCallback);
      document.removeEventListener('keyup', ctrlKeyUnpressedCallback);
    };
  }, [state, refs.imageViewerEl.current]);

  const { ctrlKeyPressed, imageViewerHeight, imageViewerWidth } = state;
  const { src } = props;

  return (
    <div
      ref={refs.imageViewerEl}
      className={clsx(
        classes.imageViewerStyle,
        commonClasses.scrollBarStyle,
        commonClasses.scrollBarLightStyle,
        {
          [classes.zoomInStyle]: !ctrlKeyPressed,
          [classes.zoomOutStyle]: ctrlKeyPressed,
        },
      )}
    >
      <img
        style={{
          width: `${imageViewerWidth}%`,
          height: `${imageViewerHeight}%`,
          margin: 'auto',
        }}
        src={src}
        alt=""
      />
    </div>
  );
}

const mapStateToProps = state => {
  return {
    settings: state.settings,
  };
};

export default connect(mapStateToProps, null)(ImageViewer);
