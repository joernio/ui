import * as TWS from './terminalWindowScripts';
import { terminalVariables as TV } from '../../assets/js/utils/defaultVariables';
import { windowActionApi } from '../../assets/js/utils/ipcRenderer';
import { store } from '../../store/configureStore';
import { Terminal } from 'xterm';
import { enQueueQuery } from '../../store/actions/queryActions';
import {
  setHistory,
  setTerminalBusy,
} from '../../store/actions/terminalActions';

jest.mock('../../store/configureStore', () => ({
  __esModule: true,
  store: { dispatch: jest.fn() },
}));

jest.mock('xterm', () => ({
  __esModule: true,
  default: jest.fn(),
  Terminal: jest.fn(function (obj) {
    this.config = obj;
  }),
}));

jest.mock('xterm-addon-fit', () => ({
  __esModule: true,
  default: jest.fn(),
  FitAddon: jest.fn(function () {
    this.fit = jest.fn();
  }),
}));

jest.mock('monaco-editor', () => ({
  __esModule: true,
  Range: jest.fn(function () {
    this.res = [...arguments];
  }),
}));

jest.mock('../../store/actions/queryActions', () => ({
  __esModule: true,
  enQueueQuery: jest.fn(arg => arg.query),
}));

jest.mock('../../store/actions/terminalActions', () => ({
  __esModule: true,
  setHistory: jest.fn(obj => obj),
  setTerminalBusy: jest.fn(bool => bool),
}));

jest.mock('../../assets/js/utils/ipcRenderer', () => ({
  __esModule: true,
  windowActionApi: {
    copyToClipBoard: jest.fn(),
    pasteFromClipBoard: jest.fn(),
    registerPasteFromClipBoardListener: jest.fn(fn => fn('test')),
  },
}));

describe('function updateData: ', () => {
  beforeEach(() => {
    TWS.data_obj.data = '';
    TWS.cursorPosition = 0;
  });

  it("expect data_obj.data to be equal to '' when function arg is falsy: ", () => {
    [undefined, null, '', false, 0].map(arg => {
      TWS.updateData(arg);
      expect(TWS.data_obj.data).toBe('');
    });
  });

  it("expect data_obj.data to be equal to the 'abcdefghi': ", () => {
    TWS.updateData('b');
    TWS.data_obj.cursorPosition += 1;
    TWS.updateData('d');
    TWS.data_obj.cursorPosition += 1;
    TWS.updateData('f');
    TWS.data_obj.cursorPosition += 1;
    TWS.updateData('h');
    TWS.data_obj.cursorPosition = 0;
    TWS.updateData('a');
    TWS.data_obj.cursorPosition = 2;
    TWS.updateData('c');
    TWS.data_obj.cursorPosition = 4;
    TWS.updateData('e');
    TWS.data_obj.cursorPosition = 6;
    TWS.updateData('g');
    TWS.data_obj.cursorPosition = 8;
    TWS.updateData('i');
    expect(TWS.data_obj.data).toBe('abcdefghi');
    expect(TWS.data_obj.cursorPosition).toBe(8);
  });
});

describe('function updateCursorPosition: ', () => {
  it('expect data_obj.cursorPosition to be equal to arg passed to the function: ', () => {
    const value = 7;
    TWS.updateCursorPosition(value);
    expect(TWS.data_obj.cursorPosition).toBe(value);
  });
});

describe('function constructInputToWrite: ', () => {
  TWS.data_obj.data = 'this is a test';
  TWS.data_obj.cursorPosition = 14;

  it('expect function to return expected value: ', () => {
    const expected =
      TV.clearLine +
      TV.joernDefaultPrompt +
      TWS.data_obj.data +
      TV.carriageReturn +
      TV.cursorPositionFromStart
        .split('<n>')
        .join(TV.joernDefaultPrompt.length + TWS.data_obj.cursorPosition);
    expect(TWS.constructInputToWrite()).toBe(expected);
  });
});

describe('function constructOutputToWrite: ', () => {
  it("expect function to return '<pre>{value}<pre>'", () => {
    expect(TWS.constructOutputToWrite(null, 'test', true)).toBe(
      '<pre>test</pre>',
    );
  });

  it('expect function to return specific string configuration for each combination: ', () => {
    expect(TWS.constructOutputToWrite(null, null)).toBe(
      TV.clearLine + ' Running script .....',
    );
    expect(TWS.constructOutputToWrite('test ', null)).toBe(
      TV.clearLine + 'test Running script .....',
    );
    expect(TWS.constructOutputToWrite(null, 'output')).toBe(
      TV.clearLine + ' output',
    );
    expect(TWS.constructOutputToWrite('test ', 'output')).toBe(
      TV.clearLine + 'test output',
    );
  });
});

describe('function handleTerminalMaximizeToggle: ', () => {
  it('expect function to return { isMaximized: true } when arg is falsy: ', () => {
    [undefined, null, '', false, 0].map(arg => {
      expect(TWS.handleTerminalMaximizeToggle(arg).isMaximized).toBe(true);
    });
  });

  it('expect function to return { isMaximized: false } when arg is truthy: ', () => {
    [1, true, 'true'].map(arg => {
      expect(TWS.handleTerminalMaximizeToggle(arg).isMaximized).toBe(false);
    });
  });
});

describe('function handleResize: ', () => {
  let fit;

  beforeEach(() => {
    fit = jest.fn(() => {});
  });

  it('expect function to call fitAddon.fit', () => {
    TWS.handleResize({ fit });
    expect(fit).toHaveBeenCalled();
  });
});

