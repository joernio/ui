export const getWindowHeight = (clientHeight, topNavHeight, statusBarHeight) =>
	clientHeight -
	Number(topNavHeight?.split('px')[0]) -
	Number(statusBarHeight?.split('px')[0]);
