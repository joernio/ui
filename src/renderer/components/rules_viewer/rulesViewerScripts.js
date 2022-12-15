import isEqual from 'lodash/isEqual';
import isString from 'lodash/isString';
import {
	getUIIgnoreArr,
	pathStats,
	openFile,
	readFile,
	handleSetToast,
	generateScriptImportQuery,
} from '../../assets/js/utils/scripts';
import { store } from '../../store/configureStore';
import { enQueueScriptsQuery } from '../../store/actions/queryActions';

export const chokidarVars = {
	chokidarWatcher: null,
	chokidarConfig: (src, ignore) => ({
		ignored: [...getUIIgnoreArr('', ignore).map(str => str.split('/')[2])],
		awaitWriteFinish: {
			stabilityThreshold: 2000,
			pollInterval: 100,
		},
		ignorePermissionErrors: true,
	}),
};

export const isSelectedConfig = (selected_keys, config) => selected_keys[config.index_in_configs] === config.id;

export const getSelectedConfigs = (selected_keys, configs) => {
	const keys = Object.keys(selected_keys);
	const selected_configs = [];
	keys.forEach(key => {
		selected_keys[key] === configs.values[key].id &&
			selected_configs.push(configs.values[key]);
	});
	return selected_configs;
};

export const getRunAllButtonString = (selected_keys, configs) => {
	const selected_configs = getSelectedConfigs(selected_keys, configs);
	return selected_configs.length === 0
		? 'Run All'
		: `Run Selected (${selected_configs.length})`;
};

export const handleConfigCheckboxClick = (selected_keys, config) => {
	if (selected_keys[config.index_in_configs]) {
		selected_keys = { ...selected_keys };
		delete selected_keys[config.index_in_configs];
		return selected_keys;
	} else {
		return { ...selected_keys, [config.index_in_configs]: config.id };
	}
};

export const handleConfigClick = (e, selected_keys, config) => {
	if (e.ctrlKey) {
		return handleConfigCheckboxClick(selected_keys, config);
	} else {
		openFile(config.filename);
		return {
			[config.index_in_configs]: config.id,
		};
	}
};

export const rulesConfigFilePathIsValid = rulesConfigFilePath =>
	pathStats(rulesConfigFilePath)
		.then(stat => stat)
		.catch(err => err)
		.then(stat => {
			if (stat?.isFile && stat.isFile()) {
				return true;
			} else {
				return false;
			}
		});

export const validateConfigs = configs => {
	// ensure that configs is in the format we espect
	const keys = [
		'title',
		'id',
		'filename',
		'description',
		'tags',
		'languages',
	];
	const ids = {};
	if (configs.length === 0) throw new Error('rules configs is invalid');
	configs.forEach(config => {
		if (
			!isEqual(Object.keys(config), keys) ||
			!isString(config['title']) ||
			!isString(config['id']) ||
			!isString(config['filename']) ||
			!isString(config['description']) ||
			!Array.isArray(config['tags']) ||
			!Array.isArray(config['languages'])
		) {
			throw new Error('rules configs is invalid');
		}

		// ensure that ids are unique
		if (ids[config['id']]) throw new Error('rules configs is invalid');
		ids[config['id']] = true;
	});
	return configs;
};

export const getUniqueTags = (key, configs) => {
	const unique = {};
	configs.forEach(config => {
		config[key].forEach(value => {
			unique[value] = true;
		});
	});
	return unique;
};

export const filterConfigs = (tag, language, configs) => {
	const filtered_configs = [];

	configs.forEach((config, index) => {
		if (tag && !config.tags.includes(tag)) {
			config = null;
		}

		if (language && config && !config.languages.includes(language)) {
			config = null;
		}

		if (config) {
			filtered_configs.push({ index_in_configs: index, ...config });
		}
	});

	return filtered_configs;
};

