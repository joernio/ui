import { debounceLeading, handleShortcut } from '../../assets/js/utils/scripts';

const debouncedHandleShortcut = debounceLeading(handleShortcut, 1000);

export const closeDialog = () => ({ dialogOpen: false });

export const runQueryWithArgs = (el, props) => {
  let query = props.query.queryShortcut.query.split('\\0');

  query = query
    .map((str, index) => {
      if (index === 0) {
        return str;
      } else {
        return el.current.getElementById(`arg-${index}`).value + str;
      }
    })
    .join('');

  const queryShortcut = { ...props.query.queryShortcut, query };
  debouncedHandleShortcut(queryShortcut);
};
