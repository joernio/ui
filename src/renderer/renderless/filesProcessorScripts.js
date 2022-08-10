import {
	openFile,
	closeFile,
	openSyntheticFile,
	isFilePathInQueryResult,
	isQueryResultToOpenSynthFile,
	isQueryResultToCloseSynthFile,
	getActiveProject,
	debounce,
	deepClone,
} from '../assets/js/utils/scripts';
import { editorShouldGoToLine } from '../views/editor_window/editorScripts';
import { vars as binaryViewerVars } from '../components/binary_viewer/binaryViewerScripts';
import { store } from '../store/configureStore';
import { setBinaryViewerCache } from '../store/actions/filesActions';
import { joernBinaryLanguage } from '../assets/js/utils/defaultVariables';

export const processFiles = async props => {
	const result_keys = Object.keys(props.results);
	const latest = props.results[result_keys[result_keys.length - 1]];

	const file_path = isFilePathInQueryResult(latest);
	file_path && (await openFile(file_path));
	file_path && editorShouldGoToLine();

	const { synth_file_path, content } = await isQueryResultToOpenSynthFile(
		latest,
	);

	synth_file_path && content && openSyntheticFile(synth_file_path, content);

	const paths_to_close = await isQueryResultToCloseSynthFile();

	const paths_to_close_promises = [];

	paths_to_close.forEach(path => {
		paths_to_close_promises.push(closeFile(path));
	});

	await Promise.all(paths_to_close_promises);

	if (
		latest?.query?.startsWith('importCode.ghidra') &&
		latest.result?.stdout
	) {
		// if the latest result is an import of a binary project, clear binaryViewerCache
		store.dispatch(
			setBinaryViewerCache({
				filePath: '',
				selectedMethodIndex: null,
				selectedMethodBinary: '',
				methods: [],
			}),
		);
	}
};

export const processMethodListForBinaryProjects = circuit_ui_responses => {
	const activeProject = getActiveProject();
	if (
		!activeProject?.language ||
		activeProject.language !== joernBinaryLanguage
	)
		return;

	const lastIndex = circuit_ui_responses.indexes.length - 1;
	const item = circuit_ui_responses.indexes[lastIndex];

	if (
		item?.res_type === 'query' &&
		circuit_ui_responses.all[item.block_id].ui_query.value.includes(
			'cpg.method.l',
		)
	) {
		const filePath = activeProject.inputPath || '';
		binaryViewerVars.initQuerySent = true;
		binaryViewerVars.tempMethods = [];
		binaryViewerVars.tempMethodsNameIndexMapping = {};
		store.dispatch(
			setBinaryViewerCache({
				filePath,
				selectedMethodIndex: null,
				methodBinaries: {},
				methods: [],
				methodsNameIndexMapping: {},
				textSelectionRange: { startLine: null, endLine: null },
			}),
		);

		binaryViewerVars.debouncedSetBinaryViewerCache = debounce(args => {
			binaryViewerVars.initQuerySent = false;
			binaryViewerVars.debouncedSetBinaryViewerCache = null;
			binaryViewerVars.tempMethods = [];
			binaryViewerVars.tempMethodsNameIndexMapping = {};
			store.dispatch(setBinaryViewerCache({ ...args }));
		}, 5000);
	} else if (
		item?.res_type === 'stdout' &&
		circuit_ui_responses.all[item.block_id].ui_query.value.includes(
			'cpg.method.l',
		)
	) {
		const value =
			circuit_ui_responses.all[item.block_id]['ui_response']['responses'][
				item.sub_block_id
			].value;
		const method = {
			index: binaryViewerVars.tempMethods.length,
			value: deepClone(value),
		};

		binaryViewerVars.tempMethods = [
			...binaryViewerVars.tempMethods,
			method,
		];
		if (!binaryViewerVars.tempMethodsNameIndexMapping[value.name]) {
			binaryViewerVars.tempMethodsNameIndexMapping[value.name] =
				method.index;
		}

		if (binaryViewerVars.debouncedSetBinaryViewerCache) {
			const { binaryViewerCache } = store.getState().files;
			binaryViewerVars.debouncedSetBinaryViewerCache({
				...binaryViewerCache,
				methods: binaryViewerVars.tempMethods,
				methodsNameIndexMapping:
					binaryViewerVars.tempMethodsNameIndexMapping,
			});
		}
	} else if (
		item?.res_type === 'stdout' &&
		circuit_ui_responses.all[item.block_id].ui_query.value
			.split('cpg.method.name("')[1]
			?.split('").call.code.p')[0]
	) {
		const method_name = circuit_ui_responses.all[
			item.block_id
		].ui_query.value
			.split('cpg.method.name("')[1]
			.split('").call.code.p')[0];
		const value =
			circuit_ui_responses.all[item.block_id]['ui_response']['responses'][
				item.sub_block_id
			].value;
		let cleaned_value = null;

		if (!cleaned_value) {
			cleaned_value = value
				.split(/List\(\n *"/)[1]
				?.split('"\n)\n</pre>')[0]
				?.replaceAll(/",\n *"/g, '\n');
		}

		if (!cleaned_value) {
			cleaned_value = value
				.split('List("')[1]
				?.split('")\n</pre>')[0]
				?.replaceAll('", "', '\n');
		}

		if (!cleaned_value) {
			cleaned_value = value.split('List(')[1]?.split(/\)\n?<\/pre>/)[0];
		}

		if (method_name && cleaned_value) {
			const { binaryViewerCache } = store.getState().files;
			const index =
				binaryViewerCache.methodsNameIndexMapping[method_name];
			const methodBinaries = deepClone(binaryViewerCache.methodBinaries);
			methodBinaries[method_name] = cleaned_value;
			store.dispatch(
				setBinaryViewerCache({
					...binaryViewerCache,
					methodBinaries,
					selectedMethodIndex: index,
				}),
			);
		}
	}
};

// import fs from 'fs';
// import { getDirectories } from '../assets/js/utils/scripts';

// export const getOpenProjectInputPath = workspace => {
//   const { projects } = workspace;
//   let path = null;

//   projects &&
//     Object.keys(projects).forEach(name => {
//       if (projects[name].open) {
//         path = projects[name].inputPath;
//       }
//     });

//   let root = path ? path.split('/') : null;
//   root = root ? root[root.length - 1] : null;

//   return { path, root };
// };

// export const isFileInOpenFiles = (file_path, openFiles) => {
//   if (file_path) {
//     return Object.keys(openFiles).includes(file_path);
//   } else {
//     return true;
//   }
// };

// export const getFilePathToOpen = async workspace => {
//   const { path: inputPath } = getOpenProjectInputPath(workspace);
//   let file_path;

//   if (inputPath) {
//     await getDirectories(inputPath)
//       .then(async paths => {
//         let promisesArr = [];

//         for (let path of paths) {
//           if (!file_path) {
//             let promise = new Promise((resolve, reject) => {
//               fs.stat(path, (err, stats) => {
//                 if (!err) {
//                   resolve(stats);
//                 } else {
//                   reject(err);
//                 }
//               });
//             })
//               .then(stats => {
//                 if (stats.isFile()) {
//                   file_path = path;
//                 }
//               })
//               .catch(err => {
//                 console.log('error getting path stats', err);
//               });

//             promisesArr.push(promise);
//           }
//         }

//         await Promise.any(promisesArr);
//       })
//       .catch(err => {
//         console.log('error getting path directories', err);
//       });
//   }

//   return file_path;
// };
