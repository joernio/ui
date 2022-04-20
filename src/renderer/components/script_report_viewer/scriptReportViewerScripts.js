/**
 * Parse script report
 * @param {*} str
 * @returns
 */
export const parseScriptReportJSON = str => {
	try {
		const report = JSON.parse(str);
		return { report, bannerMessage: '' };
	} catch {
		const bannerMessage =
			'There was an error parsing json report. Displaying raw json data instead';
		return { report: {}, bannerMessage };
	}
};
