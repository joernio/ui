

export const shouldRunQuery=(prev_queue, queue, query)=>{
    const prev_queue_count = prev_queue ? Object.keys(prev_queue).length : 0;
    const queue_count = Object.keys(queue).length;

    if (query && queue_count === 1) {
      return true;
    } else if (query && prev_queue_count > queue_count && queue_count > 0) {
      return true;
    }
}