describe('function handleEmptyWorkspace: ', () => {
  it('expect function to return empty object: ', () => {
    [undefined, null, '', false, 0].map(arg => {
      expect(Object.keys(TWS.handleEmptyWorkspace(arg, arg)).length).toBe(0);
    });
  });

  it('expect function to return {isMaximized: true}: ', () => {
    expect(
      TWS.handleEmptyWorkspace({ projects: {} }, { projects: {} }).isMaximized,
    ).toBe(true);
  });

  it('expect function to return {isMaximized: false}: ', () => {
    expect(
      TWS.handleEmptyWorkspace({ projects: { a: {} } }, { projects: {} })
        .isMaximized,
    ).toBe(false);
  });
});

describe('function openXTerm: ', () => {
  let onKey, open, term, handleXTermOnKey;
  beforeEach(() => {
    onKey = jest.fn(fn => fn());
    open = jest.fn();
    term = { onKey, open };
    handleXTermOnKey = jest
      .spyOn(TWS, 'handleXTermOnKey')
      .mockImplementation(() => new Promise(r => r()));
  });

  it('expect function to call onKey and arg passed to onKey, and call open with a given arg: ', () => {
    const refs = { terminalRef: { current: 'current' } };
    Promise.resolve().then(() => jest.useFakeTimers());
    TWS.openXTerm(refs, term);
    Promise.resolve().then(() => jest.runAllTimers());

    expect(onKey).toHaveBeenCalled();
    expect(open).toHaveBeenCalledWith('current');
    expect(handleXTermOnKey).toHaveBeenCalled();
  });

  afterEach(() => {
    handleXTermOnKey.mockRestore();
  });
});

describe('function termWrite: ', () => {
  it('expect function to return promise and call term.write when promise has resolved: ', async () => {
    const write = jest.fn((_, fn) => fn());
    const term = { write };
    const response = TWS.termWrite(term);
    expect(response.then).not.toBe(undefined);
    await response;
    expect(write).toHaveBeenCalled();
  });
});

describe('function termWriteLn: ', () => {
  it('expect function to return promise and call term.writeln when promise has resolved: ', async () => {
    const writeln = jest.fn((_, fn) => fn());
    const term = { writeln };
    const response = TWS.termWriteLn(term);
    expect(response.then).not.toBe(undefined);
    await response;
    expect(writeln).toHaveBeenCalled();
  });
});

describe('function getNext: ', () => {
  it("expect function to return '': ", () => {
    expect(TWS.getNext({ next_queries: {} })).toBe('');
  });

  it('expect function to return last property of next_queries obj: ', () => {
    const a = {};
    const b = {};
    expect(TWS.getNext({ next_queries: { a, b } })).toBe(b);
    expect(typeof TWS.getNext({ next_queries: { a, b } })).toBe('object');
  });
});

describe('function getPrev: ', () => {
  let getNext;

  beforeEach(() => {
    getNext = jest.spyOn(TWS, 'getNext').mockImplementation(() => '');
  });

  it("expect function to return '': ", () => {
    expect(TWS.getPrev({ prev_queries: {}, next_queries: {} })).toBe('');
    expect(getNext).toHaveBeenCalled();
  });

  it('expect function to return last property of prev_queries obj: ', () => {
    const a = {};
    const b = {};
    expect(typeof TWS.getPrev({ prev_queries: { a, b } })).toBe('object');
    expect(TWS.getPrev({ prev_queries: { a, b } })).toBe(b);
  });

  afterEach(() => {
    getNext.mockRestore();
  });
});

describe('function removeOldestQueryFromHistory: ', () => {
  it('expect function to delete first property of history.prev_queries object: ', () => {
    const a = {};
    const b = {};
    const history = { prev_queries: { a, b } };
    const response = TWS.removeOldestQueryFromHistory(
      history,
      Object.keys(history),
    );

    expect(response).toBe(history);
    expect(Object.keys(response).length).toBe(1);
    expect(response.a).toBe(undefined);
  });
});

describe('function addQueryToHistory: ', () => {
  let getNext;

  beforeEach(() => {
    getNext = jest.spyOn(TWS, 'rotateNext').mockImplementation(history => {
      history.prev_queries = {
        ...history.prev_queries,
        ...history.next_queries,
      };
      history.next_queries = {};
      return history;
    });
  });

  it('expect prev_queries to be a combination of prev_queries, next_queries and queue: ', () => {
    const history = {
      prev_queries: { a: { a: true }, b: { b: true } },
      next_queries: { c: { c: true }, d: { d: true } },
    };
    const queue = { e: { e: true } };

    const response = TWS.addQueryToHistory(
      history,
      queue,
      Object.keys(queue)[0],
    );

    expect(JSON.stringify(response)).toBe(
      JSON.stringify({
        prev_queries: {
          ...history.prev_queries,
          ...history.next_queries,
          [Object.keys(queue)[0]]: queue[Object.keys(queue)[0]],
        },
        next_queries: {},
      }),
    );
  });

  afterEach(() => {
    getNext.mockRestore();
  });
});

describe('function rotateNext: ', () => {
  it('expect last history in history.next_queries to be rotated into history.prev_queries: ', () => {
    const history = {
      prev_queries: { a: { a: true }, b: { b: true } },
      next_queries: { c: { c: true }, d: { d: true } },
    };
    const rotated = {
      prev_queries: { a: { a: true }, b: { b: true }, d: { d: true } },
      next_queries: { c: { c: true } },
    };
    const response = TWS.rotateNext(history);

    expect(JSON.stringify(response)).toBe(JSON.stringify(rotated));
  });

  it('expect no rotation: ', () => {
    const history = {
      prev_queries: { a: { a: true }, b: { b: true } },
      next_queries: {},
    };
    const response = TWS.rotateNext(history);

    expect(JSON.stringify(response)).toBe(JSON.stringify(history));
  });
});

