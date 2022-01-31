import { createHash } from 'crypto';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';

import { windowActionApi } from '../../assets/js/utils/ipcRenderer';
import { openFile } from '../../assets/js/utils/scripts';
import {
  terminalVariables as TV,
  printable,
} from '../../assets/js/utils/defaultVariables';

import {
  setHistory,
  setTerminalBusy,
  setQuerySuggestions,
} from '../../store/actions/terminalActions';
import { setHighlightRange } from '../../store/actions/editorActions';
import { enQueueQuery } from '../../store/actions/queryActions';
import { store } from '../../store/configureStore';

import * as TWS from './terminalWindowScripts';

export const data_obj = { data: '', cursorPosition: 0 };
export const response_toggler_obj = {
  responseId: {},
  toggleState: true,
};

export const updateData = str => {
  if (str) {
    TWS.data_obj.data = `${TWS.data_obj.data.slice(
      0,
      TWS.data_obj.cursorPosition,
    )}${str}${TWS.data_obj.data.slice(TWS.data_obj.cursorPosition)}`;
  } else {
    TWS.data_obj.data = '';
  }
};

export const updateCursorPosition = value => {
  TWS.data_obj.cursorPosition = value;
};

export const constructInputToWrite = () =>
  TV.clearLine +
  TV.cpgDefaultPrompt +
  TWS.data_obj.data +
  TV.carriageReturn +
  TV.cursorPositionFromStart
    .split('<n>')
    .join(TV.cpgDefaultPrompt.length + TWS.data_obj.cursorPosition);

export const constructOutputToWrite = (prompt, value, isCircuitUI) => {
  if (isCircuitUI) {
    return `<pre>${value}</pre>`;
  }

  return (
    TV.clearLine +
    (prompt !== null ? prompt : ' ') +
    (value !== null ? value : 'Running script .....')
  );
};

export const handleTerminalMaximizeToggle = bool => {
  return { isMaximized: !bool };
};

export const handleResize = fitAddon => {
  fitAddon && fitAddon.fit();
};

export const handleEmptyWorkspace = (workspace, prev_workspace) => {
  if (workspace && Object.keys(workspace.projects).length < 1) {
    return { isMaximized: true };
  } else if (
    workspace &&
    Object.keys(workspace.projects).length > 0 &&
    Object.keys(prev_workspace?.projects ? prev_workspace.projects : {})
      .length < 1
  ) {
    return { isMaximized: false };
  }

  return {};
};

export const setSuggestionBoxTrackerContent = el => {
  el.innerText = data_obj.data;
};

export const suggestSimilarQueries = () => {
  const { results } = store.getState().query;
  let query_strings = Object.keys(results);
  query_strings = query_strings.map(key => results[key].query);
  query_strings = query_strings.filter(query_string =>
    query_string && data_obj.data && query_string.startsWith(data_obj.data)
      ? true
      : false,
  );
  query_strings.reverse();
  query_strings = [...new Set(query_strings)]; //remove duplicates
  store.dispatch(setQuerySuggestions(query_strings));
};

export const handleSuggestionClick = async (e, refs, term) => {
  const str = e.target.innerText;
  TWS.updateData(null);
  TWS.updateCursorPosition(0);
  TWS.updateData(str);
  TWS.updateCursorPosition(TWS.data_obj.cursorPosition + str.length);
  await TWS.termWrite(term, TWS.constructInputToWrite());
  TWS.handleWriteToCircuitUIInput(refs);
  refs.circuitUIRef.current.children[1].children[0].focus();
};

export const openXTerm = (refs, term) => {
  if (term) {
    term.onKey(async e => {
      await TWS.handleXTermOnKey(term, refs, e);
      suggestSimilarQueries();
      await suggestQueryForXterm(term);
    });

    term.open(refs.terminalRef.current);
  }
};

export const suggestQueryForXterm = async term => {
  const { query_suggestions } = store.getState().terminal;
  await TWS.termWrite(term, TWS.constructInputToWrite());
  if (query_suggestions.length > 0) {
    let str_to_write = query_suggestions[0].split(data_obj.data)[1];
    str_to_write =
      TV.clearLine +
      TV.cpgDefaultPrompt +
      TWS.data_obj.data +
      TV.formatText
        .split('<n>')
        .join('38;2;169;169;169')
        .split('<o>')
        .join(str_to_write) +
      TV.carriageReturn +
      TV.cursorPositionFromStart
        .split('<n>')
        .join(TV.cpgDefaultPrompt.length + TWS.data_obj.cursorPosition);
    await TWS.termWrite(term, str_to_write);
  }
};

