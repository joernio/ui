import 'jsdom-global/register';
import React from 'react';
import EditorWindow from './EditorWindow';
import MonacoEditor from 'react-monaco-editor';
import {default_state as settings} from '../../store/reducers/settingsReducers';
import {default_state as files} from '../../store/reducers/filesReducers';
import {default_state as query} from '../../store/reducers/queryReducers';
import {default_state as workspace} from '../../store/reducers/workSpaceReducers';
import {mount} from 'enzyme';
import {findByTestAttr, testStore} from '../../assets/js/utils/testUtils';
import { editorDidMount, handleFileAddedToRecent } from './editorScripts';
// import {setWorkSpace} from '../../store/actions/workSpaceActions';

const mock_file_content = "abcdefgh";
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

jest.mock('react-monaco-editor', ()=>({
    __esModule: true,
    default: jest.fn(({editorDidMount})=>{
        editorDidMount();
        return <div data-test="monaco-editor"></div>;
    })
}));

jest.mock('./editorScripts', ()=>({
    __esModule: true,
    editorDidMount: jest.fn(()=>{}),
    handleFileAddedToRecent: jest.fn(()=>(new Promise(r=>r({openFileContent: mock_file_content, isReadOnly: false}))))
}));


const setUp =(initialState={})=> {
    const store = testStore(initialState);
    const wrapper = mount(<EditorWindow store={store}/>);
    return {wrapper, store};
}

describe('EditorWindow component:', ()=>{
    let wrapper, monaco_editor, store;

    beforeEach(()=>{
        let wrapper_and_store = setUp({settings, files, query, workspace});
        wrapper = wrapper_and_store.wrapper;
        store = wrapper_and_store.store;
        monaco_editor = wrapper.find(MonacoEditor);
    });

    it('EditorWindow.jsx Should render without errors', ()=> {
        const component = findByTestAttr(wrapper, 'editor-window');
        expect(component.length).toBe(1);
    });

    it('expect editorDidMount to have been called', ()=>{
        expect(editorDidMount).toHaveBeenCalled(); 
    });

    it('expect openFileContent to be "" ', ()=>{
      expect(store.getState().files.openFileContent).toBe('');
    });

    it('expect openFileIsReadOnly to be true', ()=>{
     expect(store.getState().files.openFileIsReadOnly).toBe(true);
    });

    it('expect monaco_editor component.length to be 1', ()=>{
        const component = findByTestAttr(monaco_editor, 'monaco-editor');
        expect(component.length).toBe(1);
    });

    it('expect monaco_editor.props().width to be "100%"', ()=>{
       expect(monaco_editor.props().width).toBe("100%");
    });

    it('expect monaco_editor.props().height to be "100%"', ()=>{
       expect(monaco_editor.props().height).toBe("100%");
    });

    it('expect monaco_editor.props().theme oneof vs-dark and vs-light', ()=>{
       expect(["vs-dark", "vs-light"]).toContain(monaco_editor.props().theme);
    });

    it('expect monaco_editor.props().language to be "typescript"', ()=>{
       expect(monaco_editor.props().language).toBe("typescript");
    });

    it('expect monaco_editor.props().value to be ""', ()=>{
       expect(monaco_editor.props().value).toBe("");
    });

    it('expect typeof monaco_editor.props().options to be "object"', ()=>{
       expect(typeof monaco_editor.props().options).toBe("object");
    });

    it('expect typeof monaco_editor.props().onChange to be "function"', ()=>{
       expect(typeof monaco_editor.props().onChange).toBe("function");
    });

    it('expect typeof monaco_editor.props().editorDidMount to be "function"', ()=>{
        expect(typeof monaco_editor.props().editorDidMount).toBe("function");
     });

    // it('expect change to workspace project to trigger handleFileAddedToRecent and update openFileContent and isReadOnly', ()=>{
    //   act(()=>{
    //      store.dispatch(setWorkSpace(mock_workspace));
    //   });

    // // await act(() => new Promise(process.nextTick));
    // // wrapper.update(); 

    // //   expect(handleFileAddedToRecent).toHaveBeenCalled();
    //   expect(store.getState().files.openFileContent).toBe(mock_file_content);
    //   expect(store.getState().files.isReadOnly).toBe(false);
    // });

    // afterEach(()=>{
    //     wrapper.unmount();
    // })



    // it('expect unmounting app.js to call removeShortcuts', ()=>{
    //  wrapper.unmount();
    //  expect(removeShortcuts).toHaveBeenCalled();
    // });

})