describe('function rotatePrev: ', () => {
  it('expect last history in history.prev_queries to be rotated into history.next_queries: ', () => {
    const history = {
      prev_queries: { a: { a: true }, b: { b: true } },
      next_queries: { c: { c: true }, d: { d: true } },
    };
    const rotated = {
      prev_queries: { a: { a: true } },
      next_queries: { c: { c: true }, d: { d: true }, b: { b: true } },
    };
    const response = TWS.rotatePrev(history);

    expect(JSON.stringify(response)).toBe(JSON.stringify(rotated));
  });

  it('expect no rotation: ', () => {
    const history = {
      prev_queries: {},
      next_queries: { c: { c: true }, d: { d: true } },
    };
    const response = TWS.rotatePrev(history);

    expect(JSON.stringify(response)).toBe(JSON.stringify(history));
  });
});

describe('function initFitAddon: ', () => {
  it('expect function to return null: ', () => {
    [undefined, null, '', false, 0].map(arg =>
      expect(TWS.initFitAddon(arg)).toBe(null),
    );
  });

  it('expect function to return object: ', () => {
    const loadAddon = jest.fn();
    const term = { loadAddon };
    const fit_addon = TWS.initFitAddon(term);

    expect(typeof fit_addon).toBe('object');
    expect(fit_addon).not.toBe(null);
    expect(term.loadAddon).toHaveBeenCalledWith(fit_addon);
    expect(fit_addon.fit).toHaveBeenCalled();
  });
});

describe('function handleCopyToClipBoard: ', () => {
  beforeEach(() => {
    windowActionApi.copyToClipBoard.mockClear();
  });

  it('expect function to call windowActionApi.copyToClipBoard: ', () => {
    const str = 'test';
    TWS.handleCopyToClipBoard(str);

    expect(windowActionApi.copyToClipBoard).toHaveBeenCalledWith(str);
  });

  afterEach(() => {
    windowActionApi.copyToClipBoard.mockClear();
  });
});

describe('function handlePasteFromClipBoard: ', () => {
  let updateData,
    updateCursorPosition,
    termWrite,
    constructInputToWrite,
    handleWriteToCircuitUIInput;

  beforeEach(() => {
    TWS.data_obj.cursorPosition = 0;
    TWS.data_obj.data = '';
    windowActionApi.pasteFromClipBoard.mockClear();
    windowActionApi.registerPasteFromClipBoardListener.mockClear();
    updateData = jest.spyOn(TWS, 'updateData').mockImplementation(() => {});
    updateCursorPosition = jest
      .spyOn(TWS, 'updateCursorPosition')
      .mockImplementation(() => {});
    termWrite = jest
      .spyOn(TWS, 'termWrite')
      .mockImplementation(() => new Promise(r => r()));
    constructInputToWrite = jest
      .spyOn(TWS, 'constructInputToWrite')
      .mockImplementation(() => 'input-to-write');
    handleWriteToCircuitUIInput = jest
      .spyOn(TWS, 'handleWriteToCircuitUIInput')
      .mockImplementation(() => {});
  });

  it('expect function to call specific functions: ', async () => {
    const term = {};
    const refs = {};
    await TWS.handlePasteFromClipBoard(term, refs);

    expect(windowActionApi.pasteFromClipBoard).toHaveBeenCalled();
    expect(
      windowActionApi.registerPasteFromClipBoardListener,
    ).toHaveBeenCalled();
    expect(updateData).toHaveBeenCalledWith('test');
    expect(updateCursorPosition).toHaveBeenCalledWith(4);
    expect(constructInputToWrite).toHaveBeenCalled();
    expect(termWrite).toHaveBeenCalledWith(term, 'input-to-write');
    expect(handleWriteToCircuitUIInput).toHaveBeenCalledWith(refs);
  });

  afterEach(() => {
    TWS.data_obj.cursorPosition = 0;
    TWS.data_obj.data = '';
    windowActionApi.pasteFromClipBoard.mockClear();
    windowActionApi.registerPasteFromClipBoardListener.mockClear();
    updateData.mockRestore();
    updateCursorPosition.mockRestore();
    termWrite.mockRestore();
    constructInputToWrite.mockRestore();
    handleWriteToCircuitUIInput.mockRestore();
  });
});

describe('function handleEnter: ', () => {
  let updateData,
    updateCursorPosition,
    termWriteLn,
    constructOutputToWrite,
    handleWriteToCircuitUIResponse,
    handleWriteToCircuitUIInput;

  beforeEach(() => {
    TWS.data_obj.cursorPosition = 4;
    TWS.data_obj.data = 'test';
    updateData = jest.spyOn(TWS, 'updateData').mockImplementation(() => {});
    updateCursorPosition = jest
      .spyOn(TWS, 'updateCursorPosition')
      .mockImplementation(() => {});
    termWriteLn = jest
      .spyOn(TWS, 'termWriteLn')
      .mockImplementation(() => new Promise(r => r()));
    constructOutputToWrite = jest
      .spyOn(TWS, 'constructOutputToWrite')
      .mockImplementation((a, b, c) => `${a}-${b}-${c}`);
    handleWriteToCircuitUIResponse = jest
      .spyOn(TWS, 'handleWriteToCircuitUIResponse')
      .mockImplementation(() => {});
    handleWriteToCircuitUIInput = jest
      .spyOn(TWS, 'handleWriteToCircuitUIInput')
      .mockImplementation(() => {});
  });

  it('expect function to call specific functions: ', async () => {
    const term = {};
    const refs = {};
    await TWS.handleEnter(term, refs);
    expect(enQueueQuery).toHaveBeenCalled();
    expect(setTerminalBusy).toHaveBeenCalled();
    expect(store.dispatch).toHaveBeenNthCalledWith(1, 'test');
    expect(store.dispatch).toHaveBeenNthCalledWith(2, true);
    expect(termWriteLn).toHaveBeenCalledWith(term, '');
    expect(constructOutputToWrite).toHaveBeenCalledWith(
      null,
      TWS.data_obj.data,
      true,
    );
    expect(handleWriteToCircuitUIResponse).toHaveBeenCalledWith(
      refs,
      'null-test-true',
      'query',
    );
    expect(updateData).toHaveBeenCalledWith(null);
    expect(updateCursorPosition).toHaveBeenCalledWith(0);
    expect(handleWriteToCircuitUIInput).toHaveBeenCalledWith(refs);
  });

  afterEach(() => {
    TWS.data_obj.cursorPosition = 0;
    TWS.data_obj.data = '';
    updateData.mockRestore();
    updateCursorPosition.mockRestore();
    termWriteLn.mockRestore();
    constructOutputToWrite.mockRestore();
    handleWriteToCircuitUIResponse.mockRestore();
    handleWriteToCircuitUIInput.mockRestore();
    enQueueQuery.mockClear();
    setTerminalBusy.mockClear();
    store.dispatch.mockClear();
  });
});

