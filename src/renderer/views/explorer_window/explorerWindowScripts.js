export const resizeHandler = (drawerWidth, diff, explorerWindowEl) => {
	if (!drawerWidth || typeof drawerWidth !== 'string') return { drawerWidth };

	if (Number(drawerWidth.split('px')[0]) < 250 && diff < 0) {
		drawerWidth = 0;
	} else if (Number(drawerWidth.split('px')[0]) < 250 && diff > 0) {
		drawerWidth = '250px';
	} else if( diff > 0 && explorerWindowEl.current && Number(drawerWidth.split('px')[0]) + explorerWindowEl.current.previousElementSibling.getBoundingClientRect().width + 10 >= explorerWindowEl.current.parentElement.parentElement.getBoundingClientRect().width ) {
    drawerWidth = `${ explorerWindowEl.current.parentElement.parentElement.getBoundingClientRect().width - explorerWindowEl.current.previousElementSibling.getBoundingClientRect().width - 10}px`;
  }

	return { drawerWidth };
};
