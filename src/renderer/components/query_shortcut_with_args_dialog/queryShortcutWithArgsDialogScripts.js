import { debounceLeading, handleShortcut } from '../../assets/js/utils/scripts';

const debouncedHandleShortcut = debounceLeading(handleShortcut, 1000);

export const closeDialog = () => ({ dialogOpen: false });

export const runQueryWithArgs = (el, queryShortcut) => {
	let query = queryShortcut.query.split('\\0');

	query = query
		.map((str, index) => {
			if (index === 0) {
				return str;
			}
			return el.current.querySelector(`#arg-${index}`).value + str;
		})
		.join('');

	queryShortcut = { ...queryShortcut, query };
	debouncedHandleShortcut(queryShortcut);
};