export const extractRuleMainFunctionNameAndArgs = data => {
	let mainFunctionArgs;
	let mainFunctionName = data.split('@main')[1].split('def')[1];
	mainFunctionName = mainFunctionName.trim();
	[mainFunctionName, mainFunctionArgs] = mainFunctionName.split('(');
	mainFunctionArgs = mainFunctionArgs.split(')')[0];
	mainFunctionArgs = mainFunctionArgs
		.split(',')
		.filter(arg => !!(arg && arg !== ' '))
		.map(arg => arg.split(':')[0].trim());

	return [mainFunctionName, mainFunctionArgs];
};

export const runScript = async config => {
	const workspace_path = store.getState().workspace.path;
	if (config?.filename && workspace_path) {
		const query_string = await generateScriptImportQuery(
			config.filename,
			workspace_path,
		);

		if (query_string) {
			let filename = query_string.split('.');
			filename = filename[filename.length - 1];

			const importScriptQuery = {
				query: query_string,
				origin: 'script',
				ignore: true,
			};

			const runScriptQuery = {
				query: `${filename}.${config.main_function_name}()`,
				origin: 'script',
				ignore: true,
			};

			store.dispatch(enQueueScriptsQuery(importScriptQuery));
			setTimeout(() => {
				store.dispatch(enQueueScriptsQuery(runScriptQuery));
			}, 0);
			handleSetToast({
				icon: 'info-sign',
				intent: 'success',
				message: `executing rule ${config.id}...`,
				action: {
					onClick: () => {
						openFile(config.filename);
					},
					text: 'View rule',
				},
			});
      return true;// single that there was no errors while trying to run this script
		} else {
			handleSetToast({
				icon: 'warning-sign',
				intent: 'danger',
				message: `an error occured while executing rule ${config.id}.`,
				action: {
					onClick: () => {
						openFile(config.filename);
					},
					text: 'View rule',
				},
			});
		}
	} else if(!workspace_path) {

		handleSetToast({
			icon: 'warning-sign',
			intent: 'danger',
			message: (
      `error executing rule ${config.id}.
      There is no active project in your workspace.
      You need to "open" a project first before you can execute a rule`
      )
		});
	};
};

export const runSelectedConfigs = async selected_configs => {
  const run_script_status_arr = await Promise.all(
		selected_configs.map(config =>
			readFile(config.filename)
				.then(data => {
					if (data.search(/^(?:\s*)@main|(?:\n\s*)@main/) > -1) {
						const [main_function_name] =
							extractRuleMainFunctionNameAndArgs(data);
						return {
							...config,
							main_function_name,
						};
					} else {
            handleSetToast({
              icon: 'warning-sign',
              intent: 'danger',
              message: `config ${config.id}: rule has no "main" function.`,
              action: {
                onClick: () => {
                  openFile(config.filename);
                },
                text: 'View rule',
              },
            });
					}
				})
				.then(config => runScript(config))
        .catch(err=>{
          handleSetToast({
            icon: 'warning-sign',
            intent: 'danger',
            message: String(err)
          });
        })
		),
	);

  let should_get_findings = false;
  run_script_status_arr.forEach(status=>{
    if(status === true){
      should_get_findings = true;
    }
  });

  const ruleResultPretty = {
    query: "cpg.finding.toJsonPretty",
    origin: 'script',
    ignore: true,
  };

  should_get_findings && setTimeout(() => {
    store.dispatch(enQueueScriptsQuery(ruleResultPretty));
  }, 0);
};

// export const populateArgsDialogFields = (modified_selected) => {
// 	const fields_arr = [];

// 	modified_selected.forEach(rule => {
// 			let filename = rule.filename.split('/');
// 			filename = filename[filename.length - 1];

// 			fields_arr.push({
// 				path,
// 				filename,
//         main_function_name: rule.main_function_name,
//         main_function_args: [...rule.main_function_args]
// 			});
// 	});

// 	return fields_arr;
// };

// export const runScript = async (path, args, mainFunctionName, props) => {
// 	const workspace_path = props.path;
// 	if (path && workspace_path) {
// 		openFile(path);

// 		const query_string = await generateScriptImportQuery(
// 			path,
// 			workspace_path,
// 		);

