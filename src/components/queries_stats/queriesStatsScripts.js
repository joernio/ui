export const getQueriesStats = (queue, prev_queue, queriesStats) => {
  let prev_queue_keys = prev_queue ? Object.keys(prev_queue) : [];
  let queue_keys = Object.keys(queue);

  if (queue_keys.length > prev_queue_keys.length && !(queue_keys.length > 1)) {
    const key = queue_keys[queue_keys.length - 1];
    const query = queue[key];

    const queryStat = {
      id: key,
      query: query.query,
      t0: performance.now(),
      t1: null,
      completed: false,
    };

    queriesStats.push(queryStat);
    return { queriesStats };
  } else if (queue_keys.length < prev_queue_keys.length) {
    const key = queue_keys[queue_keys.length - 1];
    const query = queue[key];

    // ************** set the item removed from the queue as completed **********
    for (let key of prev_queue_keys) {
      if (!queue_keys[key]) {
        for (let i = queriesStats.length - 1; i >= 0; i--) {
          if (queriesStats[i].id === key) {
            queriesStats[i].completed = true;
            if (queriesStats[i].t0) {
              queriesStats[i].t1 = performance.now() - queriesStats[i].t0;
            }
            break;
          }
        }
      }
    }
    // ***********************************************************************

    if (query) {
      const queryStat = {
        id: key,
        query: query.query,
        t0: performance.now(),
        t1: null,
        completed: false,
      };

      queriesStats.push(queryStat);
    }

    return { queriesStats };
  }
};

export const updateQueriesStats = queriesStats => {
  queriesStats = [...queriesStats];
  for (let i = queriesStats.length - 1; i >= 0; i--) {
    if (!queriesStats[i].completed) {
      queriesStats[i].t1 = performance.now() - queriesStats[i].t0;
    } else {
      break;
    }
  }

  return { queriesStats };
};