export const writeSuggestionToXterm = async (term, refs) => {
  const { query_suggestions } = store.getState().terminal;
  if (
    !(TWS.data_obj.cursorPosition < TWS.data_obj.data.length) &&
    query_suggestions.length > 0
  ) {
    const str = query_suggestions[0];
    TWS.updateData(null);
    TWS.updateCursorPosition(0);
    TWS.updateData(str);
    TWS.updateCursorPosition(TWS.data_obj.cursorPosition + str.length);
    await TWS.termWrite(term, TWS.constructInputToWrite());
    TWS.handleWriteToCircuitUIInput(refs);
  }
};

export const termWrite = (term, value) =>
  new Promise(r => term.write(value, r));

export const termWriteLn = (term, value) =>
  new Promise(r => term.writeln(value, r));

export const getNext = history => {
  let next = Object.keys(history.next_queries);
  next = next[next.length - 1];
  next = history.next_queries[next];
  return next ? next : '';
};

export const getPrev = history => {
  let prev = Object.keys(history.prev_queries);
  prev = prev[prev.length - 1];
  prev = history.prev_queries[prev];

  if (prev) {
    return prev;
  } else {
    return TWS.getNext(history);
  }
};

export const removeOldestQueryFromHistory = (history, prev_keys) => {
  delete history.prev_queries[prev_keys[0]];
  return history;
};

export const addQueryToHistory = (history, queue, key) => {
  while (Object.keys(history.next_queries).length > 0) {
    history = TWS.rotateNext(history);
  }

  history.prev_queries[key] = queue[key];
  return history;
};

export const rotateNext = ({ prev_queries, next_queries }) => {
  prev_queries = { ...prev_queries };
  next_queries = { ...next_queries };

  let next = Object.keys(next_queries);
  next = next[next.length - 1];

  if (next) {
    prev_queries[next] = next_queries[next];
    delete next_queries[next];
  }

  return { prev_queries, next_queries };
};

export const rotatePrev = ({ prev_queries, next_queries }) => {
  prev_queries = { ...prev_queries };
  next_queries = { ...next_queries };

  let prev = Object.keys(prev_queries);
  prev = prev[prev.length - 1];

  if (prev) {
    next_queries[prev] = prev_queries[prev];
    delete prev_queries[prev];
  }

  return { prev_queries, next_queries };
};

export const initFitAddon = term => {
  let fitAddon = null;
  if (term) {
    fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    fitAddon.fit();
    return fitAddon;
  } else {
    return fitAddon;
  }
};

export const handleCopyToClipBoard = str => {
  windowActionApi.copyToClipBoard(str);
};

export const handlePasteFromClipBoard = (term, refs) => {
  windowActionApi.pasteFromClipBoard();
  windowActionApi.registerPasteFromClipBoardListener(async str => {
    handlePrintable(term, refs, { key: str });
  });
};

export const handleEnter = async (term, refs) => {
  const query = {
    query: TWS.data_obj.data,
    origin: 'terminal',
    ignore: false,
  };
  store.dispatch(enQueueQuery(query));
  store.dispatch(setTerminalBusy(true));
  await TWS.termWrite(term, TWS.constructInputToWrite());
  await TWS.termWriteLn(term, '');
  TWS.handleWriteToCircuitUIResponse(refs, TWS.data_obj.data, 'query');
  TWS.updateData(null);
  TWS.updateCursorPosition(0);
  TWS.handleWriteToCircuitUIInput(refs);
};

export const handleBackspace = async (term, refs) => {
  const data = TWS.data_obj.data;
  const cursorPosition = TWS.data_obj.cursorPosition;
  TWS.updateData(null);
  TWS.updateCursorPosition(0);
  TWS.updateData(
    data.slice(0, cursorPosition > 0 ? cursorPosition - 1 : 0) +
      data.slice(cursorPosition),
  );
  TWS.updateCursorPosition(cursorPosition > 0 ? cursorPosition - 1 : 0);
  await TWS.termWrite(term, TWS.constructInputToWrite());
  TWS.handleWriteToCircuitUIInput(refs);
};

