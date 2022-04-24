import { Range } from 'monaco-editor';
import * as editorScripts from './editorScripts';
import { isFilePathInQueryResult } from '../../assets/js/utils/scripts';
import { setHighlightRange } from '../../store/actions/editorActions';
import { store } from '../../store/configureStore';

let delta_decorations = [];

export const handleEditorOnChange = (newValue, props) => {
	props.setOpenFileContent(newValue);
	if (props.files.openFiles[props.files.openFilePath] === true) {
		const openFiles = { ...props.files.openFiles };
		openFiles[props.files.openFilePath] = false;
		props.setOpenFiles(openFiles);
	}
};

export const goToLine = (editor, row = 1, column = 1) => {
	editor.setPosition({ column, lineNumber: row || 1 });
	editor.revealLineInCenter(row || 1);
};

export const highlightRange = (editor, range) => {
	const rangeArr = [];

	if (range.startLine && !range.endLine) {
		rangeArr.push(range.startLine, 0, range.startLine, 0);
	} else if (!range.startLine && range.endLine) {
		rangeArr.push(range.endLine, 0, range.endLine, 0);
	} else if (range.startLine && range.endLine) {
		rangeArr.push(range.startLine, 0, range.endLine, 0);
	} else {
		rangeArr.push(0, 0, 0, 0);
	}

	if (rangeArr.length) {
		delta_decorations = editor.deltaDecorations(delta_decorations, [
			{
				range: new Range(...rangeArr),
				options:
					range.startLine || range.endLine
						? {
								isWholeLine: true,
								inlineClassName: 'editor-line-highlight',
						  }
						: {},
			},
		]);
	}
};

export const handleEditorGoToLineAndHighlight = (
	refs,
	{ startLine, endLine },
) => {
	setTimeout(() => {
		goToLine(refs.editorEl.current.editor, startLine);
		highlightRange(refs.editorEl.current.editor, {
			startLine,
			endLine,
		});
	}, 1000);
};

export const editorDidMount = (editor, monaco) => {
	editor.focus();
	monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
		noSemanticValidation: true,
		noSyntaxValidation: true,
	});
};

export const isLineNumberInQueryResult = results => {
	const latest =
		results[Object.keys(results)[Object.keys(results).length - 1]];
	const range = { startLine: null, endLine: null };

	if (
		latest?.result.stdout &&
		typeof latest.result.stdout === 'string' &&
		latest.result.stdout.includes('lineNumber')
	) {
		try {
			let startLine = latest.result.stdout.split(
				'lineNumber -> Some(value = ',
			)[1];
			startLine = startLine.split('),')[0];
			range.startLine = Number(startLine);

			let endLine = latest.result.stdout.split(
				'lineNumberEnd -> Some(value = ',
			)[1];
			endLine = endLine.split('),')[0];
			range.endLine = Number(endLine);

			return range;
		} catch (e) {
			try {
				let startLine = latest.result.stdout.split(
					'lineNumber = Some(value = ',
				)[1];
				startLine = startLine.split('),')[0];
				range.startLine = Number(startLine);

				let endLine = latest.result.stdout.split(
					'lineNumberEnd = Some(value = ',
				)[1];
				endLine = endLine.split('),')[0];
				range.endLine = Number(endLine);

				return range;
			} catch (e) {
				return range;
			}
		}
	} else {
		return range;
	}
};

export const editorShouldGoToLine = () => {
	const { openFilePath: open_file_path } = store.getState().files;
	const { results } = store.getState().query;
	const file_path = isFilePathInQueryResult(results);

	if (file_path === open_file_path && open_file_path) {
		store.dispatch(
			setHighlightRange(editorScripts.isLineNumberInQueryResult(results)),
		);
	} else {
		store.dispatch(setHighlightRange({ startLine: null, endLine: null }));
	}
};
