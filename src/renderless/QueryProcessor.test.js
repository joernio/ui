import 'jsdom-global/register';
import React from 'react';
import QueryProcessor from './QueryProcessor';
import {default_state as status} from '../store/reducers/statusReducers';
import {default_state as query} from '../store/reducers/queryReducers';
import {default_state as settings} from '../store/reducers/settingsReducers';
import {mount} from 'enzyme';
import {testStore} from '../assets/js/utils/testUtils';
import { shouldRunQuery } from './queryProcessorScripts';
import {
  addToQueue,
  addWorkSpaceQueryToQueue,
} from '../assets/js/utils/scripts';


jest.mock('./queryProcessorScripts', ()=>({
    __esModule: true,
    getFilePathToOpen: jest.fn(()=>new Promise(r=>r(false))),
    shouldRunQuery: jest.fn(()=>false)
}));

jest.mock('../assets/js/utils/scripts', ()=>({
    __esModule: true,
    addToQueue: jest.fn(()=>{}),
    addWorkSpaceQueryToQueue: jest.fn(()=>{}),
    performPeekQueue: jest.fn(()=>{})
}));


const setUp =(initialState={})=> {
    const store = testStore(initialState);
    const wrapper = mount(<QueryProcessor store={store}/>);
    return {wrapper, store};
}

describe('QueryProcessor component when status.connected is falsy:', ()=>{
    let wrapper;

    beforeEach(()=>{
        let wrapper_and_store = setUp({status, query, settings});
        wrapper = wrapper_and_store.wrapper;
    });

    it('expect shouldRunQuery to have been called', ()=>{
        expect(shouldRunQuery).toHaveBeenCalled(); 
    });

    it('expect addWorkSpaceQueryToQueue to not have been called', ()=>{
        expect(addWorkSpaceQueryToQueue).not.toHaveBeenCalled(); 
    });

    it('expect addToQueue to not have been called', ()=>{
        expect(addToQueue).not.toHaveBeenCalled(); 
    });

    afterEach(()=>{
      wrapper.unmount();
    });
});



describe('QueryProcessor status.component when connected is truthy:', ()=>{
    let wrapper;

    beforeEach(()=>{
        let wrapper_and_store = setUp({status: {...status, connected: true}, query, settings});
        wrapper = wrapper_and_store.wrapper;
    });

    it('expect shouldRunQuery to have been called', ()=>{
        expect(shouldRunQuery).toHaveBeenCalled(); 
    });

    it('expect addWorkSpaceQueryToQueue to have been called', ()=>{
        expect(addWorkSpaceQueryToQueue).toHaveBeenCalled(); 
    });

    it('expect addToQueue to have been called', ()=>{
        expect(addToQueue).toHaveBeenCalled(); 
    });

    afterEach(()=>{
      wrapper.unmount();
    });
});