describe('function handleBackspace: ', () => {
  let updateData,
    updateCursorPosition,
    termWrite,
    constructInputToWrite,
    handleWriteToCircuitUIInput;

  beforeEach(() => {
    TWS.data_obj.cursorPosition = 4;
    TWS.data_obj.data = 'test';
    updateData = jest.spyOn(TWS, 'updateData').mockImplementation(() => {});
    updateCursorPosition = jest
      .spyOn(TWS, 'updateCursorPosition')
      .mockImplementation(() => {});
    termWrite = jest
      .spyOn(TWS, 'termWrite')
      .mockImplementation(() => new Promise(r => r()));
    constructInputToWrite = jest
      .spyOn(TWS, 'constructInputToWrite')
      .mockImplementation(() => 'tes');
    handleWriteToCircuitUIInput = jest
      .spyOn(TWS, 'handleWriteToCircuitUIInput')
      .mockImplementation(() => {});
  });

  it('expect function to call specific functions: ', async () => {
    const term = {};
    const refs = {};
    await TWS.handleBackspace(term, refs);
    expect(updateData).toHaveBeenNthCalledWith(1, null);
    expect(updateData).toHaveBeenNthCalledWith(2, 'tes');
    expect(updateCursorPosition).toHaveBeenNthCalledWith(1, 0);
    expect(updateCursorPosition).toHaveBeenNthCalledWith(2, 3);
    expect(constructInputToWrite).toHaveBeenCalled();
    expect(termWrite).toHaveBeenCalledWith(term, 'tes');
    expect(handleWriteToCircuitUIInput).toHaveBeenCalledWith(refs);
  });

  afterEach(() => {
    TWS.data_obj.cursorPosition = 0;
    TWS.data_obj.data = '';
    updateData.mockRestore();
    updateCursorPosition.mockRestore();
    termWrite.mockRestore();
    constructInputToWrite.mockRestore();
    handleWriteToCircuitUIInput.mockRestore();
  });
});

describe('function handleArrowUp: ', () => {
  let ev,
    getPrev,
    rotatePrev,
    updateData,
    updateCursorPosition,
    termWrite,
    constructInputToWrite,
    handleWriteToCircuitUIInput;

  beforeEach(() => {
    TWS.data_obj.cursorPosition = 0;
    TWS.data_obj.data = '';
    ev = { preventDefault: jest.fn() };
    getPrev = jest
      .spyOn(TWS, 'getPrev')
      .mockImplementation(
        ({ prev_queries }) =>
          prev_queries[
            Object.keys(prev_queries)[Object.keys(prev_queries).length - 1]
          ],
      );
    rotatePrev = jest.spyOn(TWS, 'rotatePrev').mockImplementation(obj => obj);
    updateData = jest.spyOn(TWS, 'updateData').mockImplementation(() => {});
    updateCursorPosition = jest
      .spyOn(TWS, 'updateCursorPosition')
      .mockImplementation(() => {});
    termWrite = jest
      .spyOn(TWS, 'termWrite')
      .mockImplementation(() => new Promise(r => r()));
    constructInputToWrite = jest
      .spyOn(TWS, 'constructInputToWrite')
      .mockImplementation(() => 'test');
    handleWriteToCircuitUIInput = jest
      .spyOn(TWS, 'handleWriteToCircuitUIInput')
      .mockImplementation(() => {});
  });

  it('expect function to call specific functions: ', async () => {
    const term = {};
    const refs = {
      circuitUIRef: {
        current: { children: [null, { children: [{ value: null }] }] },
      },
    };
    const history = {
      prev_queries: { a: { query: 'a' }, b: { query: 'b' } },
      next_queries: { c: { query: 'c' }, d: { query: 'd' } },
    };
    await TWS.handleArrowUp(term, refs, history, ev);
    expect(ev.preventDefault).toHaveBeenCalled();
    expect(getPrev).toHaveBeenCalledWith(history);
    expect(rotatePrev).toHaveBeenCalledWith({ ...history });
    expect(updateData).toHaveBeenNthCalledWith(1, null);
    expect(updateData).toHaveBeenNthCalledWith(2, 'b');
    expect(updateCursorPosition).toHaveBeenNthCalledWith(1, 0);
    expect(updateCursorPosition).toHaveBeenNthCalledWith(2, 1);
    expect(refs.circuitUIRef.current.children[1].children[0].value).toBe('');
    expect(constructInputToWrite).toHaveBeenCalled();
    expect(termWrite).toHaveBeenCalledWith(term, 'test');
    expect(handleWriteToCircuitUIInput).toHaveBeenCalledWith(refs);
    expect(setHistory).toHaveBeenCalledWith(history);
    expect(store.dispatch).toHaveBeenCalledWith(history);
  });

  afterEach(() => {
    TWS.data_obj.cursorPosition = 0;
    TWS.data_obj.data = '';
    getPrev.mockRestore();
    rotatePrev.mockRestore();
    updateData.mockRestore();
    updateCursorPosition.mockRestore();
    termWrite.mockRestore();
    constructInputToWrite.mockRestore();
    handleWriteToCircuitUIInput.mockRestore();
    setHistory.mockClear();
    store.dispatch.mockClear();
  });
});

