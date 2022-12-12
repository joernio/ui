export const countQueries = (results, scriptsResults) => ({
	queriesCount: Object.keys(results).length + Object.keys(scriptsResults).length,
});

export const updateQueriesStats = (results, scriptsResults) => {
  let queriesStats = [
    ...Object.keys(results).map(key=>results[key]),
    ...Object.keys(scriptsResults).map(key=>scriptsResults[key])
  ];

  queriesStats.sort((result1, result2)=> result1.t_0 - result2.t_0);
  queriesStats = queriesStats.map(result=>({
    query: result.query,
    t_elapsed: result.t_1
      ? result.t_1 - result.t_0
      : new Date().getTime() - result.t_0,
    completed: !!result.t_1,
  }));

	return { queriesStats };
};
