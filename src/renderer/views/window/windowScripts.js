/**
 * get window height
 * @param {*} clientHeight
 * @param {*} topNavHeight
 * @param {*} statusBarHeight
 * @returns
 */
export const getWindowHeight = (
  clientHeight,
  topNavHeight,
  statusBarHeight,
) => {
  return (
    clientHeight -
    Number(topNavHeight?.split('px')[0]) -
    Number(statusBarHeight?.split('px')[0])
  );
};
