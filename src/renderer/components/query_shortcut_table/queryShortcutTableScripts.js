export const vars = {
	spaceF2: 200,
	spaceF3: 400,
	spaceF4: 600,
};

export const handleMouseDown = val => ({ mouseOver: val });

export const handleMouseOut = () => ({ hover: -1 });

export const handleMouseOver = idx => ({ hover: idx });

export const handleResize = (window, drawerWidth) => ({
	containerWidth:
		window.innerWidth -
		56 -
		Number(String(drawerWidth).split('px').join('')),
});

export const parseKeyBinding = keybinding => {
	keybinding = keybinding.split('+').reduce((acc, val) => {
		acc.push(val);
		acc.push('+');
		return acc;
	}, []);

	keybinding.pop();

	for (let i = 0; i < keybinding.length; i += 1) {
		if (
			JSON.stringify(keybinding[i].split(' ')) !==
			JSON.stringify(keybinding[i].split())
		) {
			keybinding[i] = keybinding[i].split(' ');
			keybinding[i] = keybinding[i].reduce((acc, val) => {
				acc.push(val);
				acc.push(' ');
				return acc;
			}, []);
			keybinding[i].pop();
		}
	}

	keybinding = keybinding.flat();

	return keybinding;
};

export const handleInitialTableWidth = (
	window,
	drawerWidth,
	containerWidth,
	frameWidth,
	handleSetState,
	refs,
) => {
	try {
		if (
			window.innerWidth -
				56 -
				Number(String(drawerWidth).split('px').join('')) <
			560
		)
			return;
		refs.frame2Ref.current.style.transform = `translateX(${
			(25 / 100) * containerWidth
		}px)`;
		refs.frame3Ref.current.style.transform = `translateX(${
			(50 / 100) * containerWidth
		}px)`;
		refs.frame4Ref.current.style.transform = `translateX(${
			(75 / 100) * containerWidth
		}px)`;
		handleSetState({
			frameWidth: {
				...frameWidth,
				f2: (25 / 100) * containerWidth,
				f3: (50 / 100) * containerWidth,
				f4: (75 / 100) * containerWidth,
			},
		});
	} catch (error) {} // eslint-disable-line no-empty
};

export const handleMove = params => {
	const {
		event,
		drawerWidth,
		window,
		refs,
		state: { frameWidth, mouseOver },
		handleSetState,
	} = params;

	const cx =
		event.clientX - 56 - Number(String(drawerWidth).split('px').join(''));
	const fw = frameWidth;
	let f4w = window.innerWidth;

	try {
		f4w = refs.frame4Ref.current.offsetWidth;
	} catch (error) {} // eslint-disable-line no-empty

	switch (mouseOver) {
		case 'frame2':
			if (cx - fw.f1 < vars.spaceF2) return;
			if (fw.f3 - cx < vars.spaceF2) {
				if (fw.f4 - cx < vars.spaceF3) {
					if (f4w - cx < vars.spaceF4) return;
					handleSetState({
						frameWidth: { ...frameWidth, f3: cx + vars.spaceF2 },
					});
					refs.frame3Ref.current.style.transform = `translateX(${
						cx + vars.spaceF2
					}px)`;
					refs.frame2Ref.current.style.transform = `translateX(${cx}px)`;
					handleSetState({
						frameWidth: { ...frameWidth, f4: cx + vars.spaceF3 },
					});
					refs.frame4Ref.current.style.transform = `translateX(${
						cx + vars.spaceF3
					}px)`;
					refs.frame3Ref.current.style.transform = `translateX(${
						cx + vars.spaceF2
					}px)`;
				}
				handleSetState({
					frameWidth: { ...frameWidth, f3: cx + vars.spaceF2 },
				});
				refs.frame3Ref.current.style.transform = `translateX(${
					cx + vars.spaceF2
				}px)`;
				refs.frame2Ref.current.style.transform = `translateX(${cx}px)`;
			}
			refs.frame2Ref.current.style.transform = `translateX(${cx}px)`;
			handleSetState({ frameWidth: { ...frameWidth, f2: cx } });
			refs.containerRef.current.onmouseup = () => {
				handleSetState({ mouseOver: 'up' });
			};
			break;

		case 'frame3':
			if (cx - fw.f2 < vars.spaceF2) {
				if (cx - fw.f1 < vars.spaceF3) return;
				refs.frame2Ref.current.style.transform = `translateX(${
					cx - vars.spaceF2
				}px)`;
				handleSetState({
					frameWidth: { ...frameWidth, f2: cx - vars.spaceF2 },
				});
			}
			if (fw.f4 - cx < vars.spaceF2) {
				if (f4w - cx < vars.spaceF3) return;
				handleSetState({
					frameWidth: { ...frameWidth, f4: cx + vars.spaceF2 },
				});
				refs.frame4Ref.current.style.transform = `translateX(${
					cx + vars.spaceF2
				}px)`;
				refs.frame3Ref.current.style.transform = `translateX(${cx}px)`;
			}
			refs.frame3Ref.current.style.transform = `translateX(${cx}px)`;
			handleSetState({ frameWidth: { ...frameWidth, f3: cx } });
			refs.containerRef.current.onmouseup = () => {
				handleSetState({ mouseOver: 'up' });
			};
			break;

		case 'frame4':
			if (cx - fw.f3 < vars.spaceF2) {
				if (cx - fw.f2 < vars.spaceF3) {
					if (cx - fw.f1 < vars.spaceF4) return;
					refs.frame2Ref.current.style.transform = `translateX(${
						cx - vars.spaceF3
					}px)`;
					handleSetState({
						frameWidth: { ...frameWidth, f2: cx - vars.spaceF3 },
					});
				}
				refs.frame3Ref.current.style.transform = `translateX(${
					cx - vars.spaceF2
				}px)`;
				handleSetState({
					frameWidth: { ...frameWidth, f3: cx - vars.spaceF2 },
				});
			}
			if (f4w - cx < vars.spaceF2) return;
			handleSetState({ frameWidth: { ...frameWidth, f4: cx } });
			refs.frame4Ref.current.style.transform = `translateX(${cx}px)`;
			refs.containerRef.current.onmouseup = () => {
				handleSetState({ mouseOver: 'up' });
			};
			break;
		default:
			break;
	}
};
