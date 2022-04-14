import * as editorScripts from './editorScripts';
import * as scripts from '../../assets/js/utils/scripts';

const refs = {
	editorEl: {
		current: {
			editor: {},
		},
	},
};

jest.mock('monaco-editor', () => ({
	__esModule: true,
	Range: jest.fn(function () {
		this.res = [...arguments]; // eslint-disable-line prefer-rest-params
	}),
}));

jest.mock('fs', () => ({
	__esModule: true,
	default: {
		readFile: jest.fn((path, _, fn) => {
			if (path && path !== path.split('/')[path.split('/').length - 1]) {
				fn(undefined, 'abcdefghijklmno');
			} else {
				fn(true, undefined);
			}
		}),
	},
}));

jest.mock('../../assets/js/utils/scripts', () => ({
	__esModule: true,
	isFilePathInQueryResult: jest.fn(() => {}),
}));

describe('function handleChangeMadeToOpenFiles:', () => {
	let shouldGoToLine;
	let goToLine;
	let highlightRange;

	beforeEach(async () => {
		shouldGoToLine = jest
			.spyOn(editorScripts, 'shouldGoToLine')
			.mockImplementation(() => ({ startLine: 0, endLine: 0 }));
		goToLine = jest
			.spyOn(editorScripts, 'goToLine')
			.mockImplementation(() => {});
		highlightRange = jest
			.spyOn(editorScripts, 'highlightRange')
			.mockImplementation(() => {});

		// const props = {
		// 	files: {
		// 		recent: {},
		// 	},
		// };

		Promise.resolve().then(() => jest.useFakeTimers());

		// response = await editorScripts.handleChangeMadeToOpenFiles(refs, props);
		Promise.resolve().then(() => jest.runAllTimers());
	});

	it('expect shouldGoToLine to have been called', () => {
		expect(shouldGoToLine).toHaveBeenCalled();
	});

	it('expect goToLine to have been called', () => {
		expect(goToLine).toHaveBeenCalledWith(refs.editorEl.current.editor, 0);
	});

	it('expect highLightRange to have been called', () => {
		expect(highlightRange).toHaveBeenCalledWith(
			refs.editorEl.current.editor,
			{
				startLine: 0,
				endLine: 0,
			},
		);
	});

	afterEach(() => {
		shouldGoToLine.mockRestore();
		goToLine.mockRestore();
		highlightRange.mockRestore();
	});
});

describe('function goToLine:', () => {
	let setPositionRes;
	let revealLineInCenterRes;
	let editor;
	beforeEach(() => {
		editor = {
			setPosition: obj => {
				setPositionRes = obj;
			},
			revealLineInCenter: val => {
				revealLineInCenterRes = val;
			},
		};
	});

	it('expect setPositionRes object to have column = 1 and lineNumber = 1', () => {
		editorScripts.goToLine(editor, undefined, undefined);
		expect(setPositionRes.column).toBe(1);
		expect(setPositionRes.lineNumber).toBe(1);
	});

	it('expect revealLineInCenterRes to be 1', () => {
		expect(revealLineInCenterRes).toBe(1);
	});

	it('expect setPositionRes object to have column = null and lineNumber = 1', () => {
		editorScripts.goToLine(editor, null, null);
		expect(setPositionRes.column).toBe(null);
		expect(setPositionRes.lineNumber).toBe(1);
	});

	it('expect revealLineInCenterRes to be 1', () => {
		expect(revealLineInCenterRes).toBe(1);
	});

	it('expect setPositionRes object to have column = 0 and lineNumber = 1', () => {
		editorScripts.goToLine(editor, 0, 0);
		expect(setPositionRes.column).toBe(0);
		expect(setPositionRes.lineNumber).toBe(1);
	});

	// it('expect revealLineInCenterRes to be 1', () => {
	// 	expect(revealLineInCenterRes).toBe(1);
	// });

	it('expect setPositionRes object to have column = 1 and lineNumber = 1', () => {
		editorScripts.goToLine(editor, 1, 1);
		expect(setPositionRes.column).toBe(1);
		expect(setPositionRes.lineNumber).toBe(1);
	});

	// it('expect revealLineInCenterRes to be 1', () => {
	// 	expect(revealLineInCenterRes).toBe(1);
	// });

	it('expect setPositionRes object to have column = 2 and lineNumber = 2', () => {
		editorScripts.goToLine(editor, 2, 2);
		expect(setPositionRes.column).toBe(2);
		expect(setPositionRes.lineNumber).toBe(2);
	});

	it('expect revealLineInCenterRes to be 2', () => {
		expect(revealLineInCenterRes).toBe(2);
	});
});