describe('function handleArrowDown: ', () => {
  let ev,
    getNext,
    rotateNext,
    updateData,
    updateCursorPosition,
    termWrite,
    constructInputToWrite,
    handleWriteToCircuitUIInput;

  beforeEach(() => {
    TWS.data_obj.cursorPosition = 0;
    TWS.data_obj.data = '';
    ev = { preventDefault: jest.fn() };
    getNext = jest
      .spyOn(TWS, 'getNext')
      .mockImplementation(
        ({ next_queries }) =>
          next_queries[
            Object.keys(next_queries)[Object.keys(next_queries).length - 1]
          ],
      );
    rotateNext = jest.spyOn(TWS, 'rotateNext').mockImplementation(obj => obj);
    updateData = jest.spyOn(TWS, 'updateData').mockImplementation(() => {});
    updateCursorPosition = jest
      .spyOn(TWS, 'updateCursorPosition')
      .mockImplementation(() => {});
    termWrite = jest
      .spyOn(TWS, 'termWrite')
      .mockImplementation(() => new Promise(r => r()));
    constructInputToWrite = jest
      .spyOn(TWS, 'constructInputToWrite')
      .mockImplementation(() => 'test');
    handleWriteToCircuitUIInput = jest
      .spyOn(TWS, 'handleWriteToCircuitUIInput')
      .mockImplementation(() => {});
  });

  it('expect function to call specific functions: ', async () => {
    const term = {};
    const refs = {
      circuitUIRef: {
        current: { children: [null, { children: [{ value: null }] }] },
      },
    };
    const history = {
      prev_queries: { a: { query: 'a' }, b: { query: 'b' } },
      next_queries: { c: { query: 'c' }, d: { query: 'd' } },
    };
    await TWS.handleArrowDown(term, refs, history, ev);
    expect(ev.preventDefault).toHaveBeenCalled();
    expect(getNext).toHaveBeenCalledWith(history);
    expect(rotateNext).toHaveBeenCalledWith({ ...history });
    expect(updateData).toHaveBeenNthCalledWith(1, null);
    expect(updateData).toHaveBeenNthCalledWith(2, 'd');
    expect(updateCursorPosition).toHaveBeenNthCalledWith(1, 0);
    expect(updateCursorPosition).toHaveBeenNthCalledWith(2, 1);
    expect(refs.circuitUIRef.current.children[1].children[0].value).toBe('');
    expect(constructInputToWrite).toHaveBeenCalled();
    expect(termWrite).toHaveBeenCalledWith(term, 'test');
    expect(handleWriteToCircuitUIInput).toHaveBeenCalledWith(refs);
    expect(setHistory).toHaveBeenCalledWith(history);
    expect(store.dispatch).toHaveBeenCalledWith(history);
  });

  afterEach(() => {
    TWS.data_obj.cursorPosition = 0;
    TWS.data_obj.data = '';
    getNext.mockRestore();
    rotateNext.mockRestore();
    updateData.mockRestore();
    updateCursorPosition.mockRestore();
    termWrite.mockRestore();
    constructInputToWrite.mockRestore();
    handleWriteToCircuitUIInput.mockRestore();
    setHistory.mockClear();
    store.dispatch.mockClear();
  });
});

describe('function handleArrowLeft: ', () => {
  let updateCursorPosition,
    termWrite,
    constructInputToWrite,
    handleWriteToCircuitUIInput;

  beforeEach(() => {
    updateCursorPosition = jest
      .spyOn(TWS, 'updateCursorPosition')
      .mockImplementation(() => {});
    termWrite = jest
      .spyOn(TWS, 'termWrite')
      .mockImplementation(() => new Promise(r => r()));
    constructInputToWrite = jest
      .spyOn(TWS, 'constructInputToWrite')
      .mockImplementation(() => 'test');
    handleWriteToCircuitUIInput = jest
      .spyOn(TWS, 'handleWriteToCircuitUIInput')
      .mockImplementation(() => {});
  });

  it('expect function to call specific functions: ', async () => {
    const term = {};
    const refs = {};
    TWS.data_obj.cursorPosition = 4;
    TWS.data_obj.data = 'test';
    await TWS.handleArrowLeft(term, refs);
    expect(updateCursorPosition).toHaveBeenCalledWith(3);
    expect(constructInputToWrite).toHaveBeenCalled();
    expect(termWrite).toHaveBeenCalledWith(term, 'test');
    expect(handleWriteToCircuitUIInput).toHaveBeenCalledWith(refs);
  });

  it('expect updateCursorPosition to be called with 0: ', async () => {
    const term = {};
    const refs = {};
    TWS.data_obj.cursorPosition = 0;
    TWS.data_obj.data = 'test';
    await TWS.handleArrowLeft(term, refs);
    expect(updateCursorPosition).toHaveBeenCalledWith(0);
  });

  afterEach(() => {
    TWS.data_obj.cursorPosition = 0;
    TWS.data_obj.data = '';
    updateCursorPosition.mockRestore();
    termWrite.mockRestore();
    constructInputToWrite.mockRestore();
    handleWriteToCircuitUIInput.mockRestore();
  });
});

