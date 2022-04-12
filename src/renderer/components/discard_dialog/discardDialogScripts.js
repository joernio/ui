import { saveFile } from '../../assets/js/utils/scripts';

export const handleSave = async (path, callback) => {
  await saveFile(path);
  callback();
  return { openDiscardDialog: false, callback: () => {} };
};

export const handleDiscard = (path, openFiles, callback, setOpenFiles) => {
  openFiles = { ...openFiles };
  openFiles[path] = true;
  setOpenFiles(openFiles);
  callback();
  return { openDiscardDialog: false, callback: () => {} };
};

export const handleCancel = () => {
  return { openDiscardDialog: false, callback: () => {} };
};