describe('function highlightRange:', () => {
	let delta_decorations;
	let editor;
	let range;

	beforeEach(() => {
		delta_decorations = [];
		editor = {
			deltaDecorations: (arr1, arr2) => {
				delta_decorations = [
					{
						...(arr1[0] ? arr1[0] : {}),
						...(arr2[0] ? arr2[0] : {}),
					},
				];
				return [
					{
						...(arr1[0] ? arr1[0] : {}),
						...(arr2[0] ? arr2[0] : {}),
					},
				];
			},
		};

		range = { startLine: null, endLine: null };
	});

	it('expect delta_decorations.range.res to be [0,0,0,0]', () => {
		editorScripts.highlightRange(editor, range);
		expect(JSON.stringify(delta_decorations[0].range.res)).toBe(
			'[0,0,0,0]',
		);
	});

	it('expect delta_decorations.options.isWholeLine to be undefined', () => {
		editorScripts.highlightRange(editor, range);
		expect(delta_decorations[0].options.isWholeLine).toBe(undefined);
	});

	it('expect delta_decorations.options.inlineClassName to be undefined', () => {
		editorScripts.highlightRange(editor, range);
		expect(delta_decorations[0].options.inlineClassName).toBe(undefined);
	});

	it('expect delta_decorations.range.res to be [2,0,2,0]', () => {
		range.startLine = null;
		range.endLine = 2;
		editorScripts.highlightRange(editor, range);
		expect(JSON.stringify(delta_decorations[0].range.res)).toBe(
			'[2,0,2,0]',
		);

		range.startLine = 2;
		range.endLine = null;
		editorScripts.highlightRange(editor, range);
		expect(JSON.stringify(delta_decorations[0].range.res)).toBe(
			'[2,0,2,0]',
		);
	});

	it('expect delta_decorations.options.isWholeLine to be true', () => {
		range.startLine = null;
		range.endLine = 2;
		editorScripts.highlightRange(editor, range);
		expect(delta_decorations[0].options.isWholeLine).toBe(true);

		range.startLine = 2;
		range.endLine = null;
		editorScripts.highlightRange(editor, range);
		expect(delta_decorations[0].options.isWholeLine).toBe(true);
	});

	it("expect delta_decorations.options.inlineClassName to be 'editor-line-highlight'", () => {
		range.startLine = null;
		range.endLine = 2;
		editorScripts.highlightRange(editor, range);
		expect(delta_decorations[0].options.inlineClassName).toBe(
			'editor-line-highlight',
		);

		range.startLine = 2;
		range.endLine = null;
		editorScripts.highlightRange(editor, range);
		expect(delta_decorations[0].options.inlineClassName).toBe(
			'editor-line-highlight',
		);
	});

	it('expect delta_decorations.range.res to be [1,0,2,0]', () => {
		range.startLine = 1;
		range.endLine = 2;
		editorScripts.highlightRange(editor, range);
		expect(JSON.stringify(delta_decorations[0].range.res)).toBe(
			'[1,0,2,0]',
		);
	});

	it('expect delta_decorations.options.isWholeLine to be true', () => {
		range.startLine = 1;
		range.endLine = 2;
		editorScripts.highlightRange(editor, range);
		expect(delta_decorations[0].options.isWholeLine).toBe(true);
	});

	it("expect delta_decorations.options.inlineClassName to be 'editor-line-highlight'", () => {
		range.startLine = 1;
		range.endLine = 2;
		editorScripts.highlightRange(editor, range);
		expect(delta_decorations[0].options.inlineClassName).toBe(
			'editor-line-highlight',
		);
	});
});

describe('function editorDidMount:', () => {
	let editor;
	let focus;
	let monaco;
	let setDiagnosticsOptions;

	beforeEach(() => {
		focus = jest.fn(() => {});
		setDiagnosticsOptions = jest.fn(obj => obj);
		editor = { focus };
		monaco = {
			languages: {
				typescript: { typescriptDefaults: { setDiagnosticsOptions } },
			},
		};
	});

	it('expect editorDidMount to call editor.focus:', () => {
		editorScripts.editorDidMount(editor, monaco);
		expect(focus).toHaveBeenCalled();
	});

	it('expect editorDidMount to call monaco setDiagnosticsOptions and to have returned object:', () => {
		editorScripts.editorDidMount(editor, monaco);
		expect(setDiagnosticsOptions).toHaveBeenCalled();
		expect(setDiagnosticsOptions).toHaveReturnedWith({
			noSemanticValidation: true,
			noSyntaxValidation: true,
		});
	});
});

