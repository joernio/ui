import * as windowWrapperScripts from './windowWrapperScripts';


describe("function handleOpenFile: ", ()=>{
  it("expect function to return undefined when arg is falsy: ", ()=>{
    [undefined, null, "", false, 0, {}].map(arg=>{
        expect(windowWrapperScripts.handleOpenFile(arg)).toBe(undefined);
    })
  });

  it("expect function return value to be equal to path: ",()=>{
    const path = "/a/b/c/d/e";
    const e = {
        target: {
            files: [{path}]
        }
    };

    expect(windowWrapperScripts.handleOpenFile(e)).toBe(path);
  });
});


describe("function getOpenFileName: ", ()=>{
    it("expect function to return undefined when arg is falsy: ", ()=>{
        [undefined, null, "", false, 0, {}].map(arg=>{
            expect(windowWrapperScripts.getOpenFileName(arg)).toBe(undefined);
        })
      });

    it("expect function to return null when recent is empty object: ", ()=>{
        const props = {files:{recent:{}}};
        expect(windowWrapperScripts.getOpenFileName(props)).toBe(null);
    });

    it("expect function return value to be equal to pre-calculated value: ", ()=>{
        const filename = "f";
        const props = {files:{recent:{[`/a/b/c/d/e/d/${filename}`]: true}}};
        expect(windowWrapperScripts.getOpenFileName(props)).toBe(filename);
    });
});