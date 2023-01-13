import { homedir } from 'os';

export const terminalVariables = {
	cpgWelcomeScreen: `
   \r
   \r        ██████╗██████╗  ██████╗
   \r       ██╔════╝██╔══██╗██╔════╝
   \r       ██║     ██████╔╝██║ ████╗
   \r       ██║     ██╔═══╝ ██║ ╚═██║
   \r        ██████╗██║      ██████╔╝
   \r         ╚════╝╚═╝       ╚════╝
   \r
   \r Type "help" or "browse(help)" to begin
   \r
   `,
	cpgDefaultPrompt: ' cpg> ',
	carriageReturn: '\r',
	newLine: '\n',
	clearLineFromCursorToEnd: '[0J',
	clearLine: '\r[0J',
	cursorPositionFromStart: '[<n>C',
	formatText: '[<n>m<o>[0m',
};

export const cpgManagementCommands = {
	close: 'close',
	delete: 'delete',
	importCode: 'importCode',
	importCpg: 'importCpg',
	open: 'open',
	switchWorkspace: 'switchWorkspace',
	cpgLanguage: 'cpg.metaData.language.l',
};

export const apiErrorStrings = {
	ws_not_connected: 'WS_NOT_CONNECTED',
	http_disabled:
		'Error querying http server. To send queries, enable http in settings',
	bad_url_format: 'Bad url format',
	bad_request: 'Bad request',
	no_result_for_uuid: 'No result found for specified UUID',
	certificate_invalid:
		'Error making https request. Non-existing or Invalid ssl certificate',
	certificate_import_successful: 'Certificate import successful',
	certificate_import_failed: 'Certificate import failed',
};

export const printable = {
	0: true,
	1: true,
	2: true,
	3: true,
	4: true,
	5: true,
	6: true,
	7: true,
	8: true,
	9: true,
	a: true,
	b: true,
	c: true,
	d: true,
	e: true,
	f: true,
	g: true,
	h: true,
	i: true,
	j: true,
	k: true,
	l: true,
	m: true,
	n: true,
	o: true,
	p: true,
	q: true,
	r: true,
	s: true,
	t: true,
	u: true,
	v: true,
	w: true,
	x: true,
	y: true,
	z: true,
	A: true,
	B: true,
	C: true,
	D: true,
	E: true,
	F: true,
	G: true,
	H: true,
	I: true,
	J: true,
	K: true,
	L: true,
	M: true,
	N: true,
	O: true,
	P: true,
	Q: true,
	R: true,
	S: true,
	T: true,
	U: true,
	V: true,
	W: true,
	X: true,
	Y: true,
	Z: true,
	'`': true,
	'~': true,
	'!': true,
	'@': true,
	'#': true,
	$: true,
	'%': true,
	'^': true,
	'&': true,
	'*': true,
	'(': true,
	')': true,
	'-': true,
	_: true,
	'=': true,
	'+': true,
	'[': true,
	'{': true,
	']': true,
	'}': true,
	'\\': true,
	'|': true,
	';': true,
	':': true,
	',': true,
	'<': true,
	'.': true,
	'>': true,
	'/': true,
	'?': true,
	"'": true,
	'"': true,
	' ': true,
	'  ': true,
};

export const foldersToIgnore = ['.git', 'node_modules'];
export const filesToIgnore = [];

export const imageFileExtensions = [
	'.apng',
	'.avif',
	'.gif',
	'.jpg',
	'.jpeg',
	'.jfif',
	'.pjpeg',
	'.pjp',
	'.png',
	'.webp',
	'.bmp',
	'.ico',
	'.cur',
];
export const syntheticFiles = [
	'AST Graph',
	'Query Shortcuts',
	'Script Report',
	'Binary Viewer',
	'Rules',
	'Rule Reports',
];
export const joernBinaryLanguage = 'GHIDRA';

export const customIcons = {
	rules: 'custom-rules',
	analytics: 'custom-analytics',
	monitoring: 'custom-monitoring',
	chevron_down: 'custom-chevron-down',
	hamburger: 'custom-hamburger',
	restore: 'custom-restore',
	close: 'custom-close',
	terminal: 'custom-terminal',
};

export const defaultRulesConfigFilePath = `${homedir()}/bin/joern/joern-cli/scripts/rules-config.json`;
export const defaultRulesConfigFileContent = `
// The commented json below is the specification that is recognized.
// Your custom rules configuration should look like the one below.
// You can skip to the bottom of this file to start writing your own rules configuration.

// [{
//   "title": "Hardcoded Secrets Detection",
//   "id":"001",
//   "filename":"/home/joern/scripts/secrets.sc",
//   "description": "Detect hardcoded secrets in Source",
//   "tags":["cwe-789", "cve-2021-2787"],
//   "languages": [ "C", "Java", "Javascript" ],
//   "arguments": {}
//  },
//  {
//   "title": "Own title",
//   "id":"002",
//   "filename": "/home/joern/scripts/script_name.sc",
//   "description": "Description goes here",
//   "tags" : ["cwe-789", "cve-2021-2787", "secrets"],
//   "languages": [ "C", "Java", "Javascript" ],
//   "arguments": {"arg1": "value of arg1", "arg2": "/value/of/arg/2"}
//  }]

// Your rules configuration should go here...
`;

// \r      ██╗ ██████╗ ███████╗██████╗ ███╗   ██╗
// \r      ██║██╔═══██╗██╔════╝██╔══██╗████╗  ██║
// \r      ██║██║   ██║█████╗  ██████╔╝██╔██╗ ██║
// \r ██   ██║██║   ██║██╔══╝  ██╔══██╗██║╚██╗██║
// \r ╚█████╔╝╚██████╔╝███████╗██║  ██║██║ ╚████║
// \r  ╚════╝  ╚═════╝ ╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝

