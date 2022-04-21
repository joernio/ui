export const defaults = {
	windowPosition: [-1, -1],
	windowSize: [1300, 950],
};

/**
 * Calculates the window position
 * @returns size and position of a window
 */
export const getWindowPosition = () => {
	const size = defaults.windowSize;

	const position = defaults.windowPosition;

	return { position, size };
};
