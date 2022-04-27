// import 'jsdom-global/register';
import React from 'react';
import MonacoEditor from 'react-monaco-editor';
import { makeStyles } from '@material-ui/core/styles';
import { mount } from 'enzyme';
import EditorWindow from './EditorWindow';
import EditorTabs from '../../components/editor_tabs/EditorTabs';
import { default_state as settings } from '../../store/reducers/settingsReducers';
import { default_state as files } from '../../store/reducers/filesReducers';
import { default_state as query } from '../../store/reducers/queryReducers';
import { default_state as workspace } from '../../store/reducers/workSpaceReducers';
import { findByTestAttr } from '../../assets/js/utils/testUtils';
import { editorDidMount } from './editorScripts';
// import {setWorkSpace} from '../../store/actions/workSpaceActions';

// const mock_file_content = 'abcdefgh';

// const mock_workspace = {
//     path:"/home/raymond/Desktop/workspace",
//     projects:{
//         go:{
//             inputPath:"/a/b/c/d/e",
//             pathToProject:null,open:false},
//         cpp:{
//              inputPath:"/a/b/c/d/e/f/g",
//              pathToProject:"/a/b/c/d/e/f/g/h",open:true}
//       }
//   };

jest.mock('@material-ui/core/styles', () => ({
	__esModule: true,
	makeStyles: jest.fn(() => () => ({})),
}));

jest.mock('react-monaco-editor', () => ({
	__esModule: true,
	default: jest.fn(({ editorDidMount }) => {
		editorDidMount();
		return <div data-test="monaco-editor"></div>;
	}),
}));

jest.mock('../../components/editor_tabs/EditorTabs', () => ({
	__esModule: true,
	default: jest.fn(() => <div data-test="editor-tabs"></div>),
}));

jest.mock('./editorScripts', () => ({
	__esModule: true,
	editorDidMount: jest.fn(() => {}),
	handleChangeMadeToOpenFiles: jest.fn(() => {}),
}));

const setUp = () => {
	// const store = testStore(initialState);
	const store = {}; // to be removed when test is fixed;
	const wrapper = mount(<EditorWindow store={store} />);
	return { wrapper, store };
};

describe('EditorWindow component:', () => {
	let wrapper;
	let monaco_editor;
	let editor_tabs;

	beforeEach(() => {
		const wrapper_and_store = setUp({ settings, files, query, workspace });
		wrapper = wrapper_and_store.wrapper;
		// store = wrapper_and_store.store;
		editor_tabs = wrapper.find(EditorTabs);
		monaco_editor = wrapper.find(MonacoEditor);
	});

	it('EditorWindow.jsx Should render without errors', () => {
		const component = findByTestAttr(wrapper, 'editor-window');
		expect(component).toHaveLength(1);
	});

	it('expect makeStyles to have been called', () => {
		expect(makeStyles).toHaveBeenCalled();
	});

	// it('expect handleChangeMadeToOpenFiles to have been called', ()=>{
	//   expect(handleChangeMadeToOpenFiles).toHaveBeenCalled();
	// });

	it('expect editorDidMount to have been called', () => {
		expect(editorDidMount).toHaveBeenCalled();
	});

	it('expect editor_tabs component.length to be 1', () => {
		const component = findByTestAttr(editor_tabs, 'editor-tabs');
		expect(component).toHaveLength(1);
	});

	it('expect monaco_editor component.length to be 1', () => {
		const component = findByTestAttr(monaco_editor, 'monaco-editor');
		expect(component).toHaveLength(1);
	});

	it('expect monaco_editor.props().width to be "100%"', () => {
		expect(monaco_editor.props().width).toBe('100%');
	});

	it('expect monaco_editor.props().height to be "90%"', () => {
		expect(monaco_editor.props().height).toBe('90%');
	});

	it('expect monaco_editor.props().theme oneof vs-dark and vs-light', () => {
		expect(['vs-dark', 'vs-light']).toContain(monaco_editor.props().theme);
	});

	it('expect monaco_editor.props().language to be "typescript"', () => {
		expect(monaco_editor.props().language).toBe('typescript');
	});

	it('expect monaco_editor.props().value to be ""', () => {
		expect(monaco_editor.props().value).toBe('');
	});

	it('expect typeof monaco_editor.props().options to be "object"', () => {
		expect(typeof monaco_editor.props().options).toBe('object');
	});

	it('expect typeof monaco_editor.props().onChange to be "function"', () => {
		expect(typeof monaco_editor.props().onChange).toBe('function');
	});

	it('expect typeof monaco_editor.props().editorDidMount to be "function"', () => {
		expect(typeof monaco_editor.props().editorDidMount).toBe('function');
	});
});
