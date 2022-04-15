import { handleSetToast } from '../../assets/js/utils/scripts';
const vars = {
  currentDialogKeyBinding: '',
};

/**
 * Function to delete query shortcut
 * @param {*} key
 * @param {*} queryShortcuts
 * @returns the query shortcut to delete
 */
export const deleteQueryShorcut = (key, queryShortcuts) => {
  if (key) {
    delete queryShortcuts[key];
  } else {
    delete queryShortcuts[vars.currentDialogKeyBinding];
  }

  queryShortcuts = { ...queryShortcuts };
  return queryShortcuts;
};

/**
 * Function to collect query shortcut values
 * @param {*} values
 * @returns
 */
export const collectQueryShortcutValues = values => {
  if (!values.query) {
    handleSetToast({
      icon: 'warning-sign',
      intent: 'danger',
      message: 'query can not be blank',
    });
    return;
  } else if (!values.keybinding) {
    handleSetToast({
      icon: 'warning-sign',
      intent: 'danger',
      message: 'keybinding can not be blank',
    });
    return;
  } else if (!values.behaviour) {
    handleSetToast({
      icon: 'warning-sign',
      intent: 'danger',
      message: 'behaviour can not be blank',
    });
    return;
  } else if (values.background !== true && values.background !== false) {
    handleSetToast({
      icon: 'warning-sign',
      intent: 'danger',
      message: 'background must be boolean',
    });
    return;
  }

  const shortcut = {
    [values.keybinding]: {
      query: values.query,
      behaviour: values.behaviour,
      background: values.background,
    },
  };
  return shortcut;
};

/**
 * Function to save query shortcut
 * @param {*} values
 * @param {*} queryShortcuts
 * @param {*} props
 * @returns
 */
export const handleSaveQueryShortcut = (values, queryShortcuts, props) => {
  if (collectQueryShortcutValues(values)) {
    props.setQueryShortcuts(deleteQueryShorcut(null, queryShortcuts));
    props.setQueryShortcuts(collectQueryShortcutValues(values));
    return closeDialog();
  }
};

/**
 *
 * @param {*} e
 * @param {*} values
 * @returns
 */
export const handleOnKeyDown = (e, values) => {
  if (e.target.id === 'background') {
    values[e.target.id] = e.target.checked;
  } else if (e.target.id === 'keybinding') {
    e.preventDefault();
    if (
      e.key.toLowerCase() === 'control' ||
      e.key.toLowerCase() === 'shift' ||
      e.key.toLowerCase() === 'alt'
    )
      return;
    let str = '';
    if (e.ctrlKey) str += 'ctrl+';
    if (e.shiftKey) str += 'shift+';
    if (e.altKey) str += 'alt+';
    str += e.key.toLowerCase();
    values[e.target.id] = e.target.value ? `${e.target.value} ${str}` : str;
    e.target.value = values[e.target.id];

    setTimeout(() => moveCursorToEnd(e.target, values[e.target.id].length), 0);
  } else {
    values[e.target.id] = e.target.value;
  }

  let background, pasteToTerminal, container;
  container = e.target;

  for (let _ of new Array(5)) {
    if (container.id === 'shortcut-dialog-content') {
      break;
    } else {
      container = container.parentElement;
    }
  }

  for (let child of container.children) {
    if (child.id === 'background') {
      background = child;
    } else if (
      child.nodeName === 'LABEL' &&
      child.children[0].id === 'background'
    ) {
      background = child.children[0];
    }
  }

  for (let child of container.children) {
    if (child.id === 'behaviour' && child.value === 'paste to terminal') {
      background.checked = false;
      background.disabled = true;
      pasteToTerminal = true;
    } else if (
      child.nodeName === 'DIV' &&
      child.children[0].id === 'behaviour' &&
      child.children[0].value === 'paste to terminal'
    ) {
      background.checked = false;
      values.background = false;
      background.disabled = true;
      pasteToTerminal = true;
    }
  }

  if (!pasteToTerminal) background.disabled = false;

  return { values };
};

/**
 * Function to open dialog
 * @param {*} key
 * @param {*} queryShortcuts
 * @returns
 */
export const openDialog = (key, queryShortcuts) => {
  const queryShortcut = queryShortcuts[key];

  const values = {
    query: queryShortcut?.query ? queryShortcut?.query : '',
    keybinding: queryShortcut?.query ? key : '',
    behaviour: queryShortcut?.behaviour
      ? queryShortcut?.behaviour
      : 'run as soon as possible',
    background: queryShortcut?.background ? queryShortcut?.background : false,
  };

  vars.currentDialogKeyBinding = key;

  return { values, dialogOpen: true };
};

/**
 * Function to close dialog
 * @returns
 */
export const closeDialog = () => {
  const values = {};
  vars.currentDialogKeyBinding = '';
  return { values, dialogOpen: false };
};

/**
 * Function to build property columns
 * @param {*} searchString
 * @param {*} queryShortcuts
 * @returns
 */
export const buildPropertyColumns = (searchString, queryShortcuts) => {
  if (queryShortcuts) {
    let shortcutEntries = Object.entries(queryShortcuts);
    shortcutEntries = shortcutEntries.filter(entry =>
      entry[1].query.startsWith(searchString),
    );
    const queries = [];
    const keybindings = [];
    const behaviours = [];
    const backgrounds = [];

    shortcutEntries.forEach((entry, index) => {
      if (index === 0) {
        queries.push('Query', entry[1].query);
        keybindings.push('Keybinding', entry[0]);
        behaviours.push('Behaviour', entry[1].behaviour);
        backgrounds.push('Background', entry[1].background);
      } else {
        queries.push(entry[1].query);
        keybindings.push(entry[0]);
        behaviours.push(entry[1].behaviour);
        backgrounds.push(entry[1].background);
      }
    });

    let result = {
      queries,
      keybindings,
      behaviours,
      backgrounds,
    };
    return result;
  } else {
    return {};
  }
};

/**
 * Function to move cursor to the end
 * @param {*} el
 * @param {*} len
 */
export const moveCursorToEnd = (el, len) => {
  el.focus();
  el.setSelectionRange(len, len);
  el.scrollLeft = el.scrollWidth;
};

/**
 * Function to clear keybinding input
 * @param {*} e
 * @param {*} values
 * @returns
 */
export const clearKeybindingInput = (e, values) => {
  e.target.parentElement.parentElement.children[0].value = '';
  e.target.parentElement.parentElement.parentElement.children[0].value = ''; //hack to make sure the input field is cleared
  values['keybinding'] = '';
  return values;
};
