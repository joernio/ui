/**
 * Gets window height
 * @param {number} clientHeight 
 * @param {number} topNavHeight 
 * @param {number} statusBarHeight 
 * @returns number
 */
export const getWindowHeight = (clientHeight, topNavHeight, statusBarHeight) =>
	clientHeight -
	Number(topNavHeight?.split('px')[0]) -
	Number(statusBarHeight?.split('px')[0]);
