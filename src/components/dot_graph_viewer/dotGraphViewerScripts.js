import * as d3 from 'd3';

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
 * @param {*} type
 * @param {*} document
 * @param {*} handleSetState
 */
export const addRemoveKeyDownKeyUpEvent = (type, document, handleSetState) => {
  document[type]('keydown', e => handleSetState(isCtrlKeyPressed(e)));
  document[type]('keyup', e => handleSetState(isCtrlKeyUnpressed(e)));
};

/**
 *
 * @param {*} param0
 * @returns
 */
export const zoomIn = ({ node, dotGraphViewerScale }) => {
  dotGraphViewerScale = dotGraphViewerScale + 5;
  let gNode = node.node().querySelector('g');
  let bbox = gNode.parentElement.getBBox();
  let translate_x = (1 - dotGraphViewerScale / 100) * (bbox.x + bbox.width / 2);
  let translate_y =
    (1 - dotGraphViewerScale / 100) * (bbox.y + bbox.height / 2);
  d3.select(gNode).attr(
    'transform',
    `translate(${translate_x},${translate_y}) scale(${
      dotGraphViewerScale / 100
    })`,
  );
  return { dotGraphViewerScale };
};

/**
 *
 * @param {*} param0
 * @returns
 */
export const zoomOut = ({ node, dotGraphViewerScale }) => {
  dotGraphViewerScale = dotGraphViewerScale - 5;
  let gNode = node.node().querySelector('g');
  let bbox = gNode.parentElement.getBBox();
  let translate_x = (1 - dotGraphViewerScale / 100) * (bbox.x + bbox.width / 2);
  let translate_y =
    (1 - dotGraphViewerScale / 100) * (bbox.y + bbox.height / 2);
  d3.select(gNode).attr(
    'transform',
    `translate(${translate_x},${translate_y}) scale(${
      dotGraphViewerScale / 100
    })`,
  );
  return { dotGraphViewerScale };
};
