import {
  getScriptResult,
  handleSetToast,
  isScriptQueryResultToOpenSynthFile,
  openSyntheticFile,
} from '../assets/js/utils/scripts';

/**
 * Check if query should run
 * @param {*} prev_queue
 * @param {*} queue
 * @param {*} query
 * @returns a boolean value indication if query should run
 */
export const shouldRunQuery = (prev_queue, queue, query) => {
  console.log('shouldRunQuery: ', { prev_queue, queue, query });
  const prev_queue_count = prev_queue ? Object.keys(prev_queue).length : 0;
  const queue_count = Object.keys(queue).length;

  if (query && queue_count === 1) {
    return true;
  } else if (query && prev_queue_count > queue_count && queue_count > 0) {
    return true;
  }
};

/**
 * Indicate when a script has successfully run
 * @param {*} prev_results
 * @param {*} results
 * @returns
 */
export const shouldAlertScriptRunSuccessful = (prev_results, results) => {
  console.log('shouldAlertScriptRunSuccessful: ', { prev_results, results });
  let prev_last_script_result, last_script_result;
  let prev_uuids = Object.keys(prev_results);
  let uuids = Object.keys(results);

  prev_last_script_result = getScriptResult(prev_uuids, prev_results);

  last_script_result = getScriptResult(uuids, results);

  if (
    JSON.stringify(prev_last_script_result) !==
      JSON.stringify(last_script_result) &&
    (last_script_result.result.stdout || last_script_result.result.stderr) &&
    !last_script_result.query.includes('import') &&
    last_script_result.t_0 &&
    last_script_result.t_1
  ) {
    return last_script_result;
  } else {
    return false;
  }
};

/**
 * process script result
 * @param {*} prev_results
 * @param {*} results
 * @param {*} handleSetState
 */
export const processScriptResult = async (
  prev_results,
  results,
  handleSetState,
) => {
  console.log('processScriptResult: ', {
    prev_results,
    results,
    handleSetState,
  });
  const script_result = shouldAlertScriptRunSuccessful(prev_results, results);

  if (script_result) {
    handleSetToast({
      icon: 'info-sign',
      intent: 'success',
      message: 'script ran successfully',
    });

    const { synth_file_path, content } =
      await isScriptQueryResultToOpenSynthFile(script_result);
    synth_file_path && content && openSyntheticFile(synth_file_path, content);
  }

  handleSetState({
    prev_results: results ? JSON.parse(JSON.stringify(results)) : {},
  });
};
