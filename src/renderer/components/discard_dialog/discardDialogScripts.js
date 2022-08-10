import { saveFile, deepClone } from '../../assets/js/utils/scripts';
import { store } from '../../store/configureStore';
import { setDiscardDialog } from '../../store/actions/statusActions';
import { setOpenFiles } from '../../store/actions/filesActions';

export const handleSave = async callback => {
	const { openFilePath } = deepClone(store.getState().files);
	await saveFile(openFilePath);
	callback();
	store.dispatch(
		setDiscardDialog({
			open: false,
			callback: () => {},
		}),
	);
};

export const handleDiscard = callback => {
	const { openFiles, openFilePath } = deepClone(store.getState().files);
	openFiles[openFilePath] = true;
	store.dispatch(setOpenFiles(openFiles));
	callback();
	store.dispatch(
		setDiscardDialog({
			open: false,
			callback: () => {},
		}),
	);
};

export const handleCancel = () => {
	store.dispatch(
		setDiscardDialog({
			open: false,
			callback: () => {},
		}),
	);
};
