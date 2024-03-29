import {
	getDirectories,
	handleSetToast,
	getUIIgnoreArr,
	pathStats,
} from '../../assets/js/utils/scripts';
import { selectDirApi } from '../../assets/js/utils/ipcRenderer';
import { store } from '../../store/configureStore';

export const chokidarVars = {
	chokidarWatcher: null,
	chokidarConfig: (src, ignore) => ({
		ignored: [...getUIIgnoreArr(src, ignore)],
		awaitWriteFinish: {
			stabilityThreshold: 2000,
			pollInterval: 100,
		},
		ignorePermissionErrors: true,
	}),
};

export const handleToggleFoldersVisible = foldersVisible => ({
	foldersVisible: !foldersVisible,
});

export const shouldSwitchFolder = (prev_projects, projects) => {
	if (
		Object.keys(projects ? projects : {}).length ===
		Object.keys(prev_projects ? prev_projects : {}).length
	) {
		let notEqual = false;

		Object.keys(projects ? projects : {}).forEach(name => {
			if (projects[name]?.open !== prev_projects[name]?.open) {
				notEqual = true;
			}
		});

		Object.keys(prev_projects ? prev_projects : {}).forEach(name => {
			if (projects[name]?.open !== prev_projects[name]?.open) {
				notEqual = true;
			}
		});

		return notEqual;
	}
	return true;
};

const fsToJson = (arr, base, isFile) => {
	let nestedArr = base;
	let pathToDir = '';

	arr.forEach((asset, i) => {
		let index;

		nestedArr &&
			nestedArr.forEach((obj, i) => {
				if (obj.label === asset) {
					index = i;
				}
			});

		if (index === undefined && nestedArr) {
			if (i === arr.length - 1 && isFile) {
				nestedArr.push({
					className: 'folder',
					id: `${pathToDir}/${asset}`,
					icon: 'document',
					label: asset,
				});
			} else {
				nestedArr.push({
					className: 'folder',
					id: `${pathToDir}/${asset}`,
					hasCaret: true,
					isExpanded: true,
					icon: 'folder-open',
					label: asset,
					childNodes: [],
				});
			}
		}

		pathToDir += `/${asset}`;
		nestedArr = nestedArr
			? nestedArr[index === undefined ? 0 : index]?.childNodes
			: [];
	});
};

export const getRoot = (folder_json_model, root) => {
	root = root.split('/');
	root = root[root.length - 1];

	while (Array.isArray(folder_json_model)) {
		const lastNode = folder_json_model[folder_json_model.length - 1];

		if (lastNode?.label === root) {
			return lastNode;
		}
		folder_json_model = lastNode?.childNodes;
	}
};

export const selectFolderStructureRootPath = async () => {
	selectDirApi.selectDir('select-dir');

	const path = await new Promise((resolve, reject) => {
		selectDirApi.registerListener('selected-dir', value => {
			if (value) {
				resolve(value);
			} else {
				reject();
			}
		});
	}).catch(() => {
		console.log("can't select workspace path"); // eslint-disable-line no-console
	});

	return { path };
};

export const createFolderJsonModel = async (obj, callback) => {
	const { path: root_path } = obj;
	const uiIgnoreArr = getUIIgnoreArr(
		'',
		store.getState().settings.uiIgnore,
	).map(str => str.split('/')[2]);

	if (root_path) {
		const paths = await getDirectories(root_path).catch(() => {});

		let counter = 0;
		const folder_json_model = [];
		let failed;

		if (Array.isArray(paths)) {
			paths.forEach(async path => {
				const stats = await pathStats(path).catch(() => {
					failed = true;
				});
				counter += 1;

				const isFile = stats?.isFile ? stats.isFile() : null;
				const arr = path.split('/').filter(value => !!value);

				if (
					uiIgnoreArr.filter(str => !!arr.includes(str)).length === 0
				) {
					fsToJson(arr, folder_json_model, isFile);
				}

				if (counter === paths.length) {
					const root = getRoot(folder_json_model, root_path);
					callback([root], root_path);
				}
			});

			if (failed) {
				handleSetToast({
					icon: 'warning-sign',
					intent: 'danger',
					message:
						'error opening folder. Make sure that this folder is healthy then try again.',
				});
			}
		}
	}
};
