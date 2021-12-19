export const shouldRunQuery = (prev_queue, queue, query) => {
  const prev_queue_count = prev_queue ? Object.keys(prev_queue).length : 0;
  const queue_count = Object.keys(queue).length;

  if (query && queue_count === 1) {
    return true;
  } else if (query && prev_queue_count > queue_count && queue_count > 0) {
    return true;
  }
};

export const shouldAlertScriptRunSuccessful = (prev_results, results) => {
  let prev_last_script_result, last_script_result;
  let prev_uuids = Object.keys(prev_results);
  let uuids = Object.keys(results);

  for (let i = prev_uuids.length - 1; i >= 0; i--) {
    if (prev_results[prev_uuids[i]].origin === 'script') {
      prev_last_script_result = prev_results[prev_uuids[i]];
      break;
    }
  }

  for (let i = uuids.length - 1; i >= 0; i--) {
    if (results[uuids[i]].origin === 'script') {
      last_script_result = results[uuids[i]];
      break;
    }
  }

  console.log(
    'prev_last_script_result: ',
    JSON.stringify(prev_last_script_result),
    ' last_script_result: ',
    JSON.stringify(last_script_result),
  );

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