describe('function handleArrowRight: ', () => {
  let updateCursorPosition,
    termWrite,
    constructInputToWrite,
    handleWriteToCircuitUIInput;

  beforeEach(() => {
    updateCursorPosition = jest
      .spyOn(TWS, 'updateCursorPosition')
      .mockImplementation(() => {});
    termWrite = jest
      .spyOn(TWS, 'termWrite')
      .mockImplementation(() => new Promise(r => r()));
    constructInputToWrite = jest
      .spyOn(TWS, 'constructInputToWrite')
      .mockImplementation(() => 'test');
    handleWriteToCircuitUIInput = jest
      .spyOn(TWS, 'handleWriteToCircuitUIInput')
      .mockImplementation(() => {});
  });

  it('expect function to call specific functions: ', async () => {
    const term = {};
    const refs = {};
    TWS.data_obj.cursorPosition = 3;
    TWS.data_obj.data = 'test';
    await TWS.handleArrowRight(term, refs);
    expect(updateCursorPosition).toHaveBeenCalledWith(4);
    expect(constructInputToWrite).toHaveBeenCalled();
    expect(termWrite).toHaveBeenCalledWith(term, 'test');
    expect(handleWriteToCircuitUIInput).toHaveBeenCalledWith(refs);
  });

  it('expect updateCursorPosition to be called with 4: ', async () => {
    const term = {};
    const refs = {};
    TWS.data_obj.cursorPosition = 4;
    TWS.data_obj.data = 'test';
    await TWS.handleArrowRight(term, refs);
    expect(updateCursorPosition).toHaveBeenCalledWith(4);
  });

  afterEach(() => {
    TWS.data_obj.cursorPosition = 0;
    TWS.data_obj.data = '';
    updateCursorPosition.mockRestore();
    termWrite.mockRestore();
    constructInputToWrite.mockRestore();
    handleWriteToCircuitUIInput.mockRestore();
  });
});

describe('function handlePrintable: ', () => {
  let updateData,
    updateCursorPosition,
    termWrite,
    constructInputToWrite,
    handleWriteToCircuitUIInput;

  beforeEach(() => {
    updateData = jest.spyOn(TWS, 'updateData').mockImplementation(() => {});
    updateCursorPosition = jest
      .spyOn(TWS, 'updateCursorPosition')
      .mockImplementation(() => {});
    termWrite = jest
      .spyOn(TWS, 'termWrite')
      .mockImplementation(() => new Promise(r => r()));
    constructInputToWrite = jest
      .spyOn(TWS, 'constructInputToWrite')
      .mockImplementation(() => 'test');
    handleWriteToCircuitUIInput = jest
      .spyOn(TWS, 'handleWriteToCircuitUIInput')
      .mockImplementation(() => {});
  });

  it('expect function to call specific functions: ', async () => {
    const term = {};
    const refs = {};
    const e = { key: 'a' };
    TWS.data_obj.cursorPosition = 0;
    TWS.data_obj.data = '';
    await TWS.handlePrintable(term, refs, e);
    expect(updateData).toHaveBeenCalledWith(e.key);
    expect(updateCursorPosition).toHaveBeenCalledWith(1);
    expect(constructInputToWrite).toHaveBeenCalled();
    expect(termWrite).toHaveBeenCalledWith(term, 'test');
    expect(handleWriteToCircuitUIInput).toHaveBeenCalledWith(refs);
  });

  afterEach(() => {
    TWS.data_obj.cursorPosition = 0;
    TWS.data_obj.data = '';
    updateData.mockRestore();
    updateCursorPosition.mockRestore();
    termWrite.mockRestore();
    constructInputToWrite.mockRestore();
    handleWriteToCircuitUIInput.mockRestore();
  });
});

