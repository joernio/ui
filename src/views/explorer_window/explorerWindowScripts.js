/**
 * function to calculate the width of the explorer when resized
 * @param {string} drawerWidth
 * @param {number} diff
 * @returns drawerWidth
 */
export const resizeHandler = (drawerWidth, diff) => {
  console.log('resizeHandler: ', { drawerWidth, diff });
  if (!drawerWidth || typeof drawerWidth !== 'string') return { drawerWidth };

  if (Number(drawerWidth.split('px')[0]) < 250 && diff < 0) {
    drawerWidth = 0;
  } else if (Number(drawerWidth.split('px')[0]) < 250 && diff > 0) {
    drawerWidth = '250px';
  }

  return { drawerWidth };
};
