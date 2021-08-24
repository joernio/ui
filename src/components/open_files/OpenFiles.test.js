import 'jsdom-global/register';
import React from 'react';
import OpenFiles from './OpenFiles';
import { makeStyles } from '@material-ui/core/styles';
import {default_state as settings} from '../../store/reducers/settingsReducers';
import {default_state as files} from '../../store/reducers/filesReducers';
import {default_state as query} from '../../store/reducers/queryReducers';
import {default_state as workspace} from '../../store/reducers/workSpaceReducers';
import {mount} from 'enzyme';
import {findByTestAttr, testStore} from '../../assets/js/utils/testUtils';
import {
    getEditorFilesFromRecent
  } from './openFilesScripts';

const mock_workspace = {
    path:"/home/raymond/Desktop/workspace",
    projects:{
        go:{
            inputPath:"/a/b/c/d/e",
            pathToProject:null,open:false},
        cpp:{
             inputPath:"/a/b/c/d/e/f/g",
             pathToProject:"/a/b/c/d/e/f/g/h",open:true}
      }
  };


jest.mock('@material-ui/core/styles', ()=>({
    __esModule: true,
    makeStyles: jest.fn(()=>()=>({}))
}));


jest.mock('./openFilesScripts', ()=>({
    __esModule: true,
    getEditorFilesFromRecent: jest.fn(()=>({}))
}));


const setUp =(initialState={})=> {
    const store = testStore(initialState);
    const wrapper = mount(<OpenFiles store={store}/>);
    return {wrapper, store};
}

describe('OpenFiles component when workspace is empty:', ()=>{
    let wrapper;

    beforeEach(()=>{
        let wrapper_and_store = setUp({settings, files, query, workspace});
        wrapper = wrapper_and_store.wrapper;
    });

    it('OpenFiles.jsx Should not render if workspace is empty', ()=> {
        const component = findByTestAttr(wrapper, 'open-files');
        expect(component.length).toBe(0);
    });

    it('expect makeStyles to have been called', ()=>{
        expect(makeStyles).toHaveBeenCalled(); 
    });

    it('expect getEditorFilesFromRecent to have been called', ()=>{
        expect(getEditorFilesFromRecent).toHaveBeenCalled(); 
    });

    afterEach(()=>{
      wrapper.unmount();
    });
});


describe('OpenFiles component when workspace is not empty:', ()=>{
    let wrapper;

    beforeEach(()=>{
        let wrapper_and_store = setUp({settings, files, query, workspace: mock_workspace});
        wrapper = wrapper_and_store.wrapper;
    });

    it('OpenFiles.jsx Should not render if workspace is not empty', ()=> {
        const component = findByTestAttr(wrapper, 'open-files');
        expect(component.length).toBe(1);
    });

    it('expect makeStyles to have been called', ()=>{
        expect(makeStyles).toHaveBeenCalled(); 
    });

    it('expect getEditorFilesFromRecent to have been called', ()=>{
        expect(getEditorFilesFromRecent).toHaveBeenCalled(); 
    });

    afterEach(()=>{
      wrapper.unmount();
    });
})