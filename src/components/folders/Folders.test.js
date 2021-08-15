import 'jsdom-global/register';
import React from 'react';
import Folders from './Folders';
import { makeStyles } from '@material-ui/core/styles';
import {default_state as settings} from '../../store/reducers/settingsReducers';
import {default_state as files} from '../../store/reducers/filesReducers';
import {default_state as query} from '../../store/reducers/queryReducers';
import {default_state as workspace} from '../../store/reducers/workSpaceReducers';
import {mount} from 'enzyme';
import {findByTestAttr, testStore} from '../../assets/js/utils/testUtils';
import {
  shouldSwitchFolder,
} from './foldersScripts';

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


jest.mock('./foldersScripts', ()=>({
    __esModule: true,
    shouldSwitchFolder: jest.fn(()=>false)
}));


const setUp =(initialState={})=> {
    const store = testStore(initialState);
    const wrapper = mount(<Folders store={store}/>);
    return {wrapper, store};
}

describe('Folder component when workspace is empty:', ()=>{
    let wrapper;

    beforeEach(()=>{
        let wrapper_and_store = setUp({settings, files, query, workspace});
        wrapper = wrapper_and_store.wrapper;
    });

    it('Folders.jsx Should not render if workspace is empty', ()=> {
        const component = findByTestAttr(wrapper, 'folders');
        expect(component.length).toBe(0);
    });

    it('expect makeStyles to have been called', ()=>{
        expect(makeStyles).toHaveBeenCalled(); 
    });

    it('expect shouldSwitchFolder to have been called', ()=>{
        expect(shouldSwitchFolder).toHaveBeenCalled(); 
    });

    afterEach(()=>{
      wrapper.unmount();
    });
});


describe('Folder component when workspace is not empty:', ()=>{
    let wrapper;

    beforeEach(()=>{
        let wrapper_and_store = setUp({settings, files, query, workspace: mock_workspace});
        wrapper = wrapper_and_store.wrapper;
    });

    it('Folders.jsx Should not render if workspace is not empty', ()=> {
        const component = findByTestAttr(wrapper, 'folders');
        expect(component.length).toBe(1);
    });

    it('expect makeStyles to have been called', ()=>{
        expect(makeStyles).toHaveBeenCalled(); 
    });

    it('expect shouldSwitchFolder to have been called', ()=>{
        expect(shouldSwitchFolder).toHaveBeenCalled(); 
    });

    afterEach(()=>{
      wrapper.unmount();
    });
})