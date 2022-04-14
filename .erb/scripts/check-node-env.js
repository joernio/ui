const chalk = require('chalk');
const { moduleFileExtensions } = require('../../jest.config');

function checkNodeEnv(expectedEnv) {
	if (!expectedEnv) {
		throw new Error('"expectedEnv" not set');
	}

	if (process.env.NODE_ENV !== expectedEnv) {
		console.log(
			chalk.whiteBright.bgRed.bold(
				`"process.env.NODE_ENV" must be "${expectedEnv}" to use this webpack config`,
			),
		);
		process.exit(2);
	}
}

module.exports = checkNodeEnv;
