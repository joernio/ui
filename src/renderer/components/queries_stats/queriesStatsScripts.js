/**
 * 
 * @param {*} results 
 * @returns 
 */
export const countQueries = results => ({
	queriesCount: Object.keys(results).length,
});

/**
 * Function to uopdate query statistics
 * @param {*} results
 * @returns
 */
export const updateQueriesStats = results => {
	const queriesStats = [];

	Object.keys(results).forEach(key => {
		const result = results[key];
		queriesStats.push({
			query: result.query,
			t_elapsed: result.t_1
				? result.t_1 - result.t_0
				: performance.now() - result.t_0,
			completed: !!result.t_1,
		});
	});

	return { queriesStats };
};
