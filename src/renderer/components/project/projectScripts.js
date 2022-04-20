/**
 * Add to Queue
 * @param {*} query
 * @param {*} props
 */
export const addToQueue = (query, props) => {
	if (query) {
		props.enQueueQuery(query);
	}
};

/**
 * Function to open a project
 * @param {*} name The name of the project to open
 * @returns query construct
 */
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

/**
 * Function to close a project
 * @param {*} name The name of the project to close
 * @returns query construct
 */
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

/**
 * Function to delete a project
 * @param {*} name
 * @returns query construct
 */
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
