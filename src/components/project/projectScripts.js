export const addToQueue = (query, props) => {
  if (query) {
    props.enQueueQuery(query);
  }
};

export const handleOpenProject = name => {
  if (name) {
    const query = {
      query: `open("${name}")`,
      origin: 'workspace',
      ignore: false,
    };
    return query;
  }
};

export const handleCloseProject = name => {
  if (name) {
    const query = {
      query: `close("${name}")`,
      origin: 'workspace',
      ignore: false,
    };
    return query;
  }
};

export const handleDeleteProject = name => {
  if (name) {
    const query = {
      query: `delete("${name}")`,
      origin: 'workspace',
      ignore: false,
    };
    return query;
  }
};
