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

export const zoomIn = ({ imageViewerHeight, imageViewerWidth }) => {
	const res = {
		imageViewerHeight: imageViewerHeight + 5,
		imageViewerWidth: imageViewerWidth + 5,
	};
	return res;
};

export const zoomOut = ({ imageViewerHeight, imageViewerWidth }) => {
	const res = {
		imageViewerHeight: imageViewerHeight > 5 ? imageViewerHeight - 5 : 5,
		imageViewerWidth: imageViewerWidth > 5 ? imageViewerWidth - 5 : 5,
	};
	return res;
};
