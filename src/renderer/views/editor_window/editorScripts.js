import * as editorScripts from './editorScripts';
import { isFilePathInQueryResult } from '../../assets/js/utils/scripts';
import { setHighlightRange } from '../../store/actions/editorActions';
import { store } from '../../store/configureStore';

export const handleEditorOnChange = (newValue, props) => {
	props.setOpenFileContent(newValue);
	if (props.openFiles[props.openFilePath] === true) {
		const openFiles = { ...props.openFiles };
		openFiles[props.openFilePath] = false;
		props.setOpenFiles(openFiles);
	}
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
