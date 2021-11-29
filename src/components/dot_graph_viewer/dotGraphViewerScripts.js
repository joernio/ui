import * as d3 from 'd3';

export const isCtrlKeyPressed = e => {
  if (e.code === 'ControlLeft' || e.code === 'ControlRight') {
    return { ctrlKeyPressed: true };
  }
};

export const isCtrlKeyUnpressed = e => {
  if (e.code === 'ControlLeft' || e.code === 'ControlRight') {
    return { ctrlKeyPressed: false };
  }
};

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