export const handleArrowUp = async (term, refs, history, ev) => {
  ev.preventDefault();
  let prev_query = TWS.getPrev(history);
  let new_history = TWS.rotatePrev({ ...history });
  TWS.updateData(null);
  TWS.updateCursorPosition(0);
  TWS.updateData(prev_query.query ? prev_query.query : null);
  TWS.updateCursorPosition(
    prev_query.query
      ? TWS.data_obj.cursorPosition + prev_query.query.length
      : 0,
  );
  refs.circuitUIRef.current.children[1].children[0].value = TWS.data_obj.data;
  await TWS.termWrite(term, TWS.constructInputToWrite());
  TWS.handleWriteToCircuitUIInput(refs);
  store.dispatch(setHistory(new_history));
};

export const handleArrowDown = async (term, refs, history, ev) => {
  ev.preventDefault();
  let next_query = TWS.getNext(history);
  let new_history = TWS.rotateNext({ ...history });
  TWS.updateData(null);
  TWS.updateCursorPosition(0);
  TWS.updateData(next_query.query ? next_query.query : null);
  TWS.updateCursorPosition(
    next_query.query
      ? TWS.data_obj.cursorPosition + next_query.query.length
      : 0,
  );
  refs.circuitUIRef.current.children[1].children[0].value = TWS.data_obj.data;
  await TWS.termWrite(term, TWS.constructInputToWrite());
  TWS.handleWriteToCircuitUIInput(refs);
  store.dispatch(setHistory(new_history));
};

export const handleArrowLeft = async (term, refs) => {
  TWS.updateCursorPosition(
    TWS.data_obj.cursorPosition > 0 ? TWS.data_obj.cursorPosition - 1 : 0,
  );
  await TWS.termWrite(term, TWS.constructInputToWrite());
  TWS.handleWriteToCircuitUIInput(refs);
};

export const handleArrowRight = async (term, refs) => {
  await writeSuggestionToXterm(term, refs);
  TWS.updateCursorPosition(
    TWS.data_obj.cursorPosition < TWS.data_obj.data.length
      ? TWS.data_obj.cursorPosition + 1
      : TWS.data_obj.data.length,
  );
  await TWS.termWrite(term, TWS.constructInputToWrite());
  TWS.handleWriteToCircuitUIInput(refs);
};

export const handlePrintable = async (term, refs, e) => {
  TWS.updateData(e.key);
  TWS.updateCursorPosition(TWS.data_obj.cursorPosition + e.key.length);
  await TWS.termWrite(term, TWS.constructInputToWrite());
  TWS.handleWriteToCircuitUIInput(refs);
};

export const handleWriteQueryResult = async (term, refs, latest) => {
  TWS.updateData(null);
  TWS.updateCursorPosition(0);

  const res_type = latest.result.stdout
    ? 'stdout'
    : latest.result.stderr
    ? 'stderr'
    : null;
  const lines = res_type ? latest.result[res_type].split('\n') : [];

  for (let i = 0; i < lines.length; i++) {
    await TWS.termWriteLn(term, TWS.constructOutputToWrite(null, lines[i]));
  }

  TWS.handleWriteToCircuitUIResponse(refs, lines.join('\n'), res_type);

  await term.prompt();
  store.dispatch(setTerminalBusy(false));
  return true;
};

export const handleWriteScriptQuery = async (term, refs, latest) => {
  const { busy } = store.getState().terminal;

  TWS.updateData(null);
  TWS.updateCursorPosition(0);

  await TWS.termWriteLn(
    term,
    TWS.constructOutputToWrite(TV.cpgDefaultPrompt, latest.query),
  );
  TWS.handleWriteToCircuitUIResponse(refs, latest.query, 'query');

  !busy && (await term.prompt());
};

