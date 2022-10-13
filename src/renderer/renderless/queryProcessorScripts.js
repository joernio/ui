import {
	getScriptResult,
	handleSetToast,
	isScriptQueryResultToOpenSynthFile,
	openSyntheticFile,
	deepClone,
} from '../assets/js/utils/scripts';

export const shouldRunQuery = (prev_queue, queue, query) => {
	const prev_queue_count = prev_queue ? Object.keys(prev_queue).length : 0;
	const queue_count = Object.keys(queue).length;

	if (query && queue_count === 1) {
		return true;
	}
	if (query && prev_queue_count > queue_count && queue_count > 0) {
		return true;
	}
};

export const shouldAlertScriptRunSuccessful = (prev_results, results) => {
	const prev_uuids = Object.keys(prev_results);
	const uuids = Object.keys(results);

	const prev_last_script_result = getScriptResult(prev_uuids, prev_results);

	const last_script_result = getScriptResult(uuids, results);

	if (
		JSON.stringify(prev_last_script_result) !==
			JSON.stringify(last_script_result) &&
		(last_script_result.result.stdout ||
			last_script_result.result.stderr) &&
		!last_script_result.query.includes('import') &&
		last_script_result.t_0 &&
		last_script_result.t_1
	) {
		return last_script_result;
	}
	return false;
};

export const processScriptResult = async (
	prev_results,
	results,
	handleSetState,
) => {
	const script_result = shouldAlertScriptRunSuccessful(prev_results, results);

	if (script_result) {
		handleSetToast({
			icon: 'info-sign',
			intent: 'success',
			message: 'rule executed successfully',
		});

		const { synth_file_path, content } =
			await isScriptQueryResultToOpenSynthFile(script_result);
		synth_file_path &&
			content &&
			openSyntheticFile(synth_file_path, content);
	}
	// else {
	//   handleSetToast({
	// 		icon: 'warning-sign',
	// 		intent: 'danger',
	// 		message: 'rule execution failed',
	// 	});
	// }

	handleSetState({
		prev_results: results ? deepClone(results) : {},
	});
};
