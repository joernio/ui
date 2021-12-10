import { handleSetToast } from '../../assets/js/utils/scripts';
const vars = {
  currentDialogKeyBinding: '',
};

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

export const handleSaveQueryShortcut = (values, queryShortcuts, props) => {
  if (collectQueryShortcutValues(values)) {
    props.setQueryShortcuts(deleteQueryShorcut(null, queryShortcuts));
    props.setQueryShortcuts(collectQueryShortcutValues(values));
    return closeDialog();
  }
};

export const deleteQueryShorcut = (key, queryShortcuts) => {
  if (key) {
    delete queryShortcuts[key];
  } else {
    delete queryShortcuts[vars.currentDialogKeyBinding];
  }

  queryShortcuts = { ...queryShortcuts };
  return queryShortcuts;
};

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

export const closeDialog = () => {
  const values = {};
  vars.currentDialogKeyBinding = '';
  return { values, dialogOpen: false };
};

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

// export const resizeHandler = (
//   diff,
//   key,
//   el,
//   {
//     queryColumnWidth,
//     keybindingColumnWidth,
//     behaviourColumnWidth,
//     backgroundColumnWidth,
//   },
// ) => {
//   const total = {
//     queryColumnWidth,
//     keybindingColumnWidth,
//     behaviourColumnWidth,
//     backgroundColumnWidth,
//   };
//   const { width: columnWidth } = el.parentElement.getBoundingClientRect();
//   const { width: containerWidth } =
//     el.parentElement.parentElement.getBoundingClientRect();
//   const percentageValue = ((columnWidth - diff) / containerWidth) * 100;
//   const percentageDiff = (diff / containerWidth) * 100;
//   const otherColumnsOfInterest = [];
//   const entries = Object.entries(total);

//   console.log(
//     ' diff: ',
//     diff,
//     ' key: ',
//     key,
//     ' containerWidth: ',
//     containerWidth,
//     ' columnWidth: ',
//     columnWidth,
//     '  percentageValue: ',
//     percentageValue,
//     '  percentageDiff: ',
//     percentageDiff,
//     ' entries: ',
//     entries,
//   );

//   if (diff < 0) {
//     for (let entry of entries) {
//       if (entry[0] === key) break;
//       otherColumnsOfInterest.unshift(entry);
//     }
//   } else if (diff > 0) {
//     const key_entry = entries.filter(entry => entry[0] === key);
//     for (let entry of entries) {
//       if (entries.indexOf(entry) > entries.indexOf(key_entry)) {
//         otherColumnsOfInterest.push(entry);
//       }
//     }
//   } else if (diff === 0) return {};

//   console.log('otherColumns: ', JSON.stringify(otherColumnsOfInterest));

//   const copy = [...otherColumnsOfInterest];

//   for (let index = 0; index < otherColumnsOfInterest.length; index++) {
//     console.log(
//       'inside the for loop: ',
//       otherColumnsOfInterest[index],
//       ' percentage caculation: ',
//       (otherColumnsOfInterest[index][1] * containerWidth) / 100,
//     );
//     if ((otherColumnsOfInterest[index][1] * containerWidth) / 100 > 100) {
//       const entry_key = otherColumnsOfInterest[index][0];
//       const entry_value = otherColumnsOfInterest[index][1] + percentageDiff;
//       otherColumnsOfInterest[index] = [entry_key, entry_value];
//       break;
//     }
//   }

//   if (JSON.stringify(otherColumnsOfInterest) === JSON.stringify(copy))
//     return {};

//   otherColumnsOfInterest.push([key, percentageValue]);

//   const temp = { ...total, ...Object.fromEntries(otherColumnsOfInterest) };
//   console.log('result is ', JSON.stringify(temp));
//   console.log(
//     'total width: ',
//     Object.values(temp).reduce((a, b) => a + b),
//     '%',
//   );
//   return temp;
// };

export const moveCursorToEnd = (el, len) => {
  el.focus();
  el.setSelectionRange(len, len);
  el.scrollLeft = el.scrollWidth;
};

export const parseKeyBinding = keybinding => {
  keybinding = keybinding.split('+').reduce((acc, val) => {
    acc.push(val);
    acc.push('+');
    return acc;
  }, []);

  keybinding.pop();

  for (let i = 0; i < keybinding.length; i++) {
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

export const clearKeybindingInput = (e, values) => {
  e.target.parentElement.parentElement.children[0].value = '';
  e.target.parentElement.parentElement.parentElement.children[0].value = ''; //hack to make sure the input field is cleared
  values['keybinding'] = '';
  return values;
};
