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

export const addRemoveKeyDownKeyUpEvent = (type, document, handleSetState) => {
	document[type]('keydown', e => handleSetState(isCtrlKeyPressed(e)));
	document[type]('keyup', e => handleSetState(isCtrlKeyUnpressed(e)));
};

export const zoomIn = ({ node, dotGraphViewerScale }) => {
	dotGraphViewerScale += 5;
	const gNode = node.node().querySelector('g');
	const bbox = gNode.parentElement.getBBox();
	const translate_x =
		(1 - dotGraphViewerScale / 100) * (bbox.x + bbox.width / 2);
	const translate_y =
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
	dotGraphViewerScale -= 5;
	const gNode = node.node().querySelector('g');
	const bbox = gNode.parentElement.getBBox();
	const translate_x =
		(1 - dotGraphViewerScale / 100) * (bbox.x + bbox.width / 2);
	const translate_y =
		(1 - dotGraphViewerScale / 100) * (bbox.y + bbox.height / 2);
	d3.select(gNode).attr(
		'transform',
		`translate(${translate_x},${translate_y}) scale(${
			dotGraphViewerScale / 100
		})`,
	);
	return { dotGraphViewerScale };
};
