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
];
export const joernBinaryLanguage = 'GHIDRA';

// \r      ██╗ ██████╗ ███████╗██████╗ ███╗   ██╗
// \r      ██║██╔═══██╗██╔════╝██╔══██╗████╗  ██║
// \r      ██║██║   ██║█████╗  ██████╔╝██╔██╗ ██║
// \r ██   ██║██║   ██║██╔══╝  ██╔══██╗██║╚██╗██║
// \r ╚█████╔╝╚██████╔╝███████╗██║  ██║██║ ╚████║
// \r  ╚════╝  ╚═════╝ ╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝
