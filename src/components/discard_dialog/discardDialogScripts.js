import { saveFile } from '../../assets/js/utils/scripts';

/**
 * saves file
 * @param {*} path
 * @param {*} callback
 * @returns
 */
export const handleSave = async (path, callback) => {
  console.log('handleSave: ', { path, callback });
  await saveFile(path);
  callback();
  return { openDiscardDialog: false, callback: () => {} };
};

/**
 * discards file
 * @param {*} path
 * @param {*} openFiles
 * @param {*} callback
 * @param {*} setOpenFiles
 * @returns
 */
export const handleDiscard = (path, openFiles, callback, setOpenFiles) => {
  console.log('handleDiscard: ', { path, openFiles, callback, setOpenFiles });
  openFiles = { ...openFiles };
  openFiles[path] = true;
  setOpenFiles(openFiles);
  callback();
  return { openDiscardDialog: false, callback: () => {} };
};

/**
 * cancel file
 * @returns
 */
export const handleCancel = () => {
  console.log('handleCancel =>');
  return { openDiscardDialog: false, callback: () => {} };
};
