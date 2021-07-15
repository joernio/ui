export const resizeHandler = (drawerWidth, diff) => {
  if (Number(drawerWidth.split('px')[0]) < 250 && diff < 0) {
    drawerWidth = 0;
  } else if (Number(drawerWidth.split('px')[0]) < 250 && diff > 0) {
    drawerWidth = '250px';
  }

  return { drawerWidth };
};
