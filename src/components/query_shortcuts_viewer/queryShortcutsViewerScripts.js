export const collectShortcutDialogValues = current => {
  console.log('collectShortcutDialogValues: current is ', current);
  const command = current.children[0].value;
  const keybinding = current.children[1].value;
  const behaviour = current.children[2].value;
  const background = current.children[3].checked;
  const shortcut = {
    [keybinding]: {
      command,
      behaviour,
      background,
    },
  };
  console.log('shortcutobj collected: ', shortcut);
  return shortcut;
};
