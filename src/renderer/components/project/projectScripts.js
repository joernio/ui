/**
 * Add to Queue
 * @param {Object} query
 * @param {Object} props
 */
export const addToQueue = (query, props) => {
	if (query) {
		props.enQueueQuery(query);
	}
};

/**
 * Opens a project
 * @param {string} name The name of the project to open
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
 * Closes a project
 * @param {string} name The name of the project to close
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
 * Deletes a project
 * @param {string} name
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
