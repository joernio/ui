export const countQueries = results => {
  return {queriesCount: Object.keys(results).length};
};

export const updateQueriesStats = (results) => {

  const queriesStats = [];

  for(let key in results){
    const result = results[key];
    queriesStats.push(
      {
        query: result.query,
        t_elapsed: result.t_1 ? result.t_1 - result.t_0: performance.now() - result.t_0,
        completed: result.t_1 ? true : false
        }
    );
  }


  return { queriesStats };
};