export const sampleSarif = [
	{
		runs: [
			{
				tool: {
					driver: {
						name: 'Joern',
						rules: [
							{
								id: 'http-to-log',
								help: {
									text: 'Sensitive Data Leak: Security-sensitive data is leaked via `req` to log in `anonymous`\n\nHTTP data is written to a log file in this flow. This data may be visible to a third party that has access to the logs, such as system administrators. Many web applications and APIs do not protect sensitive data, such as financial and healthcare. Attackers may steal or modify such weakly protected data to conduct credit card fraud, identity theft, or other crimes.\n\n\n## Countermeasures\n\nThis vulnerability can be prevented by not writing HTTP data directly to the log or by encrypting it in advance.\n\n## Additional information\n\n**[CWE-200](https://cwe.mitre.org/data/definitions/200.html)**\n\n**[CWE-117](https://cwe.mitre.org/data/definitions/117.html)**\n\n**[OWASP-A3](https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A3-Sensitive_Data_Exposure)**.',
									markdown:
										'Sensitive Data Leak: Security-sensitive data is leaked via `req` to log in `anonymous`\n\nHTTP data is written to a log file in this flow. This data may be visible to a third party that has access to the logs, such as system administrators. Many web applications and APIs do not protect sensitive data, such as financial and healthcare. Attackers may steal or modify such weakly protected data to conduct credit card fraud, identity theft, or other crimes.\n\n\n## Countermeasures\n\nThis vulnerability can be prevented by not writing HTTP data directly to the log or by encrypting it in advance.\n\n## Additional information\n\n**[CWE-200](https://cwe.mitre.org/data/definitions/200.html)**\n\n**[CWE-117](https://cwe.mitre.org/data/definitions/117.html)**\n\n**[OWASP-A3](https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A3-Sensitive_Data_Exposure)**.',
								},
								name: 'SensitiveDataLeak',
								properties: {
									tags: ['joern'],
									precision: 'very-high',
								},
								defaultConfiguration: {
									level: 'warning',
								},
								fullDescription: {
									text: 'Sensitive Data Leak: Security-sensitive data is leaked via `req` to log in `anonymous`.',
								},
								helpUri: 'https://joern.io?q=http-to-log',
								shortDescription: {
									text: 'Sensitive Data Leak',
								},
							},
							{
								id: 'open-redirect',
								help: {
									text: 'Open Redirect: HTTP Request parameters are used in HTTP redirects via `req` in `anonymous`\n\nHTTP Request parameters are not escaped and used in a HTTP redirect. This indicates an open redirect which can be exploited by an attacker to launch phishing attacks and/or steal sensitive data.\n\n## Countermeasures\n\n This vulnerability can be prevented by ensuring that users cannot arbitrarily control where your page redirects them to.\n\n## Additional information\n\n**[CWE-601](https://cwe.mitre.org/data/definitions/601.html)**\n\n**[OWASP-A1](https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A1-Injection)**.',
									markdown:
										'Open Redirect: HTTP Request parameters are used in HTTP redirects via `req` in `anonymous`\n\nHTTP Request parameters are not escaped and used in a HTTP redirect. This indicates an open redirect which can be exploited by an attacker to launch phishing attacks and/or steal sensitive data.\n\n## Countermeasures\n\n This vulnerability can be prevented by ensuring that users cannot arbitrarily control where your page redirects them to.\n\n## Additional information\n\n**[CWE-601](https://cwe.mitre.org/data/definitions/601.html)**\n\n**[OWASP-A1](https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A1-Injection)**.',
								},
								name: 'OpenRedirect',
								properties: {
									tags: ['joern'],
									precision: 'very-high',
								},
								defaultConfiguration: {
									level: 'warning',
								},
								fullDescription: {
									text: 'Open Redirect: HTTP Request parameters are used in HTTP redirects via `req` in `anonymous`.',
								},
								helpUri: 'https://joern.io?q=open-redirect',
								shortDescription: {
									text: 'Open Redirect',
								},
							},
							{
								id: 'xss-to-html',
								help: {
									text: 'XSS: HTTP data to HTML via `req` in `anonymous`\n\nHTTP request data is used in rendering HTML without validation.\n By sending a specially crafted request, an attacker could inject malicious code into the website and compromise the confidentiality and integrity of the data exchanged between the service and users.\n ## Countermeasures\n - Sanitize and validate HTTP data before passing it back to the user.\n ## Additional information\n **[CWE-79](https://cwe.mitre.org/data/definitions/79.html)**\n **[OWASP-A7](https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A7-Cross-Site_Scripting_(XSS))**.',
									markdown:
										'XSS: HTTP data to HTML via `req` in `anonymous`\n\nHTTP request data is used in rendering HTML without validation.\n By sending a specially crafted request, an attacker could inject malicious code into the website and compromise the confidentiality and integrity of the data exchanged between the service and users.\n ## Countermeasures\n - Sanitize and validate HTTP data before passing it back to the user.\n ## Additional information\n **[CWE-79](https://cwe.mitre.org/data/definitions/79.html)**\n **[OWASP-A7](https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A7-Cross-Site_Scripting_(XSS))**.',
								},
								name: 'XSS',
								properties: {
									tags: ['joern'],
									precision: 'very-high',
								},
								defaultConfiguration: {
									level: 'warning',
								},
								fullDescription: {
									text: 'XSS: HTTP data to HTML via `req` in `anonymous`.',
								},
								helpUri: 'https://joern.io?q=xss-to-html',
								shortDescription: {
									text: 'XSS',
								},
							},
							{
								id: 'attacker-to-redirect',
								help: {
									text: 'Sensitive Data Leak: Attacker controlled data used in redirect via `req` in `anonymous`\n\nAn attacker can redirect traffic from the application. This way the attacker could perform phishing attacks and/or steal sensitive data.\n\n\n## Countermeasures\n\nThis vulnerability can be prevented by validating all the data that is used to redirect users on different pages or website and by alerting the user before doing so.',
									markdown:
										'Sensitive Data Leak: Attacker controlled data used in redirect via `req` in `anonymous`\n\nAn attacker can redirect traffic from the application. This way the attacker could perform phishing attacks and/or steal sensitive data.\n\n\n## Countermeasures\n\nThis vulnerability can be prevented by validating all the data that is used to redirect users on different pages or website and by alerting the user before doing so.',
								},
								name: 'SensitiveDataLeak',
								properties: {
									tags: ['joern'],
									precision: 'very-high',
								},
								defaultConfiguration: {
									level: 'warning',
								},
								fullDescription: {
									text: 'Sensitive Data Leak: Attacker controlled data used in redirect via `req` in `anonymous`.',
								},
								helpUri:
									'https://joern.io?q=attacker-to-redirect',
								shortDescription: {
									text: 'Sensitive Data Leak',
								},
							},
							{
								id: 'sensitive-response-leak',
								help: {
									text: 'Sensitive data from an external API response is leaked via log or persistent storage\n\nHTTP data is written to a log file or persisted in an insecure storage in this flow.\n This data may be visible to a third party that has access to the logs or the local storage, such as system administrators. Many web applications and APIs do not protect sensitive data, such as financial and healthcare. Attackers may steal or modify such weakly protected data to conduct credit card fraud, identity theft, or other crimes.\n ## Countermeasures\n - This vulnerability can be prevented by not writing HTTP data directly to the log and the persistent storage or by sanitizing or obfuscating the data in advance.\n ## Additional information\n **[CWE-200](https://cwe.mitre.org/data/definitions/200.html)**\n **[CWE-200](https://cwe.mitre.org/data/definitions/200.html)**\n **[OWASP-A3](https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A3-Sensitive_Data_Exposure)**.',
									markdown:
										'Sensitive data from an external API response is leaked via log or persistent storage\n\nHTTP data is written to a log file or persisted in an insecure storage in this flow.\n This data may be visible to a third party that has access to the logs or the local storage, such as system administrators. Many web applications and APIs do not protect sensitive data, such as financial and healthcare. Attackers may steal or modify such weakly protected data to conduct credit card fraud, identity theft, or other crimes.\n ## Countermeasures\n - This vulnerability can be prevented by not writing HTTP data directly to the log and the persistent storage or by sanitizing or obfuscating the data in advance.\n ## Additional information\n **[CWE-200](https://cwe.mitre.org/data/definitions/200.html)**\n **[CWE-200](https://cwe.mitre.org/data/definitions/200.html)**\n **[OWASP-A3](https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A3-Sensitive_Data_Exposure)**.',
								},
								name: 'SensitiveDataLeak',
								properties: {
									tags: ['joern'],
									precision: 'very-high',
								},
								defaultConfiguration: {
									level: 'warning',
								},
								fullDescription: {
									text: 'Sensitive data from an external API response is leaked via log or persistent storage.',
								},
								helpUri:
									'https://joern.io?q=sensitive-response-leak',
								shortDescription: {
									text: 'Sensitive Data Leak',
								},
							},
							{
								id: 'prototype-pollution',
								help: {
									text: 'Prototype Pollution: Attacker-controlled object leading to RCE or XSS via `req` in `check`\n\nAn attacker-controlled object is used in a procedure that can change the `Object.prototype` property.\n This might allow an attacker to execute arbitrary code remotely, extract sensitive data from the system and compromise the integrity of the system completely.\n ## Countermeasures\n - Ensure `lodash` version `4.17.12+` is used with safer `merge` and `extend` functions.\n - Avoid using `defaultsDeep`, since the function can lead to object mutation.\n ## Additional information\n **[CWE-89](https://cwe.mitre.org/data/definitions/89.html)**\n **[OWASP-A1](https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A1-Injection)**\n **[Javascript Object prototypes](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Object_prototypes)**.',
									markdown:
										'Prototype Pollution: Attacker-controlled object leading to RCE or XSS via `req` in `check`\n\nAn attacker-controlled object is used in a procedure that can change the `Object.prototype` property.\n This might allow an attacker to execute arbitrary code remotely, extract sensitive data from the system and compromise the integrity of the system completely.\n ## Countermeasures\n - Ensure `lodash` version `4.17.12+` is used with safer `merge` and `extend` functions.\n - Avoid using `defaultsDeep`, since the function can lead to object mutation.\n ## Additional information\n **[CWE-89](https://cwe.mitre.org/data/definitions/89.html)**\n **[OWASP-A1](https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A1-Injection)**\n **[Javascript Object prototypes](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Object_prototypes)**.',
								},
								name: 'PrototypePollution',
								properties: {
									tags: ['joern'],
									precision: 'very-high',
								},
								defaultConfiguration: {
									level: 'warning',
								},
								fullDescription: {
									text: 'Prototype Pollution: Attacker-controlled object leading to RCE or XSS via `req` in `check`.',
								},
								helpUri:
									'https://joern.io?q=prototype-pollution',
								shortDescription: {
									text: 'Prototype Pollution',
								},
							},
							{
								id: 'sensitive-to-log',
								help: {
									text: 'Sensitive Data Leak: Sensitive data is leaked via `req` to log in `anonymous`\n\nSensitive data leak detected in this flow. This data may be visible to a third party that has access to the logs, such as system administrators. Many web applications and APIs do not protect sensitive data, such as financial and healthcare. Attackers may steal or modify such weakly protected data to conduct credit card fraud, identity theft, or other crimes.\n\n\n## Countermeasures\n\nThis vulnerability can be prevented by not writing sensitive data to the log or by encrypting it in advance.\n\n## Additional information\n\n**[CWE-200](https://cwe.mitre.org/data/definitions/200.html)**\n\n**[CWE-117](https://cwe.mitre.org/data/definitions/117.html)**\n\n**[OWASP-A3](https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A3-Sensitive_Data_Exposure)**.',
									markdown:
										'Sensitive Data Leak: Sensitive data is leaked via `req` to log in `anonymous`\n\nSensitive data leak detected in this flow. This data may be visible to a third party that has access to the logs, such as system administrators. Many web applications and APIs do not protect sensitive data, such as financial and healthcare. Attackers may steal or modify such weakly protected data to conduct credit card fraud, identity theft, or other crimes.\n\n\n## Countermeasures\n\nThis vulnerability can be prevented by not writing sensitive data to the log or by encrypting it in advance.\n\n## Additional information\n\n**[CWE-200](https://cwe.mitre.org/data/definitions/200.html)**\n\n**[CWE-117](https://cwe.mitre.org/data/definitions/117.html)**\n\n**[OWASP-A3](https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A3-Sensitive_Data_Exposure)**.',
								},
								name: 'SensitiveDataLeak',
								properties: {
									tags: ['joern'],
									precision: 'very-high',
								},
								defaultConfiguration: {
									level: 'warning',
								},
								fullDescription: {
									text: 'Sensitive Data Leak: Sensitive data is leaked via `req` to log in `anonymous`.',
								},
								helpUri: 'https://joern.io?q=sensitive-to-log',
								shortDescription: {
									text: 'Sensitive Data Leak',
								},
							},
							{
								id: 'sql-injection-http',
								help: {
									text: 'SQL Injection: HTTP data to SQL database via `req` in `anonymous`\n\nHTTP data is used in a SQL query without undergoing escaping or validation. This could allow an attacker to read sensitive data from the database, modify its content or gain control over the server.\n\n\n## Countermeasures\n\nThis vulnerability can be prevented by using prepared statements on the HTTP data.\n\n## Additional information\n\n**[CWE-89](https://cwe.mitre.org/data/definitions/89.html)**\n\n**[OWASP-A1](https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A1-Injection)**.',
									markdown:
										'SQL Injection: HTTP data to SQL database via `req` in `anonymous`\n\nHTTP data is used in a SQL query without undergoing escaping or validation. This could allow an attacker to read sensitive data from the database, modify its content or gain control over the server.\n\n\n## Countermeasures\n\nThis vulnerability can be prevented by using prepared statements on the HTTP data.\n\n## Additional information\n\n**[CWE-89](https://cwe.mitre.org/data/definitions/89.html)**\n\n**[OWASP-A1](https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A1-Injection)**.',
								},
								name: 'SQLInjection',
								properties: {
									tags: ['joern'],
									precision: 'very-high',
								},
								defaultConfiguration: {
									level: 'warning',
								},
								fullDescription: {
									text: 'SQL Injection: HTTP data to SQL database via `req` in `anonymous`.',
								},
								helpUri:
									'https://joern.io?q=sql-injection-http',
								shortDescription: {
									text: 'SQL Injection',
								},
							},
							{
								id: 'command-injection-http',
								help: {
									text: 'Remote Code Execution: Command Injection through HTTP via `ctx` in `anonymous`\n\nHTTP data is used in a shell command without undergoing escaping or validation. This could allow an attacker to execute code on the server. Injection flaws occur when untrusted data is sent to an interpreter as part of a command or query. By injecting hostile data, an attacker may trick the interpreter into executing unintended commands or accessing data without authorization which can result in data loss, corruption, or disclosure to unauthorized parties, loss of accountability, denial of access or even a complete host takeover.\n\n\n## Countermeasures\n\nThis vulnerability can be prevented by using parameterized queries or by validating HTTP data (preferably on server-side by means of common input sanitation libraries or whitelisting) before using it.\n\n## Additional information\n\n**[CWE-77](https://cwe.mitre.org/data/definitions/77.html)**\n\n**[CWE-78](https://cwe.mitre.org/data/definitions/78.html)**\n\n**[CWE-917](https://cwe.mitre.org/data/definitions/917.html)**\n\n**[OWASP-A1](https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A1-Injection)**.',
									markdown:
										'Remote Code Execution: Command Injection through HTTP via `ctx` in `anonymous`\n\nHTTP data is used in a shell command without undergoing escaping or validation. This could allow an attacker to execute code on the server. Injection flaws occur when untrusted data is sent to an interpreter as part of a command or query. By injecting hostile data, an attacker may trick the interpreter into executing unintended commands or accessing data without authorization which can result in data loss, corruption, or disclosure to unauthorized parties, loss of accountability, denial of access or even a complete host takeover.\n\n\n## Countermeasures\n\nThis vulnerability can be prevented by using parameterized queries or by validating HTTP data (preferably on server-side by means of common input sanitation libraries or whitelisting) before using it.\n\n## Additional information\n\n**[CWE-77](https://cwe.mitre.org/data/definitions/77.html)**\n\n**[CWE-78](https://cwe.mitre.org/data/definitions/78.html)**\n\n**[CWE-917](https://cwe.mitre.org/data/definitions/917.html)**\n\n**[OWASP-A1](https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A1-Injection)**.',
								},
								name: 'RemoteCodeExecution',
								properties: {
									tags: ['joern'],
									precision: 'very-high',
								},
								defaultConfiguration: {
									level: 'warning',
								},
								fullDescription: {
									text: 'Remote Code Execution: Command Injection through HTTP via `ctx` in `anonymous`.',
								},
								helpUri:
									'https://joern.io?q=command-injection-http',
								shortDescription: {
									text: 'Remote Code Execution',
								},
							},
							{
								id: 'xxe-injection',
								help: {
									text: 'XXE: HTTP data to XML via `req` in `anonymous`\n\nThis flow indicates an XXE attack. An attacker could read arbitrary files, if the features are not disabled.\n\n\n## Countermeasures\n\nThis vulnerability can be prevented by disabling XML External Entity for server-side XML parser altogether. You can find more information in the [OWASP (XXE) Prevention Cheat Sheet](https://www.owasp.org/index.php/XML_External_Entity_(XXE)_Prevention_Cheat_Sheet).\n\n## Additional information\n\n- **[CWE-611](https://cwe.mitre.org/data/definitions/611.html)**\n\n- **[OWASP-A4](https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A4-XML_External_Entities_(XXE))**.',
									markdown:
										'XXE: HTTP data to XML via `req` in `anonymous`\n\nThis flow indicates an XXE attack. An attacker could read arbitrary files, if the features are not disabled.\n\n\n## Countermeasures\n\nThis vulnerability can be prevented by disabling XML External Entity for server-side XML parser altogether. You can find more information in the [OWASP (XXE) Prevention Cheat Sheet](https://www.owasp.org/index.php/XML_External_Entity_(XXE)_Prevention_Cheat_Sheet).\n\n## Additional information\n\n- **[CWE-611](https://cwe.mitre.org/data/definitions/611.html)**\n\n- **[OWASP-A4](https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A4-XML_External_Entities_(XXE))**.',
								},
								name: 'XXE',
								properties: {
									tags: ['joern'],
									precision: 'very-high',
								},
								defaultConfiguration: {
									level: 'warning',
								},
								fullDescription: {
									text: 'XXE: HTTP data to XML via `req` in `anonymous`.',
								},
								helpUri: 'https://joern.io?q=xxe-injection',
								shortDescription: {
									text: 'XXE',
								},
							},
							{
								id: 'cmdi',
								help: {
									text: 'Remote Code Execution: Command Injection through HTTP via `ctx` in `anonymous`\n\nHTTP data is used in a shell command without undergoing escaping or validation. This could allow an attacker to execute code on the server. Injection flaws occur when untrusted data is sent to an interpreter as part of a command or query. By injecting hostile data, an attacker may trick the interpreter into executing unintended commands or accessing data without authorization which can result in data loss, corruption, or disclosure to unauthorized parties, loss of accountability, denial of access or even a complete host takeover.\n\n\n## Countermeasures\n\nThis vulnerability can be prevented by using parameterized queries or by validating HTTP data (preferably on server-side by means of common input sanitation libraries or whitelisting) before using it.\n\n## Additional information\n\n**[CWE-77](https://cwe.mitre.org/data/definitions/77.html)**\n\n**[CWE-78](https://cwe.mitre.org/data/definitions/78.html)**\n\n**[CWE-917](https://cwe.mitre.org/data/definitions/917.html)**\n\n**[OWASP-A1](https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A1-Injection)**.',
									markdown:
										'Remote Code Execution: Command Injection through HTTP via `ctx` in `anonymous`\n\nHTTP data is used in a shell command without undergoing escaping or validation. This could allow an attacker to execute code on the server. Injection flaws occur when untrusted data is sent to an interpreter as part of a command or query. By injecting hostile data, an attacker may trick the interpreter into executing unintended commands or accessing data without authorization which can result in data loss, corruption, or disclosure to unauthorized parties, loss of accountability, denial of access or even a complete host takeover.\n\n\n## Countermeasures\n\nThis vulnerability can be prevented by using parameterized queries or by validating HTTP data (preferably on server-side by means of common input sanitation libraries or whitelisting) before using it.\n\n## Additional information\n\n**[CWE-77](https://cwe.mitre.org/data/definitions/77.html)**\n\n**[CWE-78](https://cwe.mitre.org/data/definitions/78.html)**\n\n**[CWE-917](https://cwe.mitre.org/data/definitions/917.html)**\n\n**[OWASP-A1](https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A1-Injection)**.',
								},
								name: 'RemoteCodeExecution',
								properties: {
									tags: ['joern'],
									precision: 'very-high',
								},
								defaultConfiguration: {
									level: 'warning',
								},
								fullDescription: {
									text: 'Remote Code Execution: Command Injection through HTTP via `ctx` in `anonymous`.',
								},
								helpUri: 'https://joern.io?q=cmdi',
								shortDescription: {
									text: 'Remote Code Execution',
								},
							},
							{
								id: 'sqli',
								help: {
									text: 'SQL Injection: HTTP data to SQL database via `req` in `anonymous`\n\nHTTP data is used in a SQL query without undergoing escaping or validation. This could allow an attacker to read sensitive data from the database, modify its content or gain control over the server.\n\n\n## Countermeasures\n\nThis vulnerability can be prevented by using prepared statements on the HTTP data.\n\n## Additional information\n\n**[CWE-89](https://cwe.mitre.org/data/definitions/89.html)**\n\n**[OWASP-A1](https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A1-Injection)**.',
									markdown:
										'SQL Injection: HTTP data to SQL database via `req` in `anonymous`\n\nHTTP data is used in a SQL query without undergoing escaping or validation. This could allow an attacker to read sensitive data from the database, modify its content or gain control over the server.\n\n\n## Countermeasures\n\nThis vulnerability can be prevented by using prepared statements on the HTTP data.\n\n## Additional information\n\n**[CWE-89](https://cwe.mitre.org/data/definitions/89.html)**\n\n**[OWASP-A1](https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A1-Injection)**.',
								},
								name: 'SQLInjection',
								properties: {
									tags: ['joern'],
									precision: 'very-high',
								},
								defaultConfiguration: {
									level: 'warning',
								},
								fullDescription: {
									text: 'SQL Injection: HTTP data to SQL database via `req` in `anonymous`.',
								},
								helpUri: 'https://joern.io?q=sqli',
								shortDescription: {
									text: 'SQL Injection',
								},
							},
						],
						version: '1.0.0',
						fullName: 'Joern',
						informationUri: 'https://joern.io',
					},
				},
				conversion: {
					tool: {
						driver: {
							name: 'joern',
						},
					},
					invocation: {
						arguments: [],
						executionSuccessful: true,
						commandLine: '',
						endTimeUtc: '2021-03-05T17:31:28Z',
						workingDirectory: {
							uri: 'file:///Volumes/Work/sandbox/explnode',
						},
					},
				},
				invocations: [
					{
						executionSuccessful: true,
						endTimeUtc: '2021-03-05T17:31:28Z',
						workingDirectory: {
							uri: 'file:///Volumes/Work/sandbox/explnode',
						},
					},
				],
				results: [
					{
						message: {
							markdown:
								'Sensitive Data Leak: Security-sensitive data is leaked via `req` to log in `anonymous`\n\nHTTP data is written to a log file in this flow. This data may be visible to a third party that has access to the logs, such as system administrators. Many web applications and APIs do not protect sensitive data, such as financial and healthcare. Attackers may steal or modify such weakly protected data to conduct credit card fraud, identity theft, or other crimes.\n\n\n## Countermeasures\n\nThis vulnerability can be prevented by not writing HTTP data directly to the log or by encrypting it in advance.\n\n## Additional information\n\n**[CWE-200](https://cwe.mitre.org/data/definitions/200.html)**\n\n**[CWE-117](https://cwe.mitre.org/data/definitions/117.html)**\n\n**[OWASP-A3](https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A3-Sensitive_Data_Exposure)**.',
							text: 'Sensitive Data Leak: Security-sensitive data is leaked via `req` to log in `anonymous`\n\nHTTP data is written to a log file in this flow. This data may be visible to a third party that has access to the logs, such as system administrators. Many web applications and APIs do not protect sensitive data, such as financial and healthcare. Attackers may steal or modify such weakly protected data to conduct credit card fraud, identity theft, or other crimes.\n\n\n## Countermeasures\n\nThis vulnerability can be prevented by not writing HTTP data directly to the log or by encrypting it in advance.\n\n## Additional information\n\n**[CWE-200](https://cwe.mitre.org/data/definitions/200.html)**\n\n**[CWE-117](https://cwe.mitre.org/data/definitions/117.html)**\n\n**[OWASP-A3](https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A3-Sensitive_Data_Exposure)**.',
						},
						locations: [
							{
								physicalLocation: {
									region: {
										snippet: {
											text: '    console.log(password);\n',
										},
										startLine: 6,
									},
									artifactLocation: {
										uri: 'file:///Volumes/Work/sandbox/explnode/vulnerabilities/sensitive.js',
									},
									contextRegion: {
										snippet: {
											text: '    const { username, password }  = req.query;\n    console.log(password);\n',
										},
										endLine: 6,
										startLine: 5,
									},
								},
							},
						],
						properties: {
							issue_confidence: 'HIGH',
							issue_severity: '2.5',
							issue_tags: {},
						},
						baselineState: 'new',
						partialFingerprints: {
							evidenceFingerprint: '',
						},
						ruleId: 'http-to-log',
						ruleIndex: 0,
					},
					{
						message: {
							markdown:
								'Sensitive Data Leak: Security-sensitive data is leaked via `req` to log in `anonymous1`\n\nHTTP data is written to a log file in this flow. This data may be visible to a third party that has access to the logs, such as system administrators. Many web applications and APIs do not protect sensitive data, such as financial and healthcare. Attackers may steal or modify such weakly protected data to conduct credit card fraud, identity theft, or other crimes.\n\n\n## Countermeasures\n\nThis vulnerability can be prevented by not writing HTTP data directly to the log or by encrypting it in advance.\n\n## Additional information\n\n**[CWE-200](https://cwe.mitre.org/data/definitions/200.html)**\n\n**[CWE-117](https://cwe.mitre.org/data/definitions/117.html)**\n\n**[OWASP-A3](https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A3-Sensitive_Data_Exposure)**.',
							text: 'Sensitive Data Leak: Security-sensitive data is leaked via `req` to log in `anonymous1`\n\nHTTP data is written to a log file in this flow. This data may be visible to a third party that has access to the logs, such as system administrators. Many web applications and APIs do not protect sensitive data, such as financial and healthcare. Attackers may steal or modify such weakly protected data to conduct credit card fraud, identity theft, or other crimes.\n\n\n## Countermeasures\n\nThis vulnerability can be prevented by not writing HTTP data directly to the log or by encrypting it in advance.\n\n## Additional information\n\n**[CWE-200](https://cwe.mitre.org/data/definitions/200.html)**\n\n**[CWE-117](https://cwe.mitre.org/data/definitions/117.html)**\n\n**[OWASP-A3](https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A3-Sensitive_Data_Exposure)**.',
						},
						locations: [
							{
								physicalLocation: {
									region: {
										snippet: {
											text: '    }\n',
										},
										startLine: 13,
									},
									artifactLocation: {
										uri: 'file:///Volumes/Work/sandbox/explnode/vulnerabilities/sensitive.js',
									},
									contextRegion: {
										snippet: {
											text: '        console.log(req.query.password); // data leak\n    }\n',
										},
										endLine: 13,
										startLine: 12,
									},
								},
							},
						],
						properties: {
							issue_confidence: 'HIGH',
							issue_severity: '2.5',
							issue_tags: {},
						},
						baselineState: 'new',
						partialFingerprints: {
							evidenceFingerprint: '',
						},
						ruleId: 'http-to-log',
						ruleIndex: 0,
					},
					{
						message: {
							markdown:
								'Sensitive Data Leak: Security-sensitive data is leaked via `req` to log in `anonymous2`\n\nHTTP data is written to a log file in this flow. This data may be visible to a third party that has access to the logs, such as system administrators. Many web applications and APIs do not protect sensitive data, such as financial and healthcare. Attackers may steal or modify such weakly protected data to conduct credit card fraud, identity theft, or other crimes.\n\n\n## Countermeasures\n\nThis vulnerability can be prevented by not writing HTTP data directly to the log or by encrypting it in advance.\n\n## Additional information\n\n**[CWE-200](https://cwe.mitre.org/data/definitions/200.html)**\n\n**[CWE-117](https://cwe.mitre.org/data/definitions/117.html)**\n\n**[OWASP-A3](https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A3-Sensitive_Data_Exposure)**.',
							text: 'Sensitive Data Leak: Security-sensitive data is leaked via `req` to log in `anonymous2`\n\nHTTP data is written to a log file in this flow. This data may be visible to a third party that has access to the logs, such as system administrators. Many web applications and APIs do not protect sensitive data, such as financial and healthcare. Attackers may steal or modify such weakly protected data to conduct credit card fraud, identity theft, or other crimes.\n\n\n## Countermeasures\n\nThis vulnerability can be prevented by not writing HTTP data directly to the log or by encrypting it in advance.\n\n## Additional information\n\n**[CWE-200](https://cwe.mitre.org/data/definitions/200.html)**\n\n**[CWE-117](https://cwe.mitre.org/data/definitions/117.html)**\n\n**[OWASP-A3](https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A3-Sensitive_Data_Exposure)**.',
						},
						locations: [
							{
								physicalLocation: {
									region: {
										snippet: {
											text: '    if(req.session.isAuthenticated()) {\n',
										},
										startLine: 20,
									},
									artifactLocation: {
										uri: 'file:///Volumes/Work/sandbox/explnode/vulnerabilities/sensitive.js',
									},
									contextRegion: {
										snippet: {
											text: '    let data = {}\n    if(req.session.isAuthenticated()) {\n',
										},
										endLine: 20,
										startLine: 19,
									},
								},
							},
						],
						properties: {
							issue_confidence: 'HIGH',
							issue_severity: '2.5',
							issue_tags: {},
						},
						baselineState: 'new',
						partialFingerprints: {
							evidenceFingerprint: '',
						},
						ruleId: 'http-to-log',
						ruleIndex: 0,
					},
					{
						message: {
							markdown:
								'Sensitive Data Leak: Security-sensitive data is leaked via `req` to log in `anonymous2`\n\nHTTP data is written to a log file in this flow. This data may be visible to a third party that has access to the logs, such as system administrators. Many web applications and APIs do not protect sensitive data, such as financial and healthcare. Attackers may steal or modify such weakly protected data to conduct credit card fraud, identity theft, or other crimes.\n\n\n## Countermeasures\n\nThis vulnerability can be prevented by not writing HTTP data directly to the log or by encrypting it in advance.\n\n## Additional information\n\n**[CWE-200](https://cwe.mitre.org/data/definitions/200.html)**\n\n**[CWE-117](https://cwe.mitre.org/data/definitions/117.html)**\n\n**[OWASP-A3](https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A3-Sensitive_Data_Exposure)**.',
							text: 'Sensitive Data Leak: Security-sensitive data is leaked via `req` to log in `anonymous2`\n\nHTTP data is written to a log file in this flow. This data may be visible to a third party that has access to the logs, such as system administrators. Many web applications and APIs do not protect sensitive data, such as financial and healthcare. Attackers may steal or modify such weakly protected data to conduct credit card fraud, identity theft, or other crimes.\n\n\n## Countermeasures\n\nThis vulnerability can be prevented by not writing HTTP data directly to the log or by encrypting it in advance.\n\n## Additional information\n\n**[CWE-200](https://cwe.mitre.org/data/definitions/200.html)**\n\n**[CWE-117](https://cwe.mitre.org/data/definitions/117.html)**\n\n**[OWASP-A3](https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A3-Sensitive_Data_Exposure)**.',
						},
						locations: [
							{
								physicalLocation: {
									region: {
										snippet: {
											text: '    if(req.session.isAuthenticated()) {\n',
										},
										startLine: 20,
									},
									artifactLocation: {
										uri: 'file:///Volumes/Work/sandbox/explnode/vulnerabilities/sensitive.js',
									},
									contextRegion: {
										snippet: {
											text: '    let data = {}\n    if(req.session.isAuthenticated()) {\n',
										},
										endLine: 20,
										startLine: 19,
									},
								},
							},
						],
						properties: {
							issue_confidence: 'HIGH',
							issue_severity: '2.5',
							issue_tags: {},
						},
						baselineState: 'new',
						partialFingerprints: {
							evidenceFingerprint: '',
						},
						ruleId: 'http-to-log',
						ruleIndex: 0,
					},
					{
						message: {
							markdown:
								'Open Redirect: HTTP Request parameters are used in HTTP redirects via `req` in `anonymous`\n\nHTTP Request parameters are not escaped and used in a HTTP redirect. This indicates an open redirect which can be exploited by an attacker to launch phishing attacks and/or steal sensitive data.\n\n## Countermeasures\n\n This vulnerability can be prevented by ensuring that users cannot arbitrarily control where your page redirects them to.\n\n## Additional information\n\n**[CWE-601](https://cwe.mitre.org/data/definitions/601.html)**\n\n**[OWASP-A1](https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A1-Injection)**.',
							text: 'Open Redirect: HTTP Request parameters are used in HTTP redirects via `req` in `anonymous`\n\nHTTP Request parameters are not escaped and used in a HTTP redirect. This indicates an open redirect which can be exploited by an attacker to launch phishing attacks and/or steal sensitive data.\n\n## Countermeasures\n\n This vulnerability can be prevented by ensuring that users cannot arbitrarily control where your page redirects them to.\n\n## Additional information\n\n**[CWE-601](https://cwe.mitre.org/data/definitions/601.html)**\n\n**[OWASP-A1](https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A1-Injection)**.',
						},
						locations: [
							{
								physicalLocation: {
									region: {
										snippet: {
											text: '    if(req.session.isAuthenticated()){\n',
										},
										startLine: 8,
									},
									artifactLocation: {
										uri: 'file:///Volumes/Work/sandbox/explnode/vulnerabilities/redirect.js',
									},
									contextRegion: {
										snippet: {
											text: '    let followPath = req.query.path;\n    if(req.session.isAuthenticated()){\n',
										},
										endLine: 8,
										startLine: 7,
									},
								},
							},
						],
						properties: {
							issue_confidence: 'HIGH',
							issue_severity: '3.0',
							issue_tags: {},
						},
						baselineState: 'new',
						partialFingerprints: {
							evidenceFingerprint: '',
						},
						ruleId: 'open-redirect',
						ruleIndex: 1,
					},
					{
						message: {
							markdown:
								'Open Redirect: HTTP Request parameters are used in HTTP redirects via `req` in `anonymous1`\n\nHTTP Request parameters are not escaped and used in a HTTP redirect. This indicates an open redirect which can be exploited by an attacker to launch phishing attacks and/or steal sensitive data.\n\n## Countermeasures\n\n This vulnerability can be prevented by ensuring that users cannot arbitrarily control where your page redirects them to.\n\n## Additional information\n\n**[CWE-601](https://cwe.mitre.org/data/definitions/601.html)**\n\n**[OWASP-A1](https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A1-Injection)**.',
							text: 'Open Redirect: HTTP Request parameters are used in HTTP redirects via `req` in `anonymous1`\n\nHTTP Request parameters are not escaped and used in a HTTP redirect. This indicates an open redirect which can be exploited by an attacker to launch phishing attacks and/or steal sensitive data.\n\n## Countermeasures\n\n This vulnerability can be prevented by ensuring that users cannot arbitrarily control where your page redirects them to.\n\n## Additional information\n\n**[CWE-601](https://cwe.mitre.org/data/definitions/601.html)**\n\n**[OWASP-A1](https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A1-Injection)**.',
						},
						locations: [
							{
								physicalLocation: {
									region: {
										snippet: {
											text: '    res.redirect(url);\n',
										},
										startLine: 17,
									},
									artifactLocation: {
										uri: 'file:///Volumes/Work/sandbox/explnode/vulnerabilities/redirect.js',
									},
									contextRegion: {
										snippet: {
											text: '    let url = encodeURI(req.query.url); //vulnerability\n    res.redirect(url);\n',
										},
										endLine: 17,
										startLine: 16,
									},
								},
							},
						],
						properties: {
							issue_confidence: 'HIGH',
							issue_severity: '3.0',
							issue_tags: {},
						},
						baselineState: 'new',
						partialFingerprints: {
							evidenceFingerprint: '',
						},
						ruleId: 'open-redirect',
						ruleIndex: 1,
					},
					{
						message: {
							markdown:
								'Open redirect: HTTP Request parameters are used in HTTP redirects via `res` in `anonymous1`\n\nHTTP request parameters are used in a HTTP redirect without validation.\n Using a specially crafted URL, an attacker could launch phishing attacks and steal user credentials.\n ## Countermeasures\n - Ensure data passed in HTTP requests does not control their final destination.\n ## Additional information\n **[CWE-601](https://cwe.mitre.org/data/definitions/601.html)**\n **[OWASP-A1](https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A1-Injection)**.',
							text: 'Open redirect: HTTP Request parameters are used in HTTP redirects via `res` in `anonymous1`\n\nHTTP request parameters are used in a HTTP redirect without validation.\n Using a specially crafted URL, an attacker could launch phishing attacks and steal user credentials.\n ## Countermeasures\n - Ensure data passed in HTTP requests does not control their final destination.\n ## Additional information\n **[CWE-601](https://cwe.mitre.org/data/definitions/601.html)**\n **[OWASP-A1](https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A1-Injection)**.',
						},
						locations: [
							{
								physicalLocation: {
									region: {
										snippet: {
											text: '    res.redirect(url);\n',
										},
										startLine: 17,
									},
									artifactLocation: {
										uri: 'file:///Volumes/Work/sandbox/explnode/vulnerabilities/redirect.js',
									},
									contextRegion: {
										snippet: {
											text: '    let url = encodeURI(req.query.url); //vulnerability\n    res.redirect(url);\n',
										},
										endLine: 17,
										startLine: 16,
									},
								},
							},
						],
						properties: {
							issue_confidence: 'HIGH',
							issue_severity: '3.0',
							issue_tags: {},
						},
						baselineState: 'new',
						partialFingerprints: {
							evidenceFingerprint: '',
						},
						ruleId: 'open-redirect',
						ruleIndex: 1,
					},
					{
						message: {
							markdown:
								'Open redirect: HTTP Request parameters are used in HTTP redirects via `res` in `anonymous`\n\nHTTP request parameters are used in a HTTP redirect without validation.\n Using a specially crafted URL, an attacker could launch phishing attacks and steal user credentials.\n ## Countermeasures\n - Ensure data passed in HTTP requests does not control their final destination.\n ## Additional information\n **[CWE-601](https://cwe.mitre.org/data/definitions/601.html)**\n **[OWASP-A1](https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A1-Injection)**.',
							text: 'Open redirect: HTTP Request parameters are used in HTTP redirects via `res` in `anonymous`\n\nHTTP request parameters are used in a HTTP redirect without validation.\n Using a specially crafted URL, an attacker could launch phishing attacks and steal user credentials.\n ## Countermeasures\n - Ensure data passed in HTTP requests does not control their final destination.\n ## Additional information\n **[CWE-601](https://cwe.mitre.org/data/definitions/601.html)**\n **[OWASP-A1](https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A1-Injection)**.',
						},
						locations: [
							{
								physicalLocation: {
									region: {
										snippet: {
											text: '    if(req.session.isAuthenticated()){\n',
										},
										startLine: 8,
									},
									artifactLocation: {
										uri: 'file:///Volumes/Work/sandbox/explnode/vulnerabilities/redirect.js',
									},
									contextRegion: {
										snippet: {
											text: '    let followPath = req.query.path;\n    if(req.session.isAuthenticated()){\n',
										},
										endLine: 8,
										startLine: 7,
									},
								},
							},
						],
						properties: {
							issue_confidence: 'HIGH',
							issue_severity: '3.0',
							issue_tags: {},
						},
						baselineState: 'new',
						partialFingerprints: {
							evidenceFingerprint: '',
						},
						ruleId: 'open-redirect',
						ruleIndex: 1,
					},
					{
						message: {
							markdown:
								'Open redirect: HTTP Request parameters are used in HTTP redirects via `req` in `anonymous1`\n\nHTTP request parameters are used in a HTTP redirect without validation.\n Using a specially crafted URL, an attacker could launch phishing attacks and steal user credentials.\n ## Countermeasures\n - Ensure data passed in HTTP requests does not control their final destination.\n ## Additional information\n **[CWE-601](https://cwe.mitre.org/data/definitions/601.html)**\n **[OWASP-A1](https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A1-Injection)**.',
							text: 'Open redirect: HTTP Request parameters are used in HTTP redirects via `req` in `anonymous1`\n\nHTTP request parameters are used in a HTTP redirect without validation.\n Using a specially crafted URL, an attacker could launch phishing attacks and steal user credentials.\n ## Countermeasures\n - Ensure data passed in HTTP requests does not control their final destination.\n ## Additional information\n **[CWE-601](https://cwe.mitre.org/data/definitions/601.html)**\n **[OWASP-A1](https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A1-Injection)**.',
						},
						locations: [
							{
								physicalLocation: {
									region: {
										snippet: {
											text: '    res.redirect(url);\n',
										},
										startLine: 17,
									},
									artifactLocation: {
										uri: 'file:///Volumes/Work/sandbox/explnode/vulnerabilities/redirect.js',
									},
									contextRegion: {
										snippet: {
											text: '    let url = encodeURI(req.query.url); //vulnerability\n    res.redirect(url);\n',
										},
										endLine: 17,
										startLine: 16,
									},
								},
							},
						],
						properties: {
							issue_confidence: 'HIGH',
							issue_severity: '3.0',
							issue_tags: {},
						},
						baselineState: 'new',
						partialFingerprints: {
							evidenceFingerprint: '',
						},
						ruleId: 'open-redirect',
						ruleIndex: 1,
					},
					{
						message: {
							markdown:
								'Open redirect: HTTP Request parameters are used in HTTP redirects via `req` in `anonymous`\n\nHTTP request parameters are used in a HTTP redirect without validation.\n Using a specially crafted URL, an attacker could launch phishing attacks and steal user credentials.\n ## Countermeasures\n - Ensure data passed in HTTP requests does not control their final destination.\n ## Additional information\n **[CWE-601](https://cwe.mitre.org/data/definitions/601.html)**\n **[OWASP-A1](https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A1-Injection)**.',
							text: 'Open redirect: HTTP Request parameters are used in HTTP redirects via `req` in `anonymous`\n\nHTTP request parameters are used in a HTTP redirect without validation.\n Using a specially crafted URL, an attacker could launch phishing attacks and steal user credentials.\n ## Countermeasures\n - Ensure data passed in HTTP requests does not control their final destination.\n ## Additional information\n **[CWE-601](https://cwe.mitre.org/data/definitions/601.html)**\n **[OWASP-A1](https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A1-Injection)**.',
						},
						locations: [
							{
								physicalLocation: {
									region: {
										snippet: {
											text: '    if(req.session.isAuthenticated()){\n',
										},
										startLine: 8,
									},
									artifactLocation: {
										uri: 'file:///Volumes/Work/sandbox/explnode/vulnerabilities/redirect.js',
									},
									contextRegion: {
										snippet: {
											text: '    let followPath = req.query.path;\n    if(req.session.isAuthenticated()){\n',
										},
										endLine: 8,
										startLine: 7,
									},
								},
							},
						],
						properties: {
							issue_confidence: 'HIGH',
							issue_severity: '3.0',
							issue_tags: {},
						},
						baselineState: 'new',
						partialFingerprints: {
							evidenceFingerprint: '',
						},
						ruleId: 'open-redirect',
						ruleIndex: 1,
					},
					{
						message: {
							markdown:
								'XSS: HTTP data to HTML via `req` in `anonymous`\n\nHTTP request data is used in rendering HTML without validation.\n By sending a specially crafted request, an attacker could inject malicious code into the website and compromise the confidentiality and integrity of the data exchanged between the service and users.\n ## Countermeasures\n - Sanitize and validate HTTP data before passing it back to the user.\n ## Additional information\n **[CWE-79](https://cwe.mitre.org/data/definitions/79.html)**\n **[OWASP-A7](https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A7-Cross-Site_Scripting_(XSS))**.',
							text: 'XSS: HTTP data to HTML via `req` in `anonymous`\n\nHTTP request data is used in rendering HTML without validation.\n By sending a specially crafted request, an attacker could inject malicious code into the website and compromise the confidentiality and integrity of the data exchanged between the service and users.\n ## Countermeasures\n - Sanitize and validate HTTP data before passing it back to the user.\n ## Additional information\n **[CWE-79](https://cwe.mitre.org/data/definitions/79.html)**\n **[OWASP-A7](https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A7-Cross-Site_Scripting_(XSS))**.',
						},
						locations: [
							{
								physicalLocation: {
									region: {
										snippet: {
											text: '    let config = {}\n',
										},
										startLine: 91,
									},
									artifactLocation: {
										uri: 'file:///Volumes/Work/sandbox/explnode/vulnerabilities/dep-lodash.js',
									},
									contextRegion: {
										snippet: {
											text: '    let userConfig = req.params.userConfig;\n    let config = {}\n',
										},
										endLine: 91,
										startLine: 90,
									},
								},
							},
						],
						properties: {
							issue_confidence: 'HIGH',
							issue_severity: '5.0',
							issue_tags: {},
						},
						baselineState: 'new',
						partialFingerprints: {
							evidenceFingerprint: '',
						},
						ruleId: 'xss-to-html',
						ruleIndex: 2,
					},
					{
						message: {
							markdown:
								'XSS: HTTP data to HTML via `req` in `anonymous`\n\nHTTP request data is used in rendering HTML without validation.\n By sending a specially crafted request, an attacker could inject malicious code into the website and compromise the confidentiality and integrity of the data exchanged between the service and users.\n ## Countermeasures\n - Sanitize and validate HTTP data before passing it back to the user.\n ## Additional information\n **[CWE-79](https://cwe.mitre.org/data/definitions/79.html)**\n **[OWASP-A7](https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A7-Cross-Site_Scripting_(XSS))**.',
							text: 'XSS: HTTP data to HTML via `req` in `anonymous`\n\nHTTP request data is used in rendering HTML without validation.\n By sending a specially crafted request, an attacker could inject malicious code into the website and compromise the confidentiality and integrity of the data exchanged between the service and users.\n ## Countermeasures\n - Sanitize and validate HTTP data before passing it back to the user.\n ## Additional information\n **[CWE-79](https://cwe.mitre.org/data/definitions/79.html)**\n **[OWASP-A7](https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A7-Cross-Site_Scripting_(XSS))**.',
						},
						locations: [
							{
								physicalLocation: {
									region: {
										snippet: {
											text: '    res.send(\'<h1> Hello :\'+ name +"</h1>")\n',
										},
										startLine: 6,
									},
									artifactLocation: {
										uri: 'file:///Volumes/Work/sandbox/explnode/vulnerabilities/xss.js',
									},
									contextRegion: {
										snippet: {
											text: '    const { name }  = req.query;\n    res.send(\'<h1> Hello :\'+ name +"</h1>")\n',
										},
										endLine: 6,
										startLine: 5,
									},
								},
							},
						],
						properties: {
							issue_confidence: 'HIGH',
							issue_severity: '5.0',
							issue_tags: {},
						},
						baselineState: 'new',
						partialFingerprints: {
							evidenceFingerprint: '',
						},
						ruleId: 'xss-to-html',
						ruleIndex: 2,
					},
					{
						message: {
							markdown:
								'XSS: HTTP data to HTML via `req` in `anonymous1`\n\nHTTP request data is used in rendering HTML without validation.\n By sending a specially crafted request, an attacker could inject malicious code into the website and compromise the confidentiality and integrity of the data exchanged between the service and users.\n ## Countermeasures\n - Sanitize and validate HTTP data before passing it back to the user.\n ## Additional information\n **[CWE-79](https://cwe.mitre.org/data/definitions/79.html)**\n **[OWASP-A7](https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A7-Cross-Site_Scripting_(XSS))**.',
							text: 'XSS: HTTP data to HTML via `req` in `anonymous1`\n\nHTTP request data is used in rendering HTML without validation.\n By sending a specially crafted request, an attacker could inject malicious code into the website and compromise the confidentiality and integrity of the data exchanged between the service and users.\n ## Countermeasures\n - Sanitize and validate HTTP data before passing it back to the user.\n ## Additional information\n **[CWE-79](https://cwe.mitre.org/data/definitions/79.html)**\n **[OWASP-A7](https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A7-Cross-Site_Scripting_(XSS))**.',
						},
						locations: [
							{
								physicalLocation: {
									region: {
										snippet: {
											text: '    let userConfig = req.params.userConfig;\n',
										},
										startLine: 97,
									},
									artifactLocation: {
										uri: 'file:///Volumes/Work/sandbox/explnode/vulnerabilities/dep-lodash.js',
									},
									contextRegion: {
										snippet: {
											text: "router.get('/example3/user/:userConfig',  (req,res) => {\n    let userConfig = req.params.userConfig;\n",
										},
										endLine: 97,
										startLine: 96,
									},
								},
							},
						],
						properties: {
							issue_confidence: 'HIGH',
							issue_severity: '5.0',
							issue_tags: {},
						},
						baselineState: 'new',
						partialFingerprints: {
							evidenceFingerprint: '',
						},
						ruleId: 'xss-to-html',
						ruleIndex: 2,
					},
					{
						message: {
							markdown:
								'XSS: HTTP data to HTML via `req` in `anonymous`\n\nHTTP request data is used in rendering HTML without validation.\n By sending a specially crafted request, an attacker could inject malicious code into the website and compromise the confidentiality and integrity of the data exchanged between the service and users.\n ## Countermeasures\n - Sanitize and validate HTTP data before passing it back to the user.\n ## Additional information\n **[CWE-79](https://cwe.mitre.org/data/definitions/79.html)**\n **[OWASP-A7](https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A7-Cross-Site_Scripting_(XSS))**.',
							text: 'XSS: HTTP data to HTML via `req` in `anonymous`\n\nHTTP request data is used in rendering HTML without validation.\n By sending a specially crafted request, an attacker could inject malicious code into the website and compromise the confidentiality and integrity of the data exchanged between the service and users.\n ## Countermeasures\n - Sanitize and validate HTTP data before passing it back to the user.\n ## Additional information\n **[CWE-79](https://cwe.mitre.org/data/definitions/79.html)**\n **[OWASP-A7](https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A7-Cross-Site_Scripting_(XSS))**.',
						},
						locations: [
							{
								physicalLocation: {
									region: {
										snippet: {
											text: '    var obj = req.body.users;\n',
										},
										startLine: 6,
									},
									artifactLocation: {
										uri: 'file:///Volumes/Work/sandbox/explnode/vulnerabilities/loop.js',
									},
									contextRegion: {
										snippet: {
											text: 'router.post("/list-users", (req, res) => { \n    var obj = req.body.users;\n',
										},
										endLine: 6,
										startLine: 5,
									},
								},
							},
						],
						properties: {
							issue_confidence: 'HIGH',
							issue_severity: '5.0',
							issue_tags: {},
						},
						baselineState: 'new',
						partialFingerprints: {
							evidenceFingerprint: '',
						},
						ruleId: 'xss-to-html',
						ruleIndex: 2,
					},
					{
						message: {
							markdown:
								'Sensitive Data Leak: Attacker controlled data used in redirect via `req` in `anonymous`\n\nAn attacker can redirect traffic from the application. This way the attacker could perform phishing attacks and/or steal sensitive data.\n\n\n## Countermeasures\n\nThis vulnerability can be prevented by validating all the data that is used to redirect users on different pages or website and by alerting the user before doing so.',
							text: 'Sensitive Data Leak: Attacker controlled data used in redirect via `req` in `anonymous`\n\nAn attacker can redirect traffic from the application. This way the attacker could perform phishing attacks and/or steal sensitive data.\n\n\n## Countermeasures\n\nThis vulnerability can be prevented by validating all the data that is used to redirect users on different pages or website and by alerting the user before doing so.',
						},
						locations: [
							{
								physicalLocation: {
									region: {
										snippet: {
											text: '    if(req.session.isAuthenticated()){\n',
										},
										startLine: 8,
									},
									artifactLocation: {
										uri: 'file:///Volumes/Work/sandbox/explnode/vulnerabilities/redirect.js',
									},
									contextRegion: {
										snippet: {
											text: '    let followPath = req.query.path;\n    if(req.session.isAuthenticated()){\n',
										},
										endLine: 8,
										startLine: 7,
									},
								},
							},
						],
						properties: {
							issue_confidence: 'HIGH',
							issue_severity: '5.0',
							issue_tags: {},
						},
						baselineState: 'new',
						partialFingerprints: {
							evidenceFingerprint: '',
						},
						ruleId: 'attacker-to-redirect',
						ruleIndex: 3,
					},
					{
						message: {
							markdown:
								'Sensitive Data Leak: Attacker controlled data used in redirect via `req` in `anonymous1`\n\nAn attacker can redirect traffic from the application. This way the attacker could perform phishing attacks and/or steal sensitive data.\n\n\n## Countermeasures\n\nThis vulnerability can be prevented by validating all the data that is used to redirect users on different pages or website and by alerting the user before doing so.',
							text: 'Sensitive Data Leak: Attacker controlled data used in redirect via `req` in `anonymous1`\n\nAn attacker can redirect traffic from the application. This way the attacker could perform phishing attacks and/or steal sensitive data.\n\n\n## Countermeasures\n\nThis vulnerability can be prevented by validating all the data that is used to redirect users on different pages or website and by alerting the user before doing so.',
						},
						locations: [
							{
								physicalLocation: {
									region: {
										snippet: {
											text: '    res.redirect(url);\n',
										},
										startLine: 17,
									},
									artifactLocation: {
										uri: 'file:///Volumes/Work/sandbox/explnode/vulnerabilities/redirect.js',
									},
									contextRegion: {
										snippet: {
											text: '    let url = encodeURI(req.query.url); //vulnerability\n    res.redirect(url);\n',
										},
										endLine: 17,
										startLine: 16,
									},
								},
							},
						],
						properties: {
							issue_confidence: 'HIGH',
							issue_severity: '5.0',
							issue_tags: {},
						},
						baselineState: 'new',
						partialFingerprints: {
							evidenceFingerprint: '',
						},
						ruleId: 'attacker-to-redirect',
						ruleIndex: 3,
					},
					{
						message: {
							markdown:
								'Sensitive data from an external API response is leaked via log or persistent storage\n\nHTTP data is written to a log file or persisted in an insecure storage in this flow.\n This data may be visible to a third party that has access to the logs or the local storage, such as system administrators. Many web applications and APIs do not protect sensitive data, such as financial and healthcare. Attackers may steal or modify such weakly protected data to conduct credit card fraud, identity theft, or other crimes.\n ## Countermeasures\n - This vulnerability can be prevented by not writing HTTP data directly to the log and the persistent storage or by sanitizing or obfuscating the data in advance.\n ## Additional information\n **[CWE-200](https://cwe.mitre.org/data/definitions/200.html)**\n **[CWE-200](https://cwe.mitre.org/data/definitions/200.html)**\n **[OWASP-A3](https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A3-Sensitive_Data_Exposure)**.',
							text: 'Sensitive data from an external API response is leaked via log or persistent storage\n\nHTTP data is written to a log file or persisted in an insecure storage in this flow.\n This data may be visible to a third party that has access to the logs or the local storage, such as system administrators. Many web applications and APIs do not protect sensitive data, such as financial and healthcare. Attackers may steal or modify such weakly protected data to conduct credit card fraud, identity theft, or other crimes.\n ## Countermeasures\n - This vulnerability can be prevented by not writing HTTP data directly to the log and the persistent storage or by sanitizing or obfuscating the data in advance.\n ## Additional information\n **[CWE-200](https://cwe.mitre.org/data/definitions/200.html)**\n **[CWE-200](https://cwe.mitre.org/data/definitions/200.html)**\n **[OWASP-A3](https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A3-Sensitive_Data_Exposure)**.',
						},
						locations: [
							{
								physicalLocation: {
									region: {
										snippet: {
											text: '    }\n',
										},
										startLine: 13,
									},
									artifactLocation: {
										uri: 'file:///Volumes/Work/sandbox/explnode/vulnerabilities/sensitive.js',
									},
									contextRegion: {
										snippet: {
											text: '        console.log(req.query.password); // data leak\n    }\n',
										},
										endLine: 13,
										startLine: 12,
									},
								},
							},
						],
						properties: {
							issue_confidence: 'HIGH',
							issue_severity: '7.0',
							issue_tags: {},
						},
						baselineState: 'new',
						partialFingerprints: {
							evidenceFingerprint: '',
						},
						ruleId: 'sensitive-response-leak',
						ruleIndex: 4,
					},
					{
						message: {
							markdown:
								'Sensitive data from an external API response is leaked via log or persistent storage\n\nHTTP data is written to a log file or persisted in an insecure storage in this flow.\n This data may be visible to a third party that has access to the logs or the local storage, such as system administrators. Many web applications and APIs do not protect sensitive data, such as financial and healthcare. Attackers may steal or modify such weakly protected data to conduct credit card fraud, identity theft, or other crimes.\n ## Countermeasures\n - This vulnerability can be prevented by not writing HTTP data directly to the log and the persistent storage or by sanitizing or obfuscating the data in advance.\n ## Additional information\n **[CWE-200](https://cwe.mitre.org/data/definitions/200.html)**\n **[CWE-200](https://cwe.mitre.org/data/definitions/200.html)**\n **[OWASP-A3](https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A3-Sensitive_Data_Exposure)**.',
							text: 'Sensitive data from an external API response is leaked via log or persistent storage\n\nHTTP data is written to a log file or persisted in an insecure storage in this flow.\n This data may be visible to a third party that has access to the logs or the local storage, such as system administrators. Many web applications and APIs do not protect sensitive data, such as financial and healthcare. Attackers may steal or modify such weakly protected data to conduct credit card fraud, identity theft, or other crimes.\n ## Countermeasures\n - This vulnerability can be prevented by not writing HTTP data directly to the log and the persistent storage or by sanitizing or obfuscating the data in advance.\n ## Additional information\n **[CWE-200](https://cwe.mitre.org/data/definitions/200.html)**\n **[CWE-200](https://cwe.mitre.org/data/definitions/200.html)**\n **[OWASP-A3](https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A3-Sensitive_Data_Exposure)**.',
						},
						locations: [
							{
								physicalLocation: {
									region: {
										snippet: {
											text: '})\n',
										},
										startLine: 49,
									},
									artifactLocation: {
										uri: 'file:///Volumes/Work/sandbox/explnode/vulnerabilities/nosqli.js',
									},
									contextRegion: {
										snippet: {
											text: '  \n})\n',
										},
										endLine: 49,
										startLine: 48,
									},
								},
							},
						],
						properties: {
							issue_confidence: 'HIGH',
							issue_severity: '7.0',
							issue_tags: {},
						},
						baselineState: 'new',
						partialFingerprints: {
							evidenceFingerprint: '',
						},
						ruleId: 'sensitive-response-leak',
						ruleIndex: 4,
					},
					{
						message: {
							markdown:
								'Sensitive data from an external API response is leaked via log or persistent storage\n\nHTTP data is written to a log file or persisted in an insecure storage in this flow.\n This data may be visible to a third party that has access to the logs or the local storage, such as system administrators. Many web applications and APIs do not protect sensitive data, such as financial and healthcare. Attackers may steal or modify such weakly protected data to conduct credit card fraud, identity theft, or other crimes.\n ## Countermeasures\n - This vulnerability can be prevented by not writing HTTP data directly to the log and the persistent storage or by sanitizing or obfuscating the data in advance.\n ## Additional information\n **[CWE-200](https://cwe.mitre.org/data/definitions/200.html)**\n **[CWE-200](https://cwe.mitre.org/data/definitions/200.html)**\n **[OWASP-A3](https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A3-Sensitive_Data_Exposure)**.',
							text: 'Sensitive data from an external API response is leaked via log or persistent storage\n\nHTTP data is written to a log file or persisted in an insecure storage in this flow.\n This data may be visible to a third party that has access to the logs or the local storage, such as system administrators. Many web applications and APIs do not protect sensitive data, such as financial and healthcare. Attackers may steal or modify such weakly protected data to conduct credit card fraud, identity theft, or other crimes.\n ## Countermeasures\n - This vulnerability can be prevented by not writing HTTP data directly to the log and the persistent storage or by sanitizing or obfuscating the data in advance.\n ## Additional information\n **[CWE-200](https://cwe.mitre.org/data/definitions/200.html)**\n **[CWE-200](https://cwe.mitre.org/data/definitions/200.html)**\n **[OWASP-A3](https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A3-Sensitive_Data_Exposure)**.',
						},
						locations: [
							{
								physicalLocation: {
									region: {
										snippet: {
											text: '    console.log(password);\n',
										},
										startLine: 6,
									},
									artifactLocation: {
										uri: 'file:///Volumes/Work/sandbox/explnode/vulnerabilities/sensitive.js',
									},
									contextRegion: {
										snippet: {
											text: '    const { username, password }  = req.query;\n    console.log(password);\n',
										},
										endLine: 6,
										startLine: 5,
									},
								},
							},
						],
						properties: {
							issue_confidence: 'HIGH',
							issue_severity: '7.0',
							issue_tags: {},
						},
						baselineState: 'new',
						partialFingerprints: {
							evidenceFingerprint: '',
						},
						ruleId: 'sensitive-response-leak',
						ruleIndex: 4,
					},
					{
						message: {
							markdown:
								'Prototype Pollution: Attacker-controlled object leading to RCE or XSS via `req` in `check`\n\nAn attacker-controlled object is used in a procedure that can change the `Object.prototype` property.\n This might allow an attacker to execute arbitrary code remotely, extract sensitive data from the system and compromise the integrity of the system completely.\n ## Countermeasures\n - Ensure `lodash` version `4.17.12+` is used with safer `merge` and `extend` functions.\n - Avoid using `defaultsDeep`, since the function can lead to object mutation.\n ## Additional information\n **[CWE-89](https://cwe.mitre.org/data/definitions/89.html)**\n **[OWASP-A1](https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A1-Injection)**\n **[Javascript Object prototypes](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Object_prototypes)**.',
							text: 'Prototype Pollution: Attacker-controlled object leading to RCE or XSS via `req` in `check`\n\nAn attacker-controlled object is used in a procedure that can change the `Object.prototype` property.\n This might allow an attacker to execute arbitrary code remotely, extract sensitive data from the system and compromise the integrity of the system completely.\n ## Countermeasures\n - Ensure `lodash` version `4.17.12+` is used with safer `merge` and `extend` functions.\n - Avoid using `defaultsDeep`, since the function can lead to object mutation.\n ## Additional information\n **[CWE-89](https://cwe.mitre.org/data/definitions/89.html)**\n **[OWASP-A1](https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A1-Injection)**\n **[Javascript Object prototypes](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Object_prototypes)**.',
						},
						locations: [
							{
								physicalLocation: {
									region: {
										snippet: {
											text: '    let user = getCurrentUser(config);\n',
										},
										startLine: 12,
									},
									artifactLocation: {
										uri: 'file:///Volumes/Work/sandbox/explnode/vulnerabilities/dep-lodash.js',
									},
									contextRegion: {
										snippet: {
											text: '\n    let user = getCurrentUser(config);\n',
										},
										endLine: 12,
										startLine: 11,
									},
								},
							},
						],
						properties: {
							issue_confidence: 'HIGH',
							issue_severity: '7.0',
							issue_tags: {},
						},
						baselineState: 'new',
						partialFingerprints: {
							evidenceFingerprint: '',
						},
						ruleId: 'prototype-pollution',
						ruleIndex: 5,
					},
					{
						message: {
							markdown:
								'Sensitive Data Leak: Sensitive data is leaked via `req` to log in `anonymous`\n\nSensitive data leak detected in this flow. This data may be visible to a third party that has access to the logs, such as system administrators. Many web applications and APIs do not protect sensitive data, such as financial and healthcare. Attackers may steal or modify such weakly protected data to conduct credit card fraud, identity theft, or other crimes.\n\n\n## Countermeasures\n\nThis vulnerability can be prevented by not writing sensitive data to the log or by encrypting it in advance.\n\n## Additional information\n\n**[CWE-200](https://cwe.mitre.org/data/definitions/200.html)**\n\n**[CWE-117](https://cwe.mitre.org/data/definitions/117.html)**\n\n**[OWASP-A3](https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A3-Sensitive_Data_Exposure)**.',
							text: 'Sensitive Data Leak: Sensitive data is leaked via `req` to log in `anonymous`\n\nSensitive data leak detected in this flow. This data may be visible to a third party that has access to the logs, such as system administrators. Many web applications and APIs do not protect sensitive data, such as financial and healthcare. Attackers may steal or modify such weakly protected data to conduct credit card fraud, identity theft, or other crimes.\n\n\n## Countermeasures\n\nThis vulnerability can be prevented by not writing sensitive data to the log or by encrypting it in advance.\n\n## Additional information\n\n**[CWE-200](https://cwe.mitre.org/data/definitions/200.html)**\n\n**[CWE-117](https://cwe.mitre.org/data/definitions/117.html)**\n\n**[OWASP-A3](https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A3-Sensitive_Data_Exposure)**.',
						},
						locations: [
							{
								physicalLocation: {
									region: {
										snippet: {
											text: '    console.log(password);\n',
										},
										startLine: 6,
									},
									artifactLocation: {
										uri: 'file:///Volumes/Work/sandbox/explnode/vulnerabilities/sensitive.js',
									},
									contextRegion: {
										snippet: {
											text: '    const { username, password }  = req.query;\n    console.log(password);\n',
										},
										endLine: 6,
										startLine: 5,
									},
								},
							},
						],
						properties: {
							issue_confidence: 'HIGH',
							issue_severity: '8.0',
							issue_tags: {},
						},
						baselineState: 'new',
						partialFingerprints: {
							evidenceFingerprint: '',
						},
						ruleId: 'sensitive-to-log',
						ruleIndex: 6,
					},
					{
						message: {
							markdown:
								'Sensitive Data Leak: Sensitive data is leaked to log in `anonymous`\n\nSensitive data leak detected in this flow. This data may be visible to a third party that has access to the logs, such as system administrators. Many web applications and APIs do not protect sensitive data, such as financial and healthcare. Attackers may steal or modify such weakly protected data to conduct credit card fraud, identity theft, or other crimes.\n\n\n## Countermeasures\n\nThis vulnerability can be prevented by not writing sensitive data to the log or by encrypting it in advance.\n\n## Additional information\n\n**[CWE-200](https://cwe.mitre.org/data/definitions/200.html)**\n\n**[CWE-117](https://cwe.mitre.org/data/definitions/117.html)**\n\n**[OWASP-A3](https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A3-Sensitive_Data_Exposure)**.',
							text: 'Sensitive Data Leak: Sensitive data is leaked to log in `anonymous`\n\nSensitive data leak detected in this flow. This data may be visible to a third party that has access to the logs, such as system administrators. Many web applications and APIs do not protect sensitive data, such as financial and healthcare. Attackers may steal or modify such weakly protected data to conduct credit card fraud, identity theft, or other crimes.\n\n\n## Countermeasures\n\nThis vulnerability can be prevented by not writing sensitive data to the log or by encrypting it in advance.\n\n## Additional information\n\n**[CWE-200](https://cwe.mitre.org/data/definitions/200.html)**\n\n**[CWE-117](https://cwe.mitre.org/data/definitions/117.html)**\n\n**[OWASP-A3](https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A3-Sensitive_Data_Exposure)**.',
						},
						locations: [
							{
								physicalLocation: {
									region: {
										snippet: {
											text: '    console.log(password);\n',
										},
										startLine: 6,
									},
									artifactLocation: {
										uri: 'file:///Volumes/Work/sandbox/explnode/vulnerabilities/sensitive.js',
									},
									contextRegion: {
										snippet: {
											text: '    const { username, password }  = req.query;\n    console.log(password);\n',
										},
										endLine: 6,
										startLine: 5,
									},
								},
							},
						],
						properties: {
							issue_confidence: 'HIGH',
							issue_severity: '8.0',
							issue_tags: {},
						},
						baselineState: 'new',
						partialFingerprints: {
							evidenceFingerprint: '',
						},
						ruleId: 'sensitive-to-log',
						ruleIndex: 6,
					},
					{
						message: {
							markdown:
								'Sensitive Data Leak: Sensitive data is leaked via `req` to log in `anonymous2`\n\nSensitive data leak detected in this flow. This data may be visible to a third party that has access to the logs, such as system administrators. Many web applications and APIs do not protect sensitive data, such as financial and healthcare. Attackers may steal or modify such weakly protected data to conduct credit card fraud, identity theft, or other crimes.\n\n\n## Countermeasures\n\nThis vulnerability can be prevented by not writing sensitive data to the log or by encrypting it in advance.\n\n## Additional information\n\n**[CWE-200](https://cwe.mitre.org/data/definitions/200.html)**\n\n**[CWE-117](https://cwe.mitre.org/data/definitions/117.html)**\n\n**[OWASP-A3](https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A3-Sensitive_Data_Exposure)**.',
							text: 'Sensitive Data Leak: Sensitive data is leaked via `req` to log in `anonymous2`\n\nSensitive data leak detected in this flow. This data may be visible to a third party that has access to the logs, such as system administrators. Many web applications and APIs do not protect sensitive data, such as financial and healthcare. Attackers may steal or modify such weakly protected data to conduct credit card fraud, identity theft, or other crimes.\n\n\n## Countermeasures\n\nThis vulnerability can be prevented by not writing sensitive data to the log or by encrypting it in advance.\n\n## Additional information\n\n**[CWE-200](https://cwe.mitre.org/data/definitions/200.html)**\n\n**[CWE-117](https://cwe.mitre.org/data/definitions/117.html)**\n\n**[OWASP-A3](https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A3-Sensitive_Data_Exposure)**.',
						},
						locations: [
							{
								physicalLocation: {
									region: {
										snippet: {
											text: '    if(req.session.isAuthenticated()) {\n',
										},
										startLine: 20,
									},
									artifactLocation: {
										uri: 'file:///Volumes/Work/sandbox/explnode/vulnerabilities/sensitive.js',
									},
									contextRegion: {
										snippet: {
											text: '    let data = {}\n    if(req.session.isAuthenticated()) {\n',
										},
										endLine: 20,
										startLine: 19,
									},
								},
							},
						],
						properties: {
							issue_confidence: 'HIGH',
							issue_severity: '8.0',
							issue_tags: {},
						},
						baselineState: 'new',
						partialFingerprints: {
							evidenceFingerprint: '',
						},
						ruleId: 'sensitive-to-log',
						ruleIndex: 6,
					},
					{
						message: {
							markdown:
								'Sensitive Data Leak: Sensitive data is leaked to log in `anonymous2`\n\nSensitive data leak detected in this flow. This data may be visible to a third party that has access to the logs, such as system administrators. Many web applications and APIs do not protect sensitive data, such as financial and healthcare. Attackers may steal or modify such weakly protected data to conduct credit card fraud, identity theft, or other crimes.\n\n\n## Countermeasures\n\nThis vulnerability can be prevented by not writing sensitive data to the log or by encrypting it in advance.\n\n## Additional information\n\n**[CWE-200](https://cwe.mitre.org/data/definitions/200.html)**\n\n**[CWE-117](https://cwe.mitre.org/data/definitions/117.html)**\n\n**[OWASP-A3](https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A3-Sensitive_Data_Exposure)**.',
							text: 'Sensitive Data Leak: Sensitive data is leaked to log in `anonymous2`\n\nSensitive data leak detected in this flow. This data may be visible to a third party that has access to the logs, such as system administrators. Many web applications and APIs do not protect sensitive data, such as financial and healthcare. Attackers may steal or modify such weakly protected data to conduct credit card fraud, identity theft, or other crimes.\n\n\n## Countermeasures\n\nThis vulnerability can be prevented by not writing sensitive data to the log or by encrypting it in advance.\n\n## Additional information\n\n**[CWE-200](https://cwe.mitre.org/data/definitions/200.html)**\n\n**[CWE-117](https://cwe.mitre.org/data/definitions/117.html)**\n\n**[OWASP-A3](https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A3-Sensitive_Data_Exposure)**.',
						},
						locations: [
							{
								physicalLocation: {
									region: {
										snippet: {
											text: '    if(req.session.isAuthenticated()) {\n',
										},
										startLine: 20,
									},
									artifactLocation: {
										uri: 'file:///Volumes/Work/sandbox/explnode/vulnerabilities/sensitive.js',
									},
									contextRegion: {
										snippet: {
											text: '    let data = {}\n    if(req.session.isAuthenticated()) {\n',
										},
										endLine: 20,
										startLine: 19,
									},
								},
							},
						],
						properties: {
							issue_confidence: 'HIGH',
							issue_severity: '8.0',
							issue_tags: {},
						},
						baselineState: 'new',
						partialFingerprints: {
							evidenceFingerprint: '',
						},
						ruleId: 'sensitive-to-log',
						ruleIndex: 6,
					},
					{
						message: {
							markdown:
								'Sensitive Data Leak: Sensitive data is leaked via `req` to log in `anonymous2`\n\nSensitive data leak detected in this flow. This data may be visible to a third party that has access to the logs, such as system administrators. Many web applications and APIs do not protect sensitive data, such as financial and healthcare. Attackers may steal or modify such weakly protected data to conduct credit card fraud, identity theft, or other crimes.\n\n\n## Countermeasures\n\nThis vulnerability can be prevented by not writing sensitive data to the log or by encrypting it in advance.\n\n## Additional information\n\n**[CWE-200](https://cwe.mitre.org/data/definitions/200.html)**\n\n**[CWE-117](https://cwe.mitre.org/data/definitions/117.html)**\n\n**[OWASP-A3](https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A3-Sensitive_Data_Exposure)**.',
							text: 'Sensitive Data Leak: Sensitive data is leaked via `req` to log in `anonymous2`\n\nSensitive data leak detected in this flow. This data may be visible to a third party that has access to the logs, such as system administrators. Many web applications and APIs do not protect sensitive data, such as financial and healthcare. Attackers may steal or modify such weakly protected data to conduct credit card fraud, identity theft, or other crimes.\n\n\n## Countermeasures\n\nThis vulnerability can be prevented by not writing sensitive data to the log or by encrypting it in advance.\n\n## Additional information\n\n**[CWE-200](https://cwe.mitre.org/data/definitions/200.html)**\n\n**[CWE-117](https://cwe.mitre.org/data/definitions/117.html)**\n\n**[OWASP-A3](https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A3-Sensitive_Data_Exposure)**.',
						},
						locations: [
							{
								physicalLocation: {
									region: {
										snippet: {
											text: '    if(req.session.isAuthenticated()) {\n',
										},
										startLine: 20,
									},
									artifactLocation: {
										uri: 'file:///Volumes/Work/sandbox/explnode/vulnerabilities/sensitive.js',
									},
									contextRegion: {
										snippet: {
											text: '    let data = {}\n    if(req.session.isAuthenticated()) {\n',
										},
										endLine: 20,
										startLine: 19,
									},
								},
							},
						],
						properties: {
							issue_confidence: 'HIGH',
							issue_severity: '8.0',
							issue_tags: {},
						},
						baselineState: 'new',
						partialFingerprints: {
							evidenceFingerprint: '',
						},
						ruleId: 'sensitive-to-log',
						ruleIndex: 6,
					},
					{
						message: {
							markdown:
								'Sensitive Data Leak: Sensitive data is leaked to log in `anonymous2`\n\nSensitive data leak detected in this flow. This data may be visible to a third party that has access to the logs, such as system administrators. Many web applications and APIs do not protect sensitive data, such as financial and healthcare. Attackers may steal or modify such weakly protected data to conduct credit card fraud, identity theft, or other crimes.\n\n\n## Countermeasures\n\nThis vulnerability can be prevented by not writing sensitive data to the log or by encrypting it in advance.\n\n## Additional information\n\n**[CWE-200](https://cwe.mitre.org/data/definitions/200.html)**\n\n**[CWE-117](https://cwe.mitre.org/data/definitions/117.html)**\n\n**[OWASP-A3](https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A3-Sensitive_Data_Exposure)**.',
							text: 'Sensitive Data Leak: Sensitive data is leaked to log in `anonymous2`\n\nSensitive data leak detected in this flow. This data may be visible to a third party that has access to the logs, such as system administrators. Many web applications and APIs do not protect sensitive data, such as financial and healthcare. Attackers may steal or modify such weakly protected data to conduct credit card fraud, identity theft, or other crimes.\n\n\n## Countermeasures\n\nThis vulnerability can be prevented by not writing sensitive data to the log or by encrypting it in advance.\n\n## Additional information\n\n**[CWE-200](https://cwe.mitre.org/data/definitions/200.html)**\n\n**[CWE-117](https://cwe.mitre.org/data/definitions/117.html)**\n\n**[OWASP-A3](https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A3-Sensitive_Data_Exposure)**.',
						},
						locations: [
							{
								physicalLocation: {
									region: {
										snippet: {
											text: '    if(req.session.isAuthenticated()) {\n',
										},
										startLine: 20,
									},
									artifactLocation: {
										uri: 'file:///Volumes/Work/sandbox/explnode/vulnerabilities/sensitive.js',
									},
									contextRegion: {
										snippet: {
											text: '    let data = {}\n    if(req.session.isAuthenticated()) {\n',
										},
										endLine: 20,
										startLine: 19,
									},
								},
							},
						],
						properties: {
							issue_confidence: 'HIGH',
							issue_severity: '8.0',
							issue_tags: {},
						},
						baselineState: 'new',
						partialFingerprints: {
							evidenceFingerprint: '',
						},
						ruleId: 'sensitive-to-log',
						ruleIndex: 6,
					},
					{
						message: {
							markdown:
								'XSS: HTTP data to HTML via `req` in `anonymous1`\n\nData from HTTP request parameters is used in HTML or session information. Unless the string is validated, this may result in a XSS attack.\n\n\n## Countermeasures\n\nThis vulnerability can be prevented by using input sanitization/validation techniques (e.g., whitelisting) on the HTTP data before using it inside another HTTP header.\n\n## Additional information\n\n**[CWE-79](https://cwe.mitre.org/data/definitions/79.html)**\n\n**[OWASP-A7](https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A7-Cross-Site_Scripting_(XSS))**.',
							text: 'XSS: HTTP data to HTML via `req` in `anonymous1`\n\nData from HTTP request parameters is used in HTML or session information. Unless the string is validated, this may result in a XSS attack.\n\n\n## Countermeasures\n\nThis vulnerability can be prevented by using input sanitization/validation techniques (e.g., whitelisting) on the HTTP data before using it inside another HTTP header.\n\n## Additional information\n\n**[CWE-79](https://cwe.mitre.org/data/definitions/79.html)**\n\n**[OWASP-A7](https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A7-Cross-Site_Scripting_(XSS))**.',
						},
						locations: [
							{
								physicalLocation: {
									region: {
										snippet: {
											text: '    name = req.query.name\n',
										},
										startLine: 10,
									},
									artifactLocation: {
										uri: 'file:///Volumes/Work/sandbox/explnode/vulnerabilities/xss.js',
									},
									contextRegion: {
										snippet: {
											text: "router.get('/greet-template', (req,res) => {\n    name = req.query.name\n",
										},
										endLine: 10,
										startLine: 9,
									},
								},
							},
						],
						properties: {
							issue_confidence: 'HIGH',
							issue_severity: '8.0',
							issue_tags: {},
						},
						baselineState: 'new',
						partialFingerprints: {
							evidenceFingerprint: '',
						},
						ruleId: 'xss-to-html',
						ruleIndex: 2,
					},
					{
						message: {
							markdown:
								'SQL Injection: HTTP data to SQL database via `req` in `anonymous`\n\nHTTP data is used in a SQL query without undergoing escaping or validation. This could allow an attacker to read sensitive data from the database, modify its content or gain control over the server.\n\n\n## Countermeasures\n\nThis vulnerability can be prevented by using prepared statements on the HTTP data.\n\n## Additional information\n\n**[CWE-89](https://cwe.mitre.org/data/definitions/89.html)**\n\n**[OWASP-A1](https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A1-Injection)**.',
							text: 'SQL Injection: HTTP data to SQL database via `req` in `anonymous`\n\nHTTP data is used in a SQL query without undergoing escaping or validation. This could allow an attacker to read sensitive data from the database, modify its content or gain control over the server.\n\n\n## Countermeasures\n\nThis vulnerability can be prevented by using prepared statements on the HTTP data.\n\n## Additional information\n\n**[CWE-89](https://cwe.mitre.org/data/definitions/89.html)**\n\n**[OWASP-A1](https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A1-Injection)**.',
						},
						locations: [
							{
								physicalLocation: {
									region: {
										snippet: {
											text: '        res.json(result);\n',
										},
										startLine: 19,
									},
									artifactLocation: {
										uri: 'file:///Volumes/Work/sandbox/explnode/vulnerabilities/sqli.js',
									},
									contextRegion: {
										snippet: {
											text: '    connection.query("SELECT * FROM users WHERE id=" + userId,(err, result) => {\n        res.json(result);\n',
										},
										endLine: 19,
										startLine: 18,
									},
								},
							},
						],
						properties: {
							issue_confidence: 'HIGH',
							issue_severity: '9.0',
							issue_tags: {},
						},
						baselineState: 'new',
						partialFingerprints: {
							evidenceFingerprint: '',
						},
						ruleId: 'sql-injection-http',
						ruleIndex: 7,
					},
					{
						message: {
							markdown:
								'Remote Code Execution: Command Injection through HTTP via `ctx` in `anonymous`\n\nHTTP data is used in a shell command without undergoing escaping or validation. This could allow an attacker to execute code on the server. Injection flaws occur when untrusted data is sent to an interpreter as part of a command or query. By injecting hostile data, an attacker may trick the interpreter into executing unintended commands or accessing data without authorization which can result in data loss, corruption, or disclosure to unauthorized parties, loss of accountability, denial of access or even a complete host takeover.\n\n\n## Countermeasures\n\nThis vulnerability can be prevented by using parameterized queries or by validating HTTP data (preferably on server-side by means of common input sanitation libraries or whitelisting) before using it.\n\n## Additional information\n\n**[CWE-77](https://cwe.mitre.org/data/definitions/77.html)**\n\n**[CWE-78](https://cwe.mitre.org/data/definitions/78.html)**\n\n**[CWE-917](https://cwe.mitre.org/data/definitions/917.html)**\n\n**[OWASP-A1](https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A1-Injection)**.',
							text: 'Remote Code Execution: Command Injection through HTTP via `ctx` in `anonymous`\n\nHTTP data is used in a shell command without undergoing escaping or validation. This could allow an attacker to execute code on the server. Injection flaws occur when untrusted data is sent to an interpreter as part of a command or query. By injecting hostile data, an attacker may trick the interpreter into executing unintended commands or accessing data without authorization which can result in data loss, corruption, or disclosure to unauthorized parties, loss of accountability, denial of access or even a complete host takeover.\n\n\n## Countermeasures\n\nThis vulnerability can be prevented by using parameterized queries or by validating HTTP data (preferably on server-side by means of common input sanitation libraries or whitelisting) before using it.\n\n## Additional information\n\n**[CWE-77](https://cwe.mitre.org/data/definitions/77.html)**\n\n**[CWE-78](https://cwe.mitre.org/data/definitions/78.html)**\n\n**[CWE-917](https://cwe.mitre.org/data/definitions/917.html)**\n\n**[OWASP-A1](https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A1-Injection)**.',
						},
						locations: [
							{
								physicalLocation: {
									region: {
										snippet: {
											text: '',
										},
										startLine: 13,
									},
									artifactLocation: {
										uri: 'file:///Volumes/Work/sandbox/explnode/vulnerabilities/koa-rce.js',
									},
									contextRegion: {
										snippet: {
											text: '});\n\n',
										},
										endLine: 13,
										startLine: 12,
									},
								},
							},
						],
						properties: {
							issue_confidence: 'HIGH',
							issue_severity: '9.0',
							issue_tags: {},
						},
						baselineState: 'new',
						partialFingerprints: {
							evidenceFingerprint: '',
						},
						ruleId: 'command-injection-http',
						ruleIndex: 8,
					},
					{
						message: {
							markdown:
								'Remote Code Execution: Command Injection through HTTP via `req` in `anonymous`\n\nHTTP data is used in a shell command without undergoing escaping or validation. This could allow an attacker to execute code on the server. Injection flaws occur when untrusted data is sent to an interpreter as part of a command or query. By injecting hostile data, an attacker may trick the interpreter into executing unintended commands or accessing data without authorization which can result in data loss, corruption, or disclosure to unauthorized parties, loss of accountability, denial of access or even a complete host takeover.\n\n\n## Countermeasures\n\nThis vulnerability can be prevented by using parameterized queries or by validating HTTP data (preferably on server-side by means of common input sanitation libraries or whitelisting) before using it.\n\n## Additional information\n\n**[CWE-77](https://cwe.mitre.org/data/definitions/77.html)**\n\n**[CWE-78](https://cwe.mitre.org/data/definitions/78.html)**\n\n**[CWE-917](https://cwe.mitre.org/data/definitions/917.html)**\n\n**[OWASP-A1](https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A1-Injection)**.',
							text: 'Remote Code Execution: Command Injection through HTTP via `req` in `anonymous`\n\nHTTP data is used in a shell command without undergoing escaping or validation. This could allow an attacker to execute code on the server. Injection flaws occur when untrusted data is sent to an interpreter as part of a command or query. By injecting hostile data, an attacker may trick the interpreter into executing unintended commands or accessing data without authorization which can result in data loss, corruption, or disclosure to unauthorized parties, loss of accountability, denial of access or even a complete host takeover.\n\n\n## Countermeasures\n\nThis vulnerability can be prevented by using parameterized queries or by validating HTTP data (preferably on server-side by means of common input sanitation libraries or whitelisting) before using it.\n\n## Additional information\n\n**[CWE-77](https://cwe.mitre.org/data/definitions/77.html)**\n\n**[CWE-78](https://cwe.mitre.org/data/definitions/78.html)**\n\n**[CWE-917](https://cwe.mitre.org/data/definitions/917.html)**\n\n**[OWASP-A1](https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A1-Injection)**.',
						},
						locations: [
							{
								physicalLocation: {
									region: {
										snippet: {
											text: '    })\n',
										},
										startLine: 13,
									},
									artifactLocation: {
										uri: 'file:///Volumes/Work/sandbox/explnode/vulnerabilities/exec.js',
									},
									contextRegion: {
										snippet: {
											text: "        res.send('pong')\n    })\n",
										},
										endLine: 13,
										startLine: 12,
									},
								},
							},
						],
						properties: {
							issue_confidence: 'HIGH',
							issue_severity: '9.0',
							issue_tags: {},
						},
						baselineState: 'new',
						partialFingerprints: {
							evidenceFingerprint: '',
						},
						ruleId: 'command-injection-http',
						ruleIndex: 8,
					},
					{
						message: {
							markdown:
								'Remote Code Execution: Command Injection through HTTP via `req` in `anonymous2`\n\nHTTP data is used in a shell command without undergoing escaping or validation. This could allow an attacker to execute code on the server. Injection flaws occur when untrusted data is sent to an interpreter as part of a command or query. By injecting hostile data, an attacker may trick the interpreter into executing unintended commands or accessing data without authorization which can result in data loss, corruption, or disclosure to unauthorized parties, loss of accountability, denial of access or even a complete host takeover.\n\n\n## Countermeasures\n\nThis vulnerability can be prevented by using parameterized queries or by validating HTTP data (preferably on server-side by means of common input sanitation libraries or whitelisting) before using it.\n\n## Additional information\n\n**[CWE-77](https://cwe.mitre.org/data/definitions/77.html)**\n\n**[CWE-78](https://cwe.mitre.org/data/definitions/78.html)**\n\n**[CWE-917](https://cwe.mitre.org/data/definitions/917.html)**\n\n**[OWASP-A1](https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A1-Injection)**.',
							text: 'Remote Code Execution: Command Injection through HTTP via `req` in `anonymous2`\n\nHTTP data is used in a shell command without undergoing escaping or validation. This could allow an attacker to execute code on the server. Injection flaws occur when untrusted data is sent to an interpreter as part of a command or query. By injecting hostile data, an attacker may trick the interpreter into executing unintended commands or accessing data without authorization which can result in data loss, corruption, or disclosure to unauthorized parties, loss of accountability, denial of access or even a complete host takeover.\n\n\n## Countermeasures\n\nThis vulnerability can be prevented by using parameterized queries or by validating HTTP data (preferably on server-side by means of common input sanitation libraries or whitelisting) before using it.\n\n## Additional information\n\n**[CWE-77](https://cwe.mitre.org/data/definitions/77.html)**\n\n**[CWE-78](https://cwe.mitre.org/data/definitions/78.html)**\n\n**[CWE-917](https://cwe.mitre.org/data/definitions/917.html)**\n\n**[OWASP-A1](https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A1-Injection)**.',
						},
						locations: [
							{
								physicalLocation: {
									region: {
										snippet: {
											text: '',
										},
										startLine: 34,
									},
									artifactLocation: {
										uri: 'file:///Volumes/Work/sandbox/explnode/vulnerabilities/exec.js',
									},
									contextRegion: {
										snippet: {
											text: '//    return spawn(cmd);\n\n',
										},
										endLine: 34,
										startLine: 33,
									},
								},
							},
						],
						properties: {
							issue_confidence: 'HIGH',
							issue_severity: '9.0',
							issue_tags: {},
						},
						baselineState: 'new',
						partialFingerprints: {
							evidenceFingerprint: '',
						},
						ruleId: 'command-injection-http',
						ruleIndex: 8,
					},
					{
						message: {
							markdown:
								'Remote Code Execution: Command Injection through HTTP via `req` in `anonymous3`\n\nHTTP data is used in a shell command without undergoing escaping or validation. This could allow an attacker to execute code on the server. Injection flaws occur when untrusted data is sent to an interpreter as part of a command or query. By injecting hostile data, an attacker may trick the interpreter into executing unintended commands or accessing data without authorization which can result in data loss, corruption, or disclosure to unauthorized parties, loss of accountability, denial of access or even a complete host takeover.\n\n\n## Countermeasures\n\nThis vulnerability can be prevented by using parameterized queries or by validating HTTP data (preferably on server-side by means of common input sanitation libraries or whitelisting) before using it.\n\n## Additional information\n\n**[CWE-77](https://cwe.mitre.org/data/definitions/77.html)**\n\n**[CWE-78](https://cwe.mitre.org/data/definitions/78.html)**\n\n**[CWE-917](https://cwe.mitre.org/data/definitions/917.html)**\n\n**[OWASP-A1](https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A1-Injection)**.',
							text: 'Remote Code Execution: Command Injection through HTTP via `req` in `anonymous3`\n\nHTTP data is used in a shell command without undergoing escaping or validation. This could allow an attacker to execute code on the server. Injection flaws occur when untrusted data is sent to an interpreter as part of a command or query. By injecting hostile data, an attacker may trick the interpreter into executing unintended commands or accessing data without authorization which can result in data loss, corruption, or disclosure to unauthorized parties, loss of accountability, denial of access or even a complete host takeover.\n\n\n## Countermeasures\n\nThis vulnerability can be prevented by using parameterized queries or by validating HTTP data (preferably on server-side by means of common input sanitation libraries or whitelisting) before using it.\n\n## Additional information\n\n**[CWE-77](https://cwe.mitre.org/data/definitions/77.html)**\n\n**[CWE-78](https://cwe.mitre.org/data/definitions/78.html)**\n\n**[CWE-917](https://cwe.mitre.org/data/definitions/917.html)**\n\n**[OWASP-A1](https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A1-Injection)**.',
						},
						locations: [
							{
								physicalLocation: {
									region: {
										snippet: {
											text: '   let cmd = req.params.cmd;\n',
										},
										startLine: 42,
									},
									artifactLocation: {
										uri: 'file:///Volumes/Work/sandbox/explnode/vulnerabilities/exec.js',
									},
									contextRegion: {
										snippet: {
											text: "router.get('/run2', (req,res) => {\n   let cmd = req.params.cmd;\n",
										},
										endLine: 42,
										startLine: 41,
									},
								},
							},
						],
						properties: {
							issue_confidence: 'HIGH',
							issue_severity: '9.0',
							issue_tags: {},
						},
						baselineState: 'new',
						partialFingerprints: {
							evidenceFingerprint: '',
						},
						ruleId: 'command-injection-http',
						ruleIndex: 8,
					},
					{
						message: {
							markdown:
								'XXE: HTTP data to XML via `req` in `anonymous`\n\nThis flow indicates an XXE attack. An attacker could read arbitrary files, if the features are not disabled.\n\n\n## Countermeasures\n\nThis vulnerability can be prevented by disabling XML External Entity for server-side XML parser altogether. You can find more information in the [OWASP (XXE) Prevention Cheat Sheet](https://www.owasp.org/index.php/XML_External_Entity_(XXE)_Prevention_Cheat_Sheet).\n\n## Additional information\n\n- **[CWE-611](https://cwe.mitre.org/data/definitions/611.html)**\n\n- **[OWASP-A4](https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A4-XML_External_Entities_(XXE))**.',
							text: 'XXE: HTTP data to XML via `req` in `anonymous`\n\nThis flow indicates an XXE attack. An attacker could read arbitrary files, if the features are not disabled.\n\n\n## Countermeasures\n\nThis vulnerability can be prevented by disabling XML External Entity for server-side XML parser altogether. You can find more information in the [OWASP (XXE) Prevention Cheat Sheet](https://www.owasp.org/index.php/XML_External_Entity_(XXE)_Prevention_Cheat_Sheet).\n\n## Additional information\n\n- **[CWE-611](https://cwe.mitre.org/data/definitions/611.html)**\n\n- **[OWASP-A4](https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A4-XML_External_Entities_(XXE))**.',
						},
						locations: [
							{
								physicalLocation: {
									region: {
										snippet: {
											text: '\tproducts.root().childNodes().forEach(product => {\n',
										},
										startLine: 10,
									},
									artifactLocation: {
										uri: 'file:///Volumes/Work/sandbox/explnode/vulnerabilities/xxe.js',
									},
									contextRegion: {
										snippet: {
											text: '\n\tproducts.root().childNodes().forEach(product => {\n',
										},
										endLine: 10,
										startLine: 9,
									},
								},
							},
						],
						properties: {
							issue_confidence: 'HIGH',
							issue_severity: '9.0',
							issue_tags: {},
						},
						baselineState: 'new',
						partialFingerprints: {
							evidenceFingerprint: '',
						},
						ruleId: 'xxe-injection',
						ruleIndex: 9,
					},
					{
						message: {
							markdown:
								'Remote Code Execution: Command Injection through HTTP via `ctx` in `anonymous`\n\nHTTP data is used in a shell command without undergoing escaping or validation. This could allow an attacker to execute code on the server. Injection flaws occur when untrusted data is sent to an interpreter as part of a command or query. By injecting hostile data, an attacker may trick the interpreter into executing unintended commands or accessing data without authorization which can result in data loss, corruption, or disclosure to unauthorized parties, loss of accountability, denial of access or even a complete host takeover.\n\n\n## Countermeasures\n\nThis vulnerability can be prevented by using parameterized queries or by validating HTTP data (preferably on server-side by means of common input sanitation libraries or whitelisting) before using it.\n\n## Additional information\n\n**[CWE-77](https://cwe.mitre.org/data/definitions/77.html)**\n\n**[CWE-78](https://cwe.mitre.org/data/definitions/78.html)**\n\n**[CWE-917](https://cwe.mitre.org/data/definitions/917.html)**\n\n**[OWASP-A1](https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A1-Injection)**.',
							text: 'Remote Code Execution: Command Injection through HTTP via `ctx` in `anonymous`\n\nHTTP data is used in a shell command without undergoing escaping or validation. This could allow an attacker to execute code on the server. Injection flaws occur when untrusted data is sent to an interpreter as part of a command or query. By injecting hostile data, an attacker may trick the interpreter into executing unintended commands or accessing data without authorization which can result in data loss, corruption, or disclosure to unauthorized parties, loss of accountability, denial of access or even a complete host takeover.\n\n\n## Countermeasures\n\nThis vulnerability can be prevented by using parameterized queries or by validating HTTP data (preferably on server-side by means of common input sanitation libraries or whitelisting) before using it.\n\n## Additional information\n\n**[CWE-77](https://cwe.mitre.org/data/definitions/77.html)**\n\n**[CWE-78](https://cwe.mitre.org/data/definitions/78.html)**\n\n**[CWE-917](https://cwe.mitre.org/data/definitions/917.html)**\n\n**[OWASP-A1](https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A1-Injection)**.',
						},
						locations: [
							{
								physicalLocation: {
									region: {
										snippet: {
											text: '',
										},
										startLine: 13,
									},
									artifactLocation: {
										uri: 'file:///Volumes/Work/sandbox/explnode/vulnerabilities/koa-rce.js',
									},
									contextRegion: {
										snippet: {
											text: '});\n\n',
										},
										endLine: 13,
										startLine: 12,
									},
								},
							},
						],
						properties: {
							issue_confidence: 'HIGH',
							issue_severity: '9.0',
							issue_tags: {},
						},
						baselineState: 'new',
						partialFingerprints: {
							evidenceFingerprint: '',
						},
						ruleId: 'cmdi',
						ruleIndex: 10,
					},
					{
						message: {
							markdown:
								'Remote Code Execution: Command Injection through HTTP via `req` in `anonymous`\n\nHTTP data is used in a shell command without undergoing escaping or validation. This could allow an attacker to execute code on the server. Injection flaws occur when untrusted data is sent to an interpreter as part of a command or query. By injecting hostile data, an attacker may trick the interpreter into executing unintended commands or accessing data without authorization which can result in data loss, corruption, or disclosure to unauthorized parties, loss of accountability, denial of access or even a complete host takeover.\n\n\n## Countermeasures\n\nThis vulnerability can be prevented by using parameterized queries or by validating HTTP data (preferably on server-side by means of common input sanitation libraries or whitelisting) before using it.\n\n## Additional information\n\n**[CWE-77](https://cwe.mitre.org/data/definitions/77.html)**\n\n**[CWE-78](https://cwe.mitre.org/data/definitions/78.html)**\n\n**[CWE-917](https://cwe.mitre.org/data/definitions/917.html)**\n\n**[OWASP-A1](https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A1-Injection)**.',
							text: 'Remote Code Execution: Command Injection through HTTP via `req` in `anonymous`\n\nHTTP data is used in a shell command without undergoing escaping or validation. This could allow an attacker to execute code on the server. Injection flaws occur when untrusted data is sent to an interpreter as part of a command or query. By injecting hostile data, an attacker may trick the interpreter into executing unintended commands or accessing data without authorization which can result in data loss, corruption, or disclosure to unauthorized parties, loss of accountability, denial of access or even a complete host takeover.\n\n\n## Countermeasures\n\nThis vulnerability can be prevented by using parameterized queries or by validating HTTP data (preferably on server-side by means of common input sanitation libraries or whitelisting) before using it.\n\n## Additional information\n\n**[CWE-77](https://cwe.mitre.org/data/definitions/77.html)**\n\n**[CWE-78](https://cwe.mitre.org/data/definitions/78.html)**\n\n**[CWE-917](https://cwe.mitre.org/data/definitions/917.html)**\n\n**[OWASP-A1](https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A1-Injection)**.',
						},
						locations: [
							{
								physicalLocation: {
									region: {
										snippet: {
											text: '    })\n',
										},
										startLine: 13,
									},
									artifactLocation: {
										uri: 'file:///Volumes/Work/sandbox/explnode/vulnerabilities/exec.js',
									},
									contextRegion: {
										snippet: {
											text: "        res.send('pong')\n    })\n",
										},
										endLine: 13,
										startLine: 12,
									},
								},
							},
						],
						properties: {
							issue_confidence: 'HIGH',
							issue_severity: '9.0',
							issue_tags: {},
						},
						baselineState: 'new',
						partialFingerprints: {
							evidenceFingerprint: '',
						},
						ruleId: 'cmdi',
						ruleIndex: 10,
					},
					{
						message: {
							markdown:
								'Remote Code Execution: Command Injection through HTTP via `req` in `anonymous2`\n\nHTTP data is used in a shell command without undergoing escaping or validation. This could allow an attacker to execute code on the server. Injection flaws occur when untrusted data is sent to an interpreter as part of a command or query. By injecting hostile data, an attacker may trick the interpreter into executing unintended commands or accessing data without authorization which can result in data loss, corruption, or disclosure to unauthorized parties, loss of accountability, denial of access or even a complete host takeover.\n\n\n## Countermeasures\n\nThis vulnerability can be prevented by using parameterized queries or by validating HTTP data (preferably on server-side by means of common input sanitation libraries or whitelisting) before using it.\n\n## Additional information\n\n**[CWE-77](https://cwe.mitre.org/data/definitions/77.html)**\n\n**[CWE-78](https://cwe.mitre.org/data/definitions/78.html)**\n\n**[CWE-917](https://cwe.mitre.org/data/definitions/917.html)**\n\n**[OWASP-A1](https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A1-Injection)**.',
							text: 'Remote Code Execution: Command Injection through HTTP via `req` in `anonymous2`\n\nHTTP data is used in a shell command without undergoing escaping or validation. This could allow an attacker to execute code on the server. Injection flaws occur when untrusted data is sent to an interpreter as part of a command or query. By injecting hostile data, an attacker may trick the interpreter into executing unintended commands or accessing data without authorization which can result in data loss, corruption, or disclosure to unauthorized parties, loss of accountability, denial of access or even a complete host takeover.\n\n\n## Countermeasures\n\nThis vulnerability can be prevented by using parameterized queries or by validating HTTP data (preferably on server-side by means of common input sanitation libraries or whitelisting) before using it.\n\n## Additional information\n\n**[CWE-77](https://cwe.mitre.org/data/definitions/77.html)**\n\n**[CWE-78](https://cwe.mitre.org/data/definitions/78.html)**\n\n**[CWE-917](https://cwe.mitre.org/data/definitions/917.html)**\n\n**[OWASP-A1](https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A1-Injection)**.',
						},
						locations: [
							{
								physicalLocation: {
									region: {
										snippet: {
											text: '',
										},
										startLine: 34,
									},
									artifactLocation: {
										uri: 'file:///Volumes/Work/sandbox/explnode/vulnerabilities/exec.js',
									},
									contextRegion: {
										snippet: {
											text: '//    return spawn(cmd);\n\n',
										},
										endLine: 34,
										startLine: 33,
									},
								},
							},
						],
						properties: {
							issue_confidence: 'HIGH',
							issue_severity: '9.0',
							issue_tags: {},
						},
						baselineState: 'new',
						partialFingerprints: {
							evidenceFingerprint: '',
						},
						ruleId: 'cmdi',
						ruleIndex: 10,
					},
					{
						message: {
							markdown:
								'Remote Code Execution: Command Injection through HTTP via `req` in `anonymous3`\n\nHTTP data is used in a shell command without undergoing escaping or validation. This could allow an attacker to execute code on the server. Injection flaws occur when untrusted data is sent to an interpreter as part of a command or query. By injecting hostile data, an attacker may trick the interpreter into executing unintended commands or accessing data without authorization which can result in data loss, corruption, or disclosure to unauthorized parties, loss of accountability, denial of access or even a complete host takeover.\n\n\n## Countermeasures\n\nThis vulnerability can be prevented by using parameterized queries or by validating HTTP data (preferably on server-side by means of common input sanitation libraries or whitelisting) before using it.\n\n## Additional information\n\n**[CWE-77](https://cwe.mitre.org/data/definitions/77.html)**\n\n**[CWE-78](https://cwe.mitre.org/data/definitions/78.html)**\n\n**[CWE-917](https://cwe.mitre.org/data/definitions/917.html)**\n\n**[OWASP-A1](https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A1-Injection)**.',
							text: 'Remote Code Execution: Command Injection through HTTP via `req` in `anonymous3`\n\nHTTP data is used in a shell command without undergoing escaping or validation. This could allow an attacker to execute code on the server. Injection flaws occur when untrusted data is sent to an interpreter as part of a command or query. By injecting hostile data, an attacker may trick the interpreter into executing unintended commands or accessing data without authorization which can result in data loss, corruption, or disclosure to unauthorized parties, loss of accountability, denial of access or even a complete host takeover.\n\n\n## Countermeasures\n\nThis vulnerability can be prevented by using parameterized queries or by validating HTTP data (preferably on server-side by means of common input sanitation libraries or whitelisting) before using it.\n\n## Additional information\n\n**[CWE-77](https://cwe.mitre.org/data/definitions/77.html)**\n\n**[CWE-78](https://cwe.mitre.org/data/definitions/78.html)**\n\n**[CWE-917](https://cwe.mitre.org/data/definitions/917.html)**\n\n**[OWASP-A1](https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A1-Injection)**.',
						},
						locations: [
							{
								physicalLocation: {
									region: {
										snippet: {
											text: '   let cmd = req.params.cmd;\n',
										},
										startLine: 42,
									},
									artifactLocation: {
										uri: 'file:///Volumes/Work/sandbox/explnode/vulnerabilities/exec.js',
									},
									contextRegion: {
										snippet: {
											text: "router.get('/run2', (req,res) => {\n   let cmd = req.params.cmd;\n",
										},
										endLine: 42,
										startLine: 41,
									},
								},
							},
						],
						properties: {
							issue_confidence: 'HIGH',
							issue_severity: '9.0',
							issue_tags: {},
						},
						baselineState: 'new',
						partialFingerprints: {
							evidenceFingerprint: '',
						},
						ruleId: 'cmdi',
						ruleIndex: 10,
					},
					{
						message: {
							markdown:
								'SQL Injection: HTTP data to SQL database via `req` in `anonymous`\n\nHTTP data is used in a SQL query without undergoing escaping or validation. This could allow an attacker to read sensitive data from the database, modify its content or gain control over the server.\n\n\n## Countermeasures\n\nThis vulnerability can be prevented by using prepared statements on the HTTP data.\n\n## Additional information\n\n**[CWE-89](https://cwe.mitre.org/data/definitions/89.html)**\n\n**[OWASP-A1](https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A1-Injection)**.',
							text: 'SQL Injection: HTTP data to SQL database via `req` in `anonymous`\n\nHTTP data is used in a SQL query without undergoing escaping or validation. This could allow an attacker to read sensitive data from the database, modify its content or gain control over the server.\n\n\n## Countermeasures\n\nThis vulnerability can be prevented by using prepared statements on the HTTP data.\n\n## Additional information\n\n**[CWE-89](https://cwe.mitre.org/data/definitions/89.html)**\n\n**[OWASP-A1](https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A1-Injection)**.',
						},
						locations: [
							{
								physicalLocation: {
									region: {
										snippet: {
											text: '        res.json(result);\n',
										},
										startLine: 19,
									},
									artifactLocation: {
										uri: 'file:///Volumes/Work/sandbox/explnode/vulnerabilities/sqli.js',
									},
									contextRegion: {
										snippet: {
											text: '    connection.query("SELECT * FROM users WHERE id=" + userId,(err, result) => {\n        res.json(result);\n',
										},
										endLine: 19,
										startLine: 18,
									},
								},
							},
						],
						properties: {
							issue_confidence: 'HIGH',
							issue_severity: '9.0',
							issue_tags: {},
						},
						baselineState: 'new',
						partialFingerprints: {
							evidenceFingerprint: '',
						},
						ruleId: 'sqli',
						ruleIndex: 11,
					},
				],
				automationDetails: {
					description: {
						text: 'Static Analysis Security Test results using joern',
					},
					guid: '9933375a-67be-4940-917e-df69bd581924',
				},
			},
		],
		version: '2.1.0',
		$schema:
			'https://raw.githubusercontent.com/oasis-tcs/sarif-spec/master/Schemata/sarif-schema-2.1.0.json',
		inlineExternalProperties: [
			{
				guid: '9933375a-67be-4940-917e-df69bd581924',
				runGuid: 'b33f53d6-ffad-4c82-b5e1-cc607aa9795d',
			},
		],
	},
];
