import 'jsdom-global/register';
import React from 'react';
import FilesProcessor from './FilesProcessor';
import {default_state as files} from '../store/reducers/filesReducers';
import {default_state as query} from '../store/reducers/queryReducers';
import {default_state as workspace} from '../store/reducers/workSpaceReducers';
import {mount} from 'enzyme';
import {testStore} from '../assets/js/utils/testUtils';
import { isFilePathInQueryResult } from '../assets/js/utils/scripts';
import {
  getFilePathToOpen,
  isFileInRecentlyOpened,
} from './filesProcessorScripts';


jest.mock('./filesProcessorScripts', ()=>({
    __esModule: true,
    getFilePathToOpen: jest.fn(()=>new Promise(r=>r(false))),
    isFileInRecentlyOpened: jest.fn(()=>{})
}));

jest.mock('../assets/js/utils/scripts', ()=>({
    __esModule: true,
    isFilePathInQueryResult: jest.fn(()=>false)
}));


const setUp =(initialState={})=> {
    const store = testStore(initialState);
    const wrapper = mount(<FilesProcessor store={store}/>);
    return {wrapper, store};
}

describe('FileProcessor component:', ()=>{
    let wrapper;

    beforeEach(()=>{
        let wrapper_and_store = setUp({files, query, workspace});
        wrapper = wrapper_and_store.wrapper;
    });

    it('expect getFilePathToOpen to have been called', ()=>{
        expect(getFilePathToOpen).toHaveBeenCalled(); 
    });

    it('expect isFileInRecentlyOpened to have been called', ()=>{
        expect(isFileInRecentlyOpened).toHaveBeenCalled(); 
    });

    it('expect isFilePathInQueryResult to have been called', ()=>{
        expect(isFilePathInQueryResult).toHaveBeenCalled(); 
    });

    afterEach(()=>{
      wrapper.unmount();
    });
});