// describe('function readRecentFile: ', () => {
//   it('expect readRecentFile(null) to reject', async () => {
//     const resolved = 'resolved';
//     const rejected = 'rejected';
//     const response = await editorScripts
//       .readRecentFile(null)
//       .then(data => resolved)
//       .catch(err => rejected);

//     expect(response).toBe(rejected);
//   });

//   it("expect readRecentFile('a') to reject", async () => {
//     const resolved = 'resolved';
//     const rejected = 'rejected';
//     const response = await editorScripts
//       .readRecentFile('a')
//       .then(data => resolved)
//       .catch(err => rejected);

//     expect(response).toBe(rejected);
//   });

//   it("expect readRecentFile('/a/b/c/d') to resolve", async () => {
//     const resolved = 'resolved';
//     const rejected = 'rejected';
//     const response = await editorScripts
//       .readRecentFile('/a/b/c/d')
//       .then(data => resolved)
//       .catch(err => rejected);

//     expect(response).toBe(resolved);
//   });
// });

describe('function isLineNumberInQueryResult:', () => {
	const stdout1 = '';
	const stdout2 = {};
	const stdout3 =
		'res57: List[NewLocation] = List(NewLocation(node = Some(value = Method( = 1000100L,  = "",  = "",  = "int main (int argc,char *argv[])",  = Some(value = 0),  = Some(value = 0),  = "/home/raymond/Desktop/programming/developement/joern/code_files/x42/cpp/X42.cpp",  = "main",  = None,  = false,  = Some(value = 4),  = Some(value = 11),  = "main",  = 1,  = "int main (int,char * [ ])")), symbol = "main", packageName = "", nodeLabel = "METHOD", methodShortName = "main", methodFullName = "main", lineNumber = Some(value = 4), filename = "/home/raymond/Desktop/programming/developement/joern/code_files/x42/cpp/X42.cpp", classShortName = "", className = ""))\n';
	const stdout4 =
		'res57: List[NewLocation] = List(NewLocation(node = Some(value = Method( = 1000100L,  = "",  = "",  = "int main (int argc,char *argv[])",  = Some(value = 0),  = Some(value = 0),  = "/home/raymond/Desktop/programming/developement/joern/code_files/x42/cpp/X42.cpp",  = "main",  = None,  = false,  = Some(value = 4),  = Some(value = 11),  = "main",  = 1,  = "int main (int,char * [ ])")), symbol = "main", packageName = "", nodeLabel = "METHOD", methodShortName = "main", methodFullName = "main", lineNumber = Some(value = 4), lineNumberEnd = Some(value = 11), filename = "/home/raymond/Desktop/programming/developement/joern/code_files/x42/cpp/X42.cpp", classShortName = "", className = ""))\n';
	const stdout5 =
		'res57: List[NewLocation] -> List(NewLocation(node -> Some(value -> Method( -> 1000100L,  -> "",  -> "",  -> "int main (int argc,char *argv[])",  -> Some(value = 0),  -> Some(value = 0),  -> "/home/raymond/Desktop/programming/developement/joern/code_files/x42/cpp/X42.cpp",  -> "main",  -> None,  -> false,  -> Some(value = 4),  -> Some(value = 11),  -> "main",  -> 1,  -> "int main (int,char * [ ])")), symbol -> "main", packageName -> "", nodeLabel -> "METHOD", methodShortName -> "main", methodFullName -> "main", lineNumber -> Some(value = 4), filename -> "/home/raymond/Desktop/programming/developement/joern/code_files/x42/cpp/X42.cpp", classShortName -> "", className -> ""))\n';
	const stdout6 =
		'res57: List[NewLocation] -> List(NewLocation(node -> Some(value -> Method( -> 1000100L,  -> "",  -> "",  -> "int main (int argc,char *argv[])",  -> Some(value = 0),  -> Some(value = 0),  -> "/home/raymond/Desktop/programming/developement/joern/code_files/x42/cpp/X42.cpp",  -> "main",  -> None,  -> false,  -> Some(value = 4),  -> Some(value = 11),  -> "main",  -> 1,  -> "int main (int,char * [ ])")), symbol -> "main", packageName -> "", nodeLabel -> "METHOD", methodShortName -> "main", methodFullName -> "main", lineNumber -> Some(value = 4), lineNumberEnd -> Some(value = 11), filename -> "/home/raymond/Desktop/programming/developement/joern/code_files/x42/cpp/X42.cpp", classShortName -> "", className -> ""))\n';
	const results = { a: { result: { stdout: undefined } } };

	it('expect isLineNumberInQueryResult(results) to return { startLine: null, endLine: null } when stdout is undefined:', () => {
		const response = editorScripts.isLineNumberInQueryResult(results);
		expect(response.startLine).toBe(null);
		expect(response.endLine).toBe(null);
	});

	it("expect isLineNumberInQueryResult(results) to return { startLine: null, endLine: null } when stdout is '':", () => {
		results.a.result.stdout = stdout1;
		const response = editorScripts.isLineNumberInQueryResult(results);
		expect(response.startLine).toBe(null);
		expect(response.endLine).toBe(null);
	});

	it('expect isLineNumberInQueryResult(results) to return { startLine: null, endLine: null } when stdout is {}:', () => {
		results.a.result.stdout = stdout2;
		const response = editorScripts.isLineNumberInQueryResult(results);
		expect(response.startLine).toBe(null);
		expect(response.endLine).toBe(null);
	});

	it('expect isLineNumberInQueryResult(results) to return { startLine: 4, endLine: null } when stdout is stdout3:', () => {
		results.a.result.stdout = stdout3;
		const response = editorScripts.isLineNumberInQueryResult(results);
		expect(response.startLine).toBe(4);
		expect(response.endLine).toBe(null);
	});

	it('expect isLineNumberInQueryResult(results) to return { startLine: 4, endLine: 11 } when stdout is stdout4:', () => {
		results.a.result.stdout = stdout4;
		const response = editorScripts.isLineNumberInQueryResult(results);
		expect(response.startLine).toBe(4);
		expect(response.endLine).toBe(11);
	});

	it('expect isLineNumberInQueryResult(results) to return { startLine: 4, endLine: null } when stdout is stdout5:', () => {
		results.a.result.stdout = stdout5;
		const response = editorScripts.isLineNumberInQueryResult(results);
		expect(response.startLine).toBe(4);
		expect(response.endLine).toBe(null);
	});

	it('expect isLineNumberInQueryResult(results) to return { startLine: 4, endLine: 11 } when stdout is stdout6:', () => {
		results.a.result.stdout = stdout6;
		const response = editorScripts.isLineNumberInQueryResult(results);
		expect(response.startLine).toBe(4);
		expect(response.endLine).toBe(11);
	});
});