export const handleWriteQuery = async (term, refs, latest) => {
  TWS.updateData(null);
  TWS.updateCursorPosition(0);

  const lines = latest.query.split('\n');

  for (let i = 0; i < lines.length; i++) {
    if (i < 1) {
      await TWS.termWriteLn(
        term,
        TWS.constructOutputToWrite(TV.cpgDefaultPrompt, lines[i]),
      );
    } else {
      await TWS.termWriteLn(term, TWS.constructOutputToWrite(null, lines[i]));
    }
  }

  TWS.handleWriteToCircuitUIResponse(refs, lines.join('\n'), 'query');

  store.dispatch(setTerminalBusy(true));
};

export const initXterm = async prefersDarkMode => {
  const term = new Terminal({
    cursorBlink: true,
    theme: {
      background: prefersDarkMode ? '#000000' : '#ffffff',
      foreground: prefersDarkMode ? '#ffffff' : '#000000',
      cursorAccent: prefersDarkMode ? '#ffffff' : '#000000',
      cursor: prefersDarkMode ? '#ffffff' : '#000000',
    },
  });

  let shellprompt = TV.carriageReturn + TV.newLine + TV.cpgDefaultPrompt;

  term.prompt = async () => {
    await TWS.termWrite(term, shellprompt);
  };

  await TWS.termWrite(term, TV.cpgWelcomeScreen);
  await term.prompt();

  return term;
};

export const initCircuitUI = refs => {
  const el = refs.circuitUIRef.current;

  el.children[1].children[0].addEventListener(
    'keydown',
    async function handleInitCircuitUIInputKeyDown(e) {
      const { term } = store.getState().terminal;
      await handleXTermOnKey(term, refs, { domEvent: e });
      setSuggestionBoxTrackerContent(
        el.children[1].querySelector('#suggestion-box-tracker'),
      );
      suggestSimilarQueries();
    },
    false,
  );

  el.children[1].children[1].addEventListener(
    'click',
    async function handleInitCircuitUIButtonClick(e) {
      const { term, busy } = store.getState().terminal;
      if (!busy) {
        await handleEnter(term, refs);
        setSuggestionBoxTrackerContent(
          el.children[1].querySelector('#suggestion-box-tracker'),
        );
        suggestSimilarQueries();
      }
    },
    false,
  );

  return () => {
    el.children[1].children[0].removeEventListener(
      'keydown',
      handleInitCircuitUIInputKeyDown,
    );
    el.children[1].children[1].removeEventListener(
      'click',
      handleInitCircuitUIButtonClick,
    );
  };
};

export const parseCircuitUIResponseValue = value => {
  try {
    const listContentSeperator = createHash('sha256')
      .update(String(Date.now() + Math.random() * 1000))
      .digest('hex');
    const objValueSeperator = createHash('sha256')
      .update(String(Date.now() + Math.random() * 1000))
      .digest('hex');

    const keysArr = [
      'id',
      'astParentFullName',
      'astParentType',
      'code',
      'columnNumber',
      'columnNumberEnd',
      'filename',
      'fullName',
      'hash',
      'isExternal',
      'lineNumber',
      'lineNumberEnd',
      'name',
      'order',
      'signature',
    ];

    let res = value.split('List[Method] = List(')[1];
    res = res.replaceAll(/"?\)\)/gi, ''); // replace '"))' or '))'
    res = res.replaceAll(/"?\)?,? ?Method\( = /gi, listContentSeperator); // replace '"), Method( = '  or '), Method( = '  or 'Method( = '
    res = res.replaceAll(/"?,  = "?/gi, objValueSeperator); // replace '",  = "' or ',  = "' or '",  = ' or ',  = '

    res = res.split(listContentSeperator).filter(str => !!str && str !== '\n ');

    res = res.map(str => {
      //this creates a nested loop. Any better way to do this?
      str = str.split(objValueSeperator);
      if (str.length !== 15) throw 'error';
      const methodObj = {};
      str.forEach((value, index) => {
        methodObj[keysArr[index]] = value;
      });
      return methodObj;
    });

    return res;
  } catch (e) {
    return value;
  }
};

export const openFileAndGoToLineFromCircuitUI = async ({
  filename,
  lineNumber: startLine,
  lineNumberEnd: endLine,
}) => {
  if (
    filename &&
    filename !== '<empty>' &&
    filename.split('<').length === 1 &&
    startLine &&
    endLine
  ) {
    startLine = Number(startLine.replace('Some(value = ', '').replace(')', ''));
    endLine = Number(endLine.replace('Some(value = ', '').replace(')', ''));
    await openFile(filename);
    store.dispatch(setHighlightRange({ startLine, endLine }));
  }
};