describe('function handleWriteQueryResult: ', () => {
  let updateData,
    updateCursorPosition,
    termWriteLn,
    constructOutputToWrite,
    handleWriteToCircuitUIResponse;

  beforeEach(() => {
    updateData = jest.spyOn(TWS, 'updateData').mockImplementation(() => {});
    updateCursorPosition = jest
      .spyOn(TWS, 'updateCursorPosition')
      .mockImplementation(() => {});
    termWriteLn = jest
      .spyOn(TWS, 'termWriteLn')
      .mockImplementation(() => new Promise(r => r()));
    constructOutputToWrite = jest
      .spyOn(TWS, 'constructOutputToWrite')
      .mockImplementation((a, b, c) => `${a}-${b}-${c}`);
    handleWriteToCircuitUIResponse = jest
      .spyOn(TWS, 'handleWriteToCircuitUIResponse')
      .mockImplementation(() => {});
  });

  it('expect function to call specific functions: ', async () => {
    const term = { prompt: jest.fn() };
    const refs = {};
    const latest = {
      result: {
        stdout: 'stdout1\nstdout2\nstdout3',
        stderr: 'stderr1\nstderr1\nstderr1',
      },
    };
    const response = await TWS.handleWriteQueryResult(term, refs, latest);
    expect(response).toBe(true);
    expect(updateData).toHaveBeenCalledWith(null);
    expect(updateCursorPosition).toHaveBeenCalledWith(0);

    latest.result.stdout.split('\n').forEach((line, index) => {
      expect(constructOutputToWrite).toHaveBeenNthCalledWith(
        index + 1,
        null,
        line,
      );
      expect(termWriteLn).toHaveBeenNthCalledWith(
        index + 1,
        term,
        `null-${line}-undefined`,
      );
    });

    expect(constructOutputToWrite).toHaveBeenNthCalledWith(
      4,
      null,
      latest.result.stdout,
      true,
    );
    expect(handleWriteToCircuitUIResponse).toHaveBeenCalledWith(
      refs,
      `null-${latest.result.stdout}-true`,
      'stdout',
    );
    expect(term.prompt).toHaveBeenCalled();
    expect(setTerminalBusy).toHaveBeenCalledWith(false);
    expect(store.dispatch).toHaveBeenCalledWith(false);
  });

  it('expect function to output stderr value: ', async () => {
    const term = { prompt: jest.fn() };
    const refs = {};
    const latest = { result: { stderr: 'stderr1\nstderr1\nstderr1' } };
    const response = await TWS.handleWriteQueryResult(term, refs, latest);
    expect(response).toBe(true);
    expect(updateData).toHaveBeenCalledWith(null);
    expect(updateCursorPosition).toHaveBeenCalledWith(0);

    latest.result.stderr.split('\n').forEach((line, index) => {
      expect(constructOutputToWrite).toHaveBeenNthCalledWith(
        index + 1,
        null,
        line,
      );
      expect(termWriteLn).toHaveBeenNthCalledWith(
        index + 1,
        term,
        `null-${line}-undefined`,
      );
    });

    expect(constructOutputToWrite).toHaveBeenNthCalledWith(
      4,
      null,
      latest.result.stderr,
      true,
    );
    expect(handleWriteToCircuitUIResponse).toHaveBeenCalledWith(
      refs,
      `null-${latest.result.stderr}-true`,
      'stderr',
    );
    expect(term.prompt).toHaveBeenCalled();
    expect(setTerminalBusy).toHaveBeenCalledWith(false);
    expect(store.dispatch).toHaveBeenCalledWith(false);
  });

  afterEach(() => {
    TWS.data_obj.cursorPosition = 0;
    TWS.data_obj.data = '';
    updateData.mockRestore();
    updateCursorPosition.mockRestore();
    termWriteLn.mockRestore();
    constructOutputToWrite.mockRestore();
    handleWriteToCircuitUIResponse.mockRestore();
    setTerminalBusy.mockClear();
    store.dispatch.mockClear();
  });
});

describe('function handleWriteScriptQuery: ', () => {
  let updateData,
    updateCursorPosition,
    termWriteLn,
    constructOutputToWrite,
    handleWriteToCircuitUIResponse;

  beforeEach(() => {
    updateData = jest.spyOn(TWS, 'updateData').mockImplementation(() => {});
    updateCursorPosition = jest
      .spyOn(TWS, 'updateCursorPosition')
      .mockImplementation(() => {});
    termWriteLn = jest
      .spyOn(TWS, 'termWriteLn')
      .mockImplementation(() => new Promise(r => r()));
    constructOutputToWrite = jest
      .spyOn(TWS, 'constructOutputToWrite')
      .mockImplementation((a, b, c) => `${a}-${b}-${c}`);
    handleWriteToCircuitUIResponse = jest
      .spyOn(TWS, 'handleWriteToCircuitUIResponse')
      .mockImplementation(() => {});
  });

  it('expect function to call specific functions: ', async () => {
    const term = {};
    const refs = {};
    await TWS.handleWriteScriptQuery(term, refs);
    expect(updateData).toHaveBeenCalledWith(null);
    expect(updateCursorPosition).toHaveBeenCalledWith(0);

    expect(constructOutputToWrite).toHaveBeenNthCalledWith(1, null, null);
    expect(termWriteLn).toHaveBeenCalledWith(term, 'null-null-undefined');
    expect(constructOutputToWrite).toHaveBeenNthCalledWith(
      2,
      null,
      'Running script .....',
      true,
    );
    expect(handleWriteToCircuitUIResponse).toHaveBeenCalledWith(
      refs,
      'null-Running script .....-true',
      'query',
    );
    expect(setTerminalBusy).toHaveBeenCalledWith(true);
    expect(store.dispatch).toHaveBeenCalledWith(true);
  });

  afterEach(() => {
    TWS.data_obj.cursorPosition = 0;
    TWS.data_obj.data = '';
    updateData.mockRestore();
    updateCursorPosition.mockRestore();
    termWriteLn.mockRestore();
    constructOutputToWrite.mockRestore();
    handleWriteToCircuitUIResponse.mockRestore();
    setTerminalBusy.mockClear();
    store.dispatch.mockClear();
  });
});

describe('function handleWriteScriptQuery: ', () => {
  let updateData,
    updateCursorPosition,
    termWriteLn,
    constructOutputToWrite,
    handleWriteToCircuitUIResponse;

  beforeEach(() => {
    updateData = jest.spyOn(TWS, 'updateData').mockImplementation(() => {});
    updateCursorPosition = jest
      .spyOn(TWS, 'updateCursorPosition')
      .mockImplementation(() => {});
    termWriteLn = jest
      .spyOn(TWS, 'termWriteLn')
      .mockImplementation(() => new Promise(r => r()));
    constructOutputToWrite = jest
      .spyOn(TWS, 'constructOutputToWrite')
      .mockImplementation((a, b, c) => `${a}-${b}-${c}`);
    handleWriteToCircuitUIResponse = jest
      .spyOn(TWS, 'handleWriteToCircuitUIResponse')
      .mockImplementation(() => {});
  });

  it('expect function to call specific functions: ', async () => {
    const term = {};
    const refs = {};
    await TWS.handleWriteScriptQuery(term, refs);
    expect(updateData).toHaveBeenCalledWith(null);
    expect(updateCursorPosition).toHaveBeenCalledWith(0);

    expect(constructOutputToWrite).toHaveBeenNthCalledWith(1, null, null);
    expect(termWriteLn).toHaveBeenCalledWith(term, 'null-null-undefined');
    expect(constructOutputToWrite).toHaveBeenNthCalledWith(
      2,
      null,
      'Running script .....',
      true,
    );
    expect(handleWriteToCircuitUIResponse).toHaveBeenCalledWith(
      refs,
      'null-Running script .....-true',
      'query',
    );
    expect(setTerminalBusy).toHaveBeenCalledWith(true);
    expect(store.dispatch).toHaveBeenCalledWith(true);
  });

  afterEach(() => {
    TWS.data_obj.cursorPosition = 0;
    TWS.data_obj.data = '';
    updateData.mockRestore();
    updateCursorPosition.mockRestore();
    termWriteLn.mockRestore();
    constructOutputToWrite.mockRestore();
    handleWriteToCircuitUIResponse.mockRestore();
    setTerminalBusy.mockClear();
    store.dispatch.mockClear();
  });
});

