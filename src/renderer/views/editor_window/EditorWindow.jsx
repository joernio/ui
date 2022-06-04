import React from 'react';
import clsx from 'clsx';
import MonacoEditor from 'react-monaco-editor';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import ImageViewer from '../../components/image_viewer/ImageViewer';
import SynthFileViewer from '../../components/synth_file_viewer/SynthFileViewer';
import EditorTabs from '../../components/editor_tabs/EditorTabs';
import EditorWindowBanner from '../../components/editor_window_banner/EditorWindowBanner';
import * as filesActions from '../../store/actions/filesActions';
import * as editorActions from '../../store/actions/editorActions';
import * as filesSelectors from '../../store/selectors/filesSelectors';
import * as editorSelectors from '../../store/selectors/editorSelectors';
import * as settingsSelectors from '../../store/selectors/settingsSelectors';
import {
	editorDidMount,
	handleEditorOnChange,
	handleEditorGoToLineAndHighlight,
} from './editorScripts';
import styles from '../../assets/js/styles/views/editor_window/editorWindowStyles';
import {
	imageFileExtensions,
	syntheticFiles,
} from '../../assets/js/utils/defaultVariables';
import { getExtension } from '../../assets/js/utils/scripts';

const useStyles = makeStyles(styles);

function EditorWindow(props) {
	const classes = useStyles(props);

	const refs = {
		editorEl: React.useRef(null),
	};

	React.useEffect(() => {
		props.setRefs(refs);
	}, []);

	React.useEffect(() => {
		refs.editorEl.current &&
			setTimeout(
				() =>
					handleEditorGoToLineAndHighlight(
						refs,
						props.highlightRange,
					),
				1000,
			);
	}, [props.highlightRange]);

	const {
		fontSize,
		prefersDarkMode,
		openFileIsReadOnly,
		openFilePath,
		openFileContent,
	} = props;

	const options = {
		selectOnLineNumbers: true,
		roundedSelection: false,
		readOnly: openFileIsReadOnly,
		cursorStyle: 'line',
		automaticLayout: true,
		fontSize: fontSize ? Number(fontSize.split('px')[0]) : 16,
	};

	return (
		<div
			className={clsx(
				classes.editorContainerStyle,
				props.drawerWidth
					? classes.drawerOpenStyle
					: classes.drawerCloseStyle,
			)}
			data-test="editor-window"
		>
			<EditorTabs />
			{imageFileExtensions.includes(getExtension(openFilePath)) ? (
				<ImageViewer src={openFilePath} />
			) : syntheticFiles.filter(type => openFilePath.endsWith(type))
					.length > 0 ? (
				<SynthFileViewer
					path={openFilePath}
					content={openFileContent}
					drawerWidth={props.drawerWidth}
				/>
			) : (
				<>
					<EditorWindowBanner
						message={
							openFileIsReadOnly
								? 'Read-only Mode'
								: 'Scripts Development Mode'
						}
					/>
					<MonacoEditor
						ref={refs.editorEl}
						width="100%"
						height="90%"
						theme={prefersDarkMode ? 'vs-dark' : 'vs-light'}
						language="typescript"
						value={openFileContent}
						options={options}
						onChange={newValue =>
							handleEditorOnChange(newValue, props)
						}
						editorDidMount={editorDidMount}
					/>
				</>
			)}
		</div>
	);
}

const mapStateToProps = state => ({
	highlightRange: editorSelectors.selectHighlightRange(state),
	openFiles: filesSelectors.selectOpenFiles(state),
	openFilePath: filesSelectors.selectOpenFilePath(state),
	openFileContent: filesSelectors.selectOpenFileContent(state),
	openFileIsReadOnly: filesSelectors.selectOpenFileIsReadOnly(state),
	prefersDarkMode: settingsSelectors.selectPrefersDarkMode(state),
	fontSize: settingsSelectors.selectFontSize(state),
});

const mapDispatchToProps = dispatch => ({
	setOpenFileContent: content =>
		dispatch(filesActions.setOpenFileContent(content)),
	setOpenFileIsReadOnly: bool =>
		dispatch(filesActions.setOpenFileIsReadOnly(bool)),
	setOpenFiles: openFiles => dispatch(filesActions.setOpenFiles(openFiles)),
	setRefs: refs => dispatch(editorActions.setRefs(refs)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditorWindow);