export const handleToggleAllResponse = refs => {
  let isAllOpen = Object.keys(TWS.response_toggler_obj.responseId).every(
    key => TWS.response_toggler_obj.responseId[key],
  );
  let isAllClose = Object.keys(TWS.response_toggler_obj.responseId).every(
    key => !TWS.response_toggler_obj.responseId[key],
  );
  const newResponseId = {};
  for (let key in TWS.response_toggler_obj.responseId) {
    newResponseId[key] = isAllClose
      ? true
      : isAllOpen
      ? false
      : !TWS.response_toggler_obj.toggleState;
  }
  TWS.response_toggler_obj.toggleState = !TWS.response_toggler_obj.toggleState;
  TWS.response_toggler_obj.responseId = newResponseId;
  let query =
    refs.circuitUIRef.current.children[0].ownerDocument.getElementsByClassName(
      'query',
    );
  let response =
    refs.circuitUIRef.current.children[0].ownerDocument.getElementsByClassName(
      'response',
    );
  for (let i = 0; i < query.length; i++) {
    let id = query[i].getAttribute('key');
    if (TWS.response_toggler_obj.responseId[id]) {
      query[i].classList.add('dropdown');
      response[i].classList.add('dropdown');
    } else {
      query[i].classList.remove('dropdown');
      response[i].classList.remove('dropdown');
    }
  }
};

export const handleToggleOneResponse = (key, refs) => {
  TWS.response_toggler_obj.responseId = {
    ...TWS.response_toggler_obj.responseId,
    [String(key)]: !TWS.response_toggler_obj.responseId[key],
  };
  let query =
    refs.circuitUIRef.current.children[0].ownerDocument.getElementsByClassName(
      'query',
    );
  let response =
    refs.circuitUIRef.current.children[0].ownerDocument.getElementsByClassName(
      'response',
    );
  for (let i = 0; i < query.length; i++) {
    let id = query[i].getAttribute('key');
    if (String(id) === String(key)) {
      if (TWS.response_toggler_obj.responseId[key]) {
        query[i].classList.add('dropdown');
        response[i].classList.add('dropdown');
      } else {
        query[i].classList.remove('dropdown');
        response[i].classList.remove('dropdown');
      }
    }
  }
};

export const handleToggleAllSubResponse = (sub_response_toggler_obj, refs) => {
  let isAllOpen = Object.keys(sub_response_toggler_obj.responseId).every(
    key => sub_response_toggler_obj.responseId[key],
  );
  let isAllClose = Object.keys(sub_response_toggler_obj.responseId).every(
    key => !sub_response_toggler_obj.responseId[key],
  );
  const newResponseId = {};
  for (let key in sub_response_toggler_obj.responseId) {
    newResponseId[key] = isAllClose
      ? true
      : isAllOpen
      ? false
      : !sub_response_toggler_obj.toggleState;
  }
  sub_response_toggler_obj.toggleState = !sub_response_toggler_obj.toggleState;
  sub_response_toggler_obj.responseId = newResponseId;
  let ObjectContainer =
    refs.circuitUIRef.current.children[0].ownerDocument.getElementsByClassName(
      'object-container',
    );

  for (let el of ObjectContainer) {
    let id = el.getAttribute('key');
    if (sub_response_toggler_obj.responseId[id]) {
      el.classList.add('dropdown');
    } else {
      el.classList.remove('dropdown');
    }
  }
};

export const handleToggleOneSubResponse = (
  key,
  sub_response_toggler_obj,
  refs,
) => {
  sub_response_toggler_obj.responseId = {
    ...sub_response_toggler_obj.responseId,
    [String(key)]: !sub_response_toggler_obj.responseId[key],
  };
  let ObjectContainer =
    refs.circuitUIRef.current.children[0].ownerDocument.getElementsByClassName(
      'object-container',
    );
  for (let el of ObjectContainer) {
    let id = el.getAttribute('key');
    if (id === key) {
      if (sub_response_toggler_obj.responseId[key]) {
        el.classList.add('dropdown');
      } else {
        el.classList.remove('dropdown');
      }
    }
  }
};

