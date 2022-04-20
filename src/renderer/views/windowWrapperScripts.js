/**
 * get open file path
 * @param {*} e
 * @returns
 */
export const handleOpenFile = e => {
	if (e?.target?.files[0]?.path) {
		const { path } = e.target.files[0];
		return path;
	}
};
