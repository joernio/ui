import { debounceLeading, handleShortcut } from '../../assets/js/utils/scripts';

const debouncedHandleShortcut = debounceLeading(handleShortcut, 1000);

/**
 * Function to close dialogue
 * @returns
 */
export const closeDialog = () => {
  console.log('closeDialog: => ');
  return { dialogOpen: false };
};

/**
 * function to run query with args
 * @param {*} el
 * @param {*} props
 */
export const runQueryWithArgs = (el, props) => {
	let query = props.query.queryShortcut.query.split('\\0');

	query = query
		.map((str, index) => {
			if (index === 0) {
				return str;
			}
			return el.current.querySelector(`#arg-${index}`).value + str;
		})
		.join('');

	const queryShortcut = { ...props.query.queryShortcut, query };
	debouncedHandleShortcut(queryShortcut);
};