describe('function shouldGoToLine:', () => {
	const props = { files: { recent: {} }, query: { results: true } };
	beforeEach(() => {
		jest.spyOn(scripts, 'isFilePathInQueryResult').mockImplementation(
			bool => (bool ? '/a/b/c/d/e/f' : false),
		);
		jest.spyOn(
			editorScripts,
			'isLineNumberInQueryResult',
		).mockImplementation(() => ({ startLine: 4, endLine: 11 }));
	});

	it('expect return value to be  { startLine: null, endLine: null }   if recent_file === undefined:', () => {
		// const response = editorScripts.shouldGoToLine(props);
		const response = {}; // to be removed when test is fixed;
		expect(response.startLine).toBe(null);
		expect(response.endLine).toBe(null);
	});

	it('expect return value to be  { startLine: null, endLine: null }   if file_path !== recent_file:', () => {
		props.files.recent = { '/a/b/c/d/e/f': true };
		props.query.results = false;
		// const response = editorScripts.shouldGoToLine(props);
		const response = {}; // to be removed when test is fixed
		expect(response.startLine).toBe(null);
		expect(response.endLine).toBe(null);
	});

	it('expect return value to be  { startLine: 4, endLine: 11 }   if file_path === recent_file:', () => {
		props.files.recent = { '/a/b/c/d/e/f': true };
		props.query.results = true;
		// const response = editorScripts.shouldGoToLine(props);
		const response = {}; // to be removed when test is fixed
		expect(response.startLine).toBe(4);
		expect(response.endLine).toBe(11);
	});
});
