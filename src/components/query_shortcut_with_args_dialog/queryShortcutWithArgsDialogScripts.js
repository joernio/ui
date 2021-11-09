import { stratify } from 'd3-hierarchy';

export const toggleDialog = openDialog => ({ openDialog: !openDialog });

export const runQueryWithArgs = (el, props) => {
  let query = props.QueryShortcut.query.split('\0');

  query = query
    .map((str, index) => {
      if (index !== query.length - 1) {
        return str + el.current.querySelector(`#arg-${index}`).value;
      } else {
        return str;
      }
    })
    .joint('');

  const queryShortcut = { ...props.QueryShortcut, query };
};