export const handleWriteToCircuitUIResponse = (refs, value, res_type) => {
  let key = Date.now();
  const circuitUIResEl =
    refs.circuitUIRef.current.children[0].ownerDocument.getElementById(
      'circuit-ui-results',
    );
  const containerDiv = circuitUIResEl.ownerDocument.createElement('div');
  let responseTogglerIcon = circuitUIResEl.ownerDocument.createElement('img');
  responseTogglerIcon.classList.add('toggle-icon-hide');
  responseTogglerIcon.setAttribute(
    'src',
    'src/assets/image/icon-chevron-down.svg',
  );

  if (res_type === 'query') {
    TWS.response_toggler_obj.responseId[key] = false;
    containerDiv.setAttribute('key', key);
    containerDiv.classList.add('query');
    value = TWS.constructOutputToWrite(null, value, true);
    containerDiv.append(responseTogglerIcon);
  } else {
    let toggleIcons =
      circuitUIResEl.ownerDocument.getElementsByClassName('toggle-icon-hide');
    for (let el of toggleIcons) {
      el.classList.replace('toggle-icon-hide', 'toggle-icon-show');
    }
    containerDiv.classList.add('response');

    let parsedResponse = parseCircuitUIResponseValue(value);
    if (parsedResponse === value) {
      parsedResponse = TWS.constructOutputToWrite(null, parsedResponse, true);
    }
    value = parsedResponse;
  }

  responseTogglerIcon.onclick = () =>
    TWS.handleToggleOneResponse(containerDiv.getAttribute('key'), refs);
  let p, valueContainer, valueWrapper;

  if (typeof value === 'string') {
    p = circuitUIResEl.ownerDocument.createElement('p');
    p.classList.add('content');
    p.innerHTML = value;
    containerDiv.append(p);
  } else {
    const sub_response_toggler_obj = {
      responseId: {},
      toggleState: true,
    };
    for (let v of value) {
      sub_response_toggler_obj.responseId[v.id] = false;
    }
    valueWrapper = circuitUIResEl.ownerDocument.createElement('div');
    valueWrapper.classList.add('value-wrapper');
    valueContainer = circuitUIResEl.ownerDocument.createElement('div');
    valueContainer.classList.add('value-container');
    value.forEach(obj => {
      let objContainer = document.createElement('div');
      objContainer.classList.add('object-container');
      objContainer.setAttribute('key', obj.id);
      let objTitle = document.createElement('span');
      objTitle.innerHTML = `${obj.fullName}()`;
      objTitle.classList.add('object-title');
      objTitle.onclick = () => openFileAndGoToLineFromCircuitUI(obj);

      let subResponseTogglerIcon =
        circuitUIResEl.ownerDocument.createElement('img');
      subResponseTogglerIcon.classList.add('toggle-icon');
      subResponseTogglerIcon.setAttribute(
        'src',
        'src/assets/image/icon-chevron-down.svg',
      );
      subResponseTogglerIcon.onclick = () =>
        TWS.handleToggleOneSubResponse(obj.id, sub_response_toggler_obj, refs);
      objContainer.append(objTitle, subResponseTogglerIcon);

      Object.keys(obj).forEach(prop => {
        let objEntryContainer = document.createElement('div');
        objEntryContainer.classList.add('object-entry-container');
        let objKey = document.createElement('span');
        objKey.classList.add('object-key');
        let objValue = document.createElement('span');
        objKey.innerText = prop;
        objValue.innerText = obj[prop];
        objEntryContainer.append(objKey, objValue);
        objContainer.append(objEntryContainer);
      });
      valueContainer.appendChild(objContainer);
    });

    let sideToggleBar = circuitUIResEl.ownerDocument.createElement('div');
    sideToggleBar.classList.add('toggle-bar');
    sideToggleBar.onclick = () =>
      TWS.handleToggleAllSubResponse(sub_response_toggler_obj, refs);

    valueWrapper.append(sideToggleBar, valueContainer);
    containerDiv.append(valueWrapper);
  }

  if (res_type === 'stderr') {
    const errEl = circuitUIResEl.ownerDocument.createElement('span');
    errEl.classList.add('error');
    errEl.innerText = 'ERROR';
    p.prepend(errEl);
  }

  circuitUIResEl.append(containerDiv);
  circuitUIResEl.scrollTop = circuitUIResEl.scrollHeight;
};

