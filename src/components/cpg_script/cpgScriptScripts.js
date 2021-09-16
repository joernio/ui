import { openFile } from '../../assets/js/utils/scripts';

export const handleOpenScript = (e, path, selected) => {
  if (path) {
    openFile(path);
    if (e.ctrlKey) {
      selected[path] = true;
    } else {
      selected = { [path]: true };
    }
    return { selected };
  }
};

export const shouldOpenScriptsContextMenu = (selected, handleSetState) => {
  if (Object.keys(selected).length > 1) {
    handleSetState({ scriptsMenuIsOpen: true });
  }
};