describe('function handleWriteQuery: ', () => {
  let updateData,
    updateCursorPosition,
    termWriteLn,
    constructOutputToWrite,
    handleWriteToCircuitUIResponse;

  beforeEach(() => {
    updateData = jest.spyOn(TWS, 'updateData').mockImplementation(() => {});
    updateCursorPosition = jest
      .spyOn(TWS, 'updateCursorPosition')
      .mockImplementation(() => {});
    termWriteLn = jest
      .spyOn(TWS, 'termWriteLn')
      .mockImplementation(() => new Promise(r => r()));
    constructOutputToWrite = jest
      .spyOn(TWS, 'constructOutputToWrite')
      .mockImplementation((a, b, c) => `${a}-${b}-${c}`);
    handleWriteToCircuitUIResponse = jest
      .spyOn(TWS, 'handleWriteToCircuitUIResponse')
      .mockImplementation(() => {});
  });

  it('expect function to call specific functions: ', async () => {
    const term = {};
    const refs = {};
    const latest = { query: 'line1\nline2\nline3' };
    await TWS.handleWriteQuery(term, refs, latest);
    expect(updateData).toHaveBeenCalledWith(null);
    expect(updateCursorPosition).toHaveBeenCalledWith(0);

    latest.query.split('\n').forEach((line, index) => {
      if (index < 1) {
        expect(constructOutputToWrite).toHaveBeenNthCalledWith(
          index + 1,
          TV.joernDefaultPrompt,
          line,
        );
        expect(termWriteLn).toHaveBeenNthCalledWith(
          index + 1,
          term,
          `${TV.joernDefaultPrompt}-${line}-undefined`,
        );
      } else {
        expect(constructOutputToWrite).toHaveBeenNthCalledWith(
          index + 1,
          null,
          line,
        );
        expect(termWriteLn).toHaveBeenNthCalledWith(
          index + 1,
          term,
          `null-${line}-undefined`,
        );
      }
    });

    expect(constructOutputToWrite).toHaveBeenNthCalledWith(
      4,
      null,
      latest.query,
      true,
    );
    expect(handleWriteToCircuitUIResponse).toHaveBeenCalledWith(
      refs,
      `null-${latest.query}-true`,
      'query',
    );
    expect(setTerminalBusy).toHaveBeenCalledWith(true);
    expect(store.dispatch).toHaveBeenCalledWith(true);
  });

  afterEach(() => {
    TWS.data_obj.cursorPosition = 0;
    TWS.data_obj.data = '';
    updateData.mockRestore();
    updateCursorPosition.mockRestore();
    termWriteLn.mockRestore();
    constructOutputToWrite.mockRestore();
    handleWriteToCircuitUIResponse.mockRestore();
    setTerminalBusy.mockClear();
    store.dispatch.mockClear();
  });
});

describe('function initXTerm: ', () => {
  let termWrite;

  beforeEach(() => {
    termWrite = jest
      .spyOn(TWS, 'termWrite')
      .mockImplementation(() => new Promise(r => r()));
  });

  it('expect function to initialize Terminal, call certain functions and return the Terminal object', async () => {
    const shellprompt = TV.carriageReturn + TV.newLine + TV.joernDefaultPrompt;
    const prefersDarkMode = true;
    const term = await TWS.initXterm(prefersDarkMode);
    expect(term instanceof Terminal).toBe(true);
    expect(termWrite).toHaveBeenNthCalledWith(1, term, TV.joernWelcomeScreen);
    expect(termWrite).toHaveBeenNthCalledWith(2, term, shellprompt);
  });

  it('expect JSON.stringify(term.config) to be a particular string when prefersDarkMode is true: ', async () => {
    const prefersDarkMode = true;
    const config = {
      cursorBlink: true,
      theme: {
        background: '#000000',
        foreground: '#ffffff',
        cursorAccent: '#ffffff',
        cursor: '#ffffff',
      },
    };

    const term = await TWS.initXterm(prefersDarkMode);
    expect(JSON.stringify(term.config)).toBe(JSON.stringify(config));
  });

  it('expect JSON.stringify(term.config) to be a particular string when prefersDarkMode is false: ', async () => {
    const prefersDarkMode = false;
    const config = {
      cursorBlink: true,
      theme: {
        background: '#ffffff',
        foreground: '#000000',
        cursorAccent: '#000000',
        cursor: '#000000',
      },
    };

    const term = await TWS.initXterm(prefersDarkMode);
    expect(JSON.stringify(term.config)).toBe(JSON.stringify(config));
  });

  afterEach(() => {
    termWrite.mockRestore();
  });
});
