import { saveFile } from '../../assets/js/utils/scripts';

/**
 * saves file
 * @param {*} path
 * @param {*} callback
 * @returns object
 */
export const handleSave = async (path, callback) => {
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
 * @returns object
 */
export const handleDiscard = (path, openFiles, callback, setOpenFiles) => {
	openFiles = { ...openFiles };
	openFiles[path] = true;
	setOpenFiles(openFiles);
	callback();
	return { openDiscardDialog: false, callback: () => {} };
};

export const handleCancel = () => ({
	openDiscardDialog: false,
	callback: () => {},
});
