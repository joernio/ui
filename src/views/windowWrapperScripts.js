export const handleOpenFile = e => {
  if (e?.target?.files[0]?.path) {
    let path = e.target.files[0].path;
    return path;
  }
};

export const getOpenFileName = props => {
  if (props.files.recent) {
    let filename = Object.keys(props.files.recent);
    filename = filename ? filename.pop() : null;
    filename = filename ? filename.split('/') : null;
    filename = filename ? filename[filename.length - 1] : null;

    return filename;
  }
};

export const getQueriesStats=(queue, prev_queue, queriesStats)=>{
  let prev_queue_keys = prev_queue ? Object.keys(prev_queue) : [];
  let queue_keys = Object.keys(queue);

  if(queue_keys.length > prev_queue_keys.length && !(queue_keys.length > 1)){
    const query = queue[queue_keys[queue_keys.length - 1]];
    queriesStats.push(query.query);
    return {queriesStats};

  }else if(queue_keys.length < prev_queue_keys.length){
    const query = queue[queue_keys[queue_keys.length - 1]];
    if(query){
      queriesStats.push(query.query);
      return {queriesStats};
    }
  }

  //prev_queue will be used for stopping the timer;
};
