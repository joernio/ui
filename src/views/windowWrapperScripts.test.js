import * as windowWrapperScripts from './windowWrapperScripts';

describe('function handleOpenFile: ', () => {
  it('expect function to return undefined when arg is falsy: ', () => {
    [undefined, null, '', false, 0, {}].map(arg => {
      expect(windowWrapperScripts.handleOpenFile(arg)).toBe(undefined);
    });
  });

  it('expect function return value to be equal to path: ', () => {
    const path = '/a/b/c/d/e';
    const e = {
      target: {
        files: [{ path }],
      },
    };

    expect(windowWrapperScripts.handleOpenFile(e)).toBe(path);
  });
});

// property getOpenFileName doesn't exist in windowWrapperScripts

// describe('function getOpenFileName: ', () => {
//   it('expect function to return undefined when arg is falsy: ', () => {
//     [undefined, null, '', false, 0, {}].map(arg => {
//       expect(windowWrapperScripts.getOpenFileName(arg)).toBe(undefined);
//     });
//   });

//   it('expect function to return undefined: ', () => {
//     const props = { files: { openFilePath: '' } };
//     expect(windowWrapperScripts.getOpenFileName(props)).toBe(undefined);
//   });

//   it('expect function return value to be equal to pre-calculated value: ', () => {
//     const filename = 'f';
//     const props = { files: { openFilePath: `/a/b/c/d/e/d/${filename}` } };
//     expect(windowWrapperScripts.getOpenFileName(props)).toBe(filename);
//   });
// });