export const handleWriteToCircuitUIInput = refs => {
  const input = refs.circuitUIRef.current.children[1].children[0];
  input.value = TWS.data_obj.data;
  input.setSelectionRange(
    TWS.data_obj.cursorPosition,
    TWS.data_obj.cursorPosition,
  );
  suggestSimilarQueries();
};

export const handleMaximize = (window, props) => {
  if (props.terminal.isMaximized) {
    return {
      terminalHeight: `${
        window.screen.height -
        (Number(props.topNavHeight.split('px')[0]) +
          Number(props.statusBarHeight.split('px')[0]) +
          52)
      }px`,
    };
  } else {
    return { terminalHeight: '468px' };
  }
};

export const resizeHandler = (terminalHeight, diff, props, window) => {
  if (Number(terminalHeight.split('px')[0]) < 218 && diff < 0) {
    return { terminalHeight: 0 };
  } else if (Number(terminalHeight.split('px')[0]) < 218 && diff > 0) {
    return { terminalHeight: '468px' };
  } else if (
    Number(props.topNavHeight.split('px')[0]) +
      Number(props.statusBarHeight.split('px')[0]) +
      Number(terminalHeight.split('px')[0]) +
      50 <
    window.screen.height
  ) {
    return { terminalHeight };
  }
};

export const handleAddQueryToHistory = queue => {
  let { history } = store.getState().terminal;
  history = {
    prev_queries: { ...history.prev_queries },
    next_queries: { ...history.next_queries },
  };
  let key = Object.keys(queue);
  key = key[key.length - 1];

  if (
    !queue[key].ignore &&
    !history.prev_queries[key] &&
    !history.next_queries[key]
  ) {
    history = addQueryToHistory(history, queue, key);

    let prev_keys = Object.keys(history.prev_queries);

    if (prev_keys.length >= 500) {
      history = removeOldestQueryFromHistory(history, prev_keys);
    }

    store.dispatch(setHistory(history));
  }
};

export const handleXTermOnKey = async (term, refs, e) => {
  const ev = e.domEvent;
  const not_combination_keys = !ev.altKey && !ev.ctrlKey && !ev.metaKey;
  const { history, busy } = store.getState().terminal;

  if (ev.code === 'KeyC' && ev.ctrlKey) {
    handleCopyToClipBoard(term.getSelection());
  }

  if (ev.code === 'KeyV' && ev.ctrlKey && !busy) {
    handlePasteFromClipBoard(term, refs);
  }

  if (busy) return;

  if (ev.code === 'Enter') {
    await handleEnter(term, refs);
  } else if (ev.code === 'Backspace') {
    await handleBackspace(term, refs);
  } else if (ev.code === 'ArrowUp') {
    await handleArrowUp(term, refs, history, ev);
  } else if (ev.code === 'ArrowDown') {
    await handleArrowDown(term, refs, history, ev);
  } else if (ev.code === 'ArrowLeft') {
    await handleArrowLeft(term, refs);
  } else if (ev.code === 'ArrowRight') {
    await handleArrowRight(term, refs);
  } else if (not_combination_keys && printable[ev.key]) {
    await handlePrintable(term, refs, ev);
  }
};

export const sendQueryResultToXTerm = async (results, refs) => {
  const { term } = store.getState().terminal;

  const latest = results[Object.keys(results)[Object.keys(results).length - 1]];

  if (
    term &&
    (latest?.result.stdout || latest?.result.stderr) &&
    !latest?.ignore &&
    latest.post_query_uuid &&
    (latest.workspace || latest.project)
  ) {
    return await handleWriteQueryResult(term, refs, latest);
  } else if (
    term &&
    !latest?.ignore &&
    latest?.query &&
    !(latest?.result?.stdout && latest?.result?.stderr)
  ) {
    if (latest.origin === 'script') {
      await handleWriteScriptQuery(term, refs, latest);
    } else if (latest.origin !== 'terminal') {
      await handleWriteQuery(term, refs, latest);
    }
  }
};
