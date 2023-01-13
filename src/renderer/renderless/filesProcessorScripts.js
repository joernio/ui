import { resolve } from 'path';
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
	pathStats,
	handleSetToast,
	fsWriteFile,
	getTriageId,
} from '../assets/js/utils/scripts';
import { editorShouldGoToLine } from '../views/editor_window/editorScripts';
import { vars as binaryViewerVars } from '../components/binary_viewer/binaryViewerScripts';
import { store } from '../store/configureStore';
import { setRulesConfigFilePath } from '../store/actions/settingsActions';
import { setBinaryViewerCache } from '../store/actions/filesActions';
import { setFindings } from '../store/actions/findingsActions';
import {
	joernBinaryLanguage,
	defaultRulesConfigFilePath,
	defaultRulesConfigFileContent,
} from '../assets/js/utils/defaultVariables';

import finding0 from '../assets/js/utils/temp_findings/0_findings.json';
import finding5 from '../assets/js/utils/temp_findings/5_findings.json';
import finding10 from '../assets/js/utils/temp_findings/10_findings.json';
import finding15 from '../assets/js/utils/temp_findings/15_findings.json';
import finding20 from '../assets/js/utils/temp_findings/20_findings.json';
import finding25 from '../assets/js/utils/temp_findings/25_findings.json';
import finding30 from '../assets/js/utils/temp_findings/30_findings.json';
import finding35 from '../assets/js/utils/temp_findings/35_findings.json';

const temp_findings = {
	finding0,
	finding5,
	finding10,
	finding15,
	finding20,
	finding25,
	finding30,
	finding35,
};

export const ensureRulesConfigFileExists = async () => {
	const { rulesConfigFilePath } = store.getState().settings;
	const stat = await pathStats(rulesConfigFilePath).catch(err => err);
	if (stat?.isDirectory && stat.isDirectory()) {
		fsWriteFile(
			resolve(rulesConfigFilePath, 'rules-config.json'),
			defaultRulesConfigFileContent,
		)
			.then(() => {
				handleSetToast({
					icon: 'info-sign',
					intent: 'warning',
					message: `rules-config.json file was created inside "${rulesConfigFilePath}" directory`,
				});
				store.dispatch(
					setRulesConfigFilePath(
						resolve(rulesConfigFilePath, 'rules-config.json'),
					),
				);
			})
			.catch(err => {
				handleSetToast({
					icon: 'warning-sign',
					intent: 'danger',
					message: `attempted to create rules-config.json inside "${rulesConfigFilePath}" directory but failed. ${err}`,
				});
			});
	} else if (typeof stat.errno === 'number') {
		handleSetToast({
			icon: 'warning-sign',
			intent: 'danger',
			message: `rules config file path "${rulesConfigFilePath}" doesn't exist`,
		});

		if (!rulesConfigFilePath) {
			store.dispatch(setRulesConfigFilePath(defaultRulesConfigFilePath));
			handleSetToast({
				icon: 'warning-sign',
				intent: 'warning',
				timeout: 6000, // by default timeout is 4000, but this is set to 6000 to allow the top toast to close first.
				message: `resetted rules config file path to default "${defaultRulesConfigFilePath}"`,
			});
		} else if (rulesConfigFilePath === defaultRulesConfigFilePath) {
			fsWriteFile(rulesConfigFilePath, defaultRulesConfigFileContent)
				.then(() => {
					handleSetToast({
						icon: 'info-sign',
						intent: 'success',
						message: `default rules config file "${rulesConfigFilePath}" was successfully created`,
					});
				})
				.catch(err => {
					handleSetToast({
						icon: 'warning-sign',
						intent: 'danger',
						message: `attempted to create default rules config file "${rulesConfigFilePath}" but failed. ${err}`,
					});
				});
		}
	}
};

export const processTriageTemp = () => {
	// NOTE this function is heavily modified and doesn't behave at all like it will be when we are finally able to get
	// cpg.finding.toJsonPretty from the backend
	let findings = store.getState().findings;
	const file_id = findings.triage_ids.length * 5;
	if (file_id <= 35) {
		const finding = temp_findings[`finding${file_id}`];
		findings = deepClone(findings);
		findings.open_sarif_finding_path = '';
		// TODO remove first array in triage_ids if triage_ids is up to 10
		findings.triage_ids.push([]);

		for (let i = finding.length - 5; i < finding.length; i += 1) {
			const triage_id = getTriageId(finding[i]);
			const triage = {
				valid: true,
				finding: finding[i],
			};
			findings.triages[triage_id] = triage;
			findings.triage_ids[findings.triage_ids.length - 1].push(triage_id);
			store.dispatch(setFindings(findings));
		}
	}
};

export const processTriage = next_findings => {
	let findings = store.getState().findings;

	const new_findings = [];
	next_findings.forEach(finding => {
		const triage_id = getTriageId(finding);
		if (!findings.triages[triage_id]) {
			new_findings.push(finding);
		}
	});

	if (new_findings.length) {
		findings = deepClone(findings);
		findings.open_sarif_finding_path = '';

		if (findings.triage_ids.length >= 10) findings.triage_ids.shift(); // remove the first item in the array;
		findings.triage_ids.push([]);

		new_findings.forEach(finding => {
			const triage_id = getTriageId(finding);
			const triage = {
				valid: true,
				finding,
			};
			findings.triages[triage_id] = triage;
			findings.triage_ids[findings.triage_ids.length - 1].push(triage_id);
		});

		store.dispatch(setFindings(findings));
	}
};

export const processFiles = async results => {
	const result_keys = Object.keys(results);
	const latest = results[result_keys[result_keys.length - 1]];

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

export const processScriptsTemp = scriptsResults => {
	const result_keys = Object.keys(scriptsResults);
	const latest = scriptsResults[result_keys[result_keys.length - 1]];

	let proceed;

	if (
		latest?.origin === 'script' ||
		(latest?.post_query_uuid && latest?.project)
	) {
		proceed = true;
	}

	if (
		latest?.query?.startsWith('cpg.finding.toJsonPretty') &&
		latest.result?.stderr &&
		latest.t_0 &&
		latest.t_1 &&
		proceed
	) {
		// TODO remember to change stderr here to stdout
		// console.log(latest.result?.stderr);
		setTimeout(processTriageTemp, 0);
	}
};

export const processScripts = scriptsResults => {
	const result_keys = Object.keys(scriptsResults);
	const latest = scriptsResults[result_keys[result_keys.length - 1]];
	let proceed;

	if (
		latest?.origin === 'script' ||
		(latest?.post_query_uuid && latest?.project)
	) {
		proceed = true;
	}

	if (
		latest?.query?.startsWith('cpg.finding.toJsonPretty') &&
		latest.result?.stdout &&
		latest.t_0 &&
		latest.t_1 &&
		proceed
	) {
		let json = latest.result.stdout.split('"""');
		json = `${json[1]}`;
		setTimeout(() => processTriage(JSON.parse(json)), 0);
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