// 		if (query_string) {
// 			let filename = query_string.split('.');
// 			filename = filename[filename.length - 1];

// 			const importScriptQuery = {
// 				query: query_string,
// 				origin: 'script',
// 				ignore: true,
// 			};

// 			const runScriptQuery = {
// 				query: `${filename}.${mainFunctionName}(${formatArgs(args)})`,
// 				origin: 'script',
// 				ignore: true,
// 			};

// 			addToScriptsQueue(importScriptQuery, props);
// 			addToScriptsQueue(runScriptQuery, props);
// 			handleSetToast({
// 				icon: 'info-sign',
// 				intent: 'success',
// 				message: 'script running ...',
// 			});
// 		} else {
// 			handleSetToast({
// 				icon: 'warning-sign',
// 				intent: 'danger',
// 				message: 'an error occured while running script',
// 			});
// 		}
// 	} else {
// 		handleSetToast({
// 			icon: 'warning-sign',
// 			intent: 'danger',
// 			message: 'an error occured while running script',
// 		});
// 	}
// };

// export const runSelected = async (
// 	dialogFields,
// 	selected,
// 	organised_scripts,
// 	props,
// ) => {
// 	const paths = Object.keys(selected);
// 	const scripts = organisedScriptsToScripts(organised_scripts);
// 	const promises = [];

// 	for (let i = 0; i < paths.length; i += 1) {
// 		const args = dialogFields.filter(script => script.path === paths[i])[0]
// 			?.mainFunctionArgs;
// 		const { mainFunctionName } = scripts[paths[i]];
// 		promises.push(runScript(paths[i], args || [], mainFunctionName, props));
// 	}

// 	await Promise.all(promises);
// };

// export const populateArgsDialogFields = (modified_selected) => {
// 	const fields_arr = [];

// 	modified_selected.forEach(rule => {
// 			let filename = rule.filename.split('/');
// 			filename = filename[filename.length - 1];

// 			fields_arr.push({
// 				path,
// 				filename,
//         main_function_name: rule.main_function_name,
//         main_function_args: [...rule.main_function_args]
// 			});
// 	});

// 	return fields_arr;
// };

// export const extractRuleMainFunctionNameAndArgs = data => {
// 	let mainFunctionArgs;
// 	let mainFunctionName = data.split('@main')[1].split('def')[1];
// 	mainFunctionName = mainFunctionName.trim();
// 	[mainFunctionName, mainFunctionArgs] = mainFunctionName.split('(');
// 	mainFunctionArgs = mainFunctionArgs.split(')')[0];
// 	mainFunctionArgs = mainFunctionArgs
// 		.split(',')
// 		.filter(arg => !!(arg && arg !== ' '))
// 		.map(arg => arg.split(':')[0].trim());

// 	return [mainFunctionName, mainFunctionArgs];
// };

// export const includeFunctionNameAndArgs = async selected_from_config => {
// 		return Promise.all(
// 			selected_from_config.map(rule =>
// 				readFile(rule.filename).then(data => {
// 					if (data.search(/^(?:\s*)@main|(?:\n\s*)@main/) > -1) {
// 						const [main_function_name, main_function_args] = extractRuleMainFunctionNameAndArgs(data);
// 						return {
//               ...rule,
//               main_function_name,
//               main_function_args
//             }
// 					}
// 				}),
// 			),
// 		);
// };

// export const mainRulesFunctionsTakeArgs = modified_selected => {
// 	let takes_args = false;

//   modified_selected.forEach(rule=>{
//     if(rule.main_function_args.length > 0){
//       takes_args = true;
//     }
//   });

// 	return takes_args;
// };

// export const handleRun = async (selected, scripts, handleSetState) => {

//   const modified_selected = includeFunctionNameAndArgs(selected);

//   if (mainRulesFunctionsTakeArgs(modified_selected)) {
//     return {
//       dialogFields: populateArgsDialogFields(
//         Object.keys(selected),
//         scripts,
//       ),
//       openDialog: true,
//     };
//   }
//   runSelected([], selected, scripts, props);
// };
