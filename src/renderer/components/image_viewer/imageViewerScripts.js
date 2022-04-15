/**
 *
 * @param {*} e
 * @returns
 */
export const isCtrlKeyPressed = e => {
  if (e.code === 'ControlLeft' || e.code === 'ControlRight') {
    return { ctrlKeyPressed: true };
  }
};

/**
 *
 * @param {*} e
 * @returns
 */
export const isCtrlKeyUnpressed = e => {
  if (e.code === 'ControlLeft' || e.code === 'ControlRight') {
    return { ctrlKeyPressed: false };
  }
};

/**
 *
 * @param {*} param0
 * @returns
 */
export const zoomIn = ({ imageViewerHeight, imageViewerWidth }) => {
  const res = {
    imageViewerHeight: imageViewerHeight + 5,
    imageViewerWidth: imageViewerWidth + 5,
  };
  return res;
};

/**
 *
 * @param {*} param0
 * @returns
 */
export const zoomOut = ({ imageViewerHeight, imageViewerWidth }) => {
  const res = {
    imageViewerHeight: imageViewerHeight > 5 ? imageViewerHeight - 5 : 5,
    imageViewerWidth: imageViewerWidth > 5 ? imageViewerWidth - 5 : 5,
  };
  return res;
};
