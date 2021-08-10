import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { enQueueQuery } from '../../store/actions/queryActions';
import { windowActionApi } from '../../assets/js/utils/ipcRenderer';
import { printable } from '../../assets/js/utils/defaultVariables';
import {
  setHistory,
  setTerminalBusy,
} from '../../store/actions/terminalActions';
import { store } from '../../store/configureStore';

import { terminalVariables as TV } from '../../assets/js/utils/defaultVariables';

const data_obj = { data: '', cursorPosition: 0 };

const updateData = str => {
  if (str) {
    data_obj.data = `${data_obj.data.slice(
      0,
      data_obj.cursorPosition,
    )}${str}${data_obj.data.slice(data_obj.cursorPosition)}`;
  } else {
    data_obj.data = '';
  }
};

const updateCursorPosition = value => {
  data_obj.cursorPosition = value;
};

export const constructInputToWrite = () =>
  TV.clearLine +
  TV.joernDefaultPrompt +
  data_obj.data +
  TV.carriageReturn +
  TV.cursorPositionFromStart
    .split('<n>')
    .join(TV.joernDefaultPrompt.length + data_obj.cursorPosition);

export const constructOutputToWrite = (prompt, value, isCircuitUI) =>{
  if(isCircuitUI){
    return `<pre>${value}</pre>`;
  };

  return TV.clearLine +
  (prompt !== null ? prompt : ' ') +
  (value !== null ? value : 'Running script .....');
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

export const openXTerm = (refs, term) => {
  if (term) {
    term.onKey(async e => {
      await handleXTermOnKey(term, refs, e);
    });

    term.open(refs.terminalRef.current);
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
    return getNext(history);
  }
};

export const removeOldestQueryFromHistory = (history, prev_keys) => {
  delete history.prev_queries[prev_keys[0]];
  return history;
};

export const addQueryToHistory = (history, queue, key) => {
  while (Object.keys(history.next_queries).length > 0) {
    history = rotateNext(history);
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
    updateData(str);
    updateCursorPosition(data_obj.cursorPosition + str.length);
    await termWrite(term, constructInputToWrite());
    handleWriteToCircuitUIInput(refs);
  });
};

export const handleEnter = async (term, refs) => {
  const query = {
    query: data_obj.data,
    origin: 'terminal',
    ignore: false,
  };
  store.dispatch(enQueueQuery(query));
  store.dispatch(setTerminalBusy(true));
  await termWriteLn(term, '');
  handleWriteToCircuitUIResponse(refs, constructOutputToWrite(null, data_obj.data, true), "query");
  updateData(null);
  updateCursorPosition(0);
  handleWriteToCircuitUIInput(refs);
};

export const handleBackspace = async (term, refs) => {
  const data = data_obj.data;
  const cursorPosition = data_obj.cursorPosition;
  updateData(null);
  updateCursorPosition(0);
  updateData(
    data.slice(0, cursorPosition > 0 ? cursorPosition - 1 : 0) +
      data.slice(cursorPosition),
  );
  updateCursorPosition(cursorPosition > 0 ? cursorPosition - 1 : 0);
  await termWrite(term, constructInputToWrite());
  handleWriteToCircuitUIInput(refs);
};

export const handleArrowUp = async (term, refs, history, ev) => {
  ev.preventDefault();
  let prev_query = getPrev(history);
  let new_history = rotatePrev({ ...history });
  updateData(null);
  updateCursorPosition(0);
  updateData(prev_query.query ? prev_query.query : null);
  updateCursorPosition(
    prev_query.query ? data_obj.cursorPosition + prev_query.query.length : 0,
  );
  await termWrite(term, constructInputToWrite());
  handleWriteToCircuitUIInput(refs);
  store.dispatch(setHistory(new_history));
};

export const handleArrowDown = async (term, refs, history, ev) => {
  ev.preventDefault();
  let next_query = getNext(history);
  let new_history = rotateNext({ ...history });
  updateData(null);
  updateCursorPosition(0);
  updateData(next_query.query ? next_query.query : null);
  updateCursorPosition(
    next_query.query ? data_obj.cursorPosition + next_query.query.length : 0,
  );
  refs.circuitUIRef.current.children[1].children[0].value = data_obj.data;
  await termWrite(term, constructInputToWrite());
  handleWriteToCircuitUIInput(refs);
  store.dispatch(setHistory(new_history));
};

export const handleArrowLeft = async (term, refs) => {
  updateCursorPosition(
    data_obj.cursorPosition > 0 ? data_obj.cursorPosition - 1 : 0,
  );
  await termWrite(term, constructInputToWrite());
  handleWriteToCircuitUIInput(refs);
};

export const handleArrowRight = async (term, refs) => {
  updateCursorPosition(
    data_obj.cursorPosition < data_obj.data.length
      ? data_obj.cursorPosition + 1
      : data_obj.data.length,
  );
  await termWrite(term, constructInputToWrite());
  handleWriteToCircuitUIInput(refs);
};

export const handlePrintable = async (term, refs, e) => {
  updateData(e.key);
  updateCursorPosition(data_obj.cursorPosition + e.key.length);
  await termWrite(term, constructInputToWrite());
  handleWriteToCircuitUIInput(refs);
};

export const handleWriteQueryResult = async (term, refs, latest) => {
  updateData(null);
  updateCursorPosition(0);

  const res_type = latest.result.stdout
    ? 'stdout'
    : latest.result.stderr
    ? 'stderr'
    : null;
  const lines = res_type ? latest.result[res_type].split('\n') : [];

  for (let i = 0; i < lines.length; i++) {
    await termWriteLn(term, constructOutputToWrite(null, lines[i]));
  };

  handleWriteToCircuitUIResponse(refs, constructOutputToWrite(null, lines.join("\n"), true), res_type);


  await term.prompt();
  store.dispatch(setTerminalBusy(false));
  return true;
};

export const handleWriteScriptQuery = async (term, refs) => {
  updateData(null);
  updateCursorPosition(0);

  await termWriteLn(term, constructOutputToWrite(null, null));
  handleWriteToCircuitUIResponse(refs, constructOutputToWrite(null, "Running script .....", true), "query");
  store.dispatch(setTerminalBusy(true));
};

export const handleWriteQuery = async (term, refs, latest) => {
  updateData(null);
  updateCursorPosition(0);

  const lines = latest.query.split('\n');

  for (let i = 0; i < lines.length; i++) {
    if (i < 1) {
      await termWriteLn(
        term,
        constructOutputToWrite(TV.joernDefaultPrompt, lines[i]),
      );
    } else {
      await termWriteLn(term, constructOutputToWrite(null, lines[i]));
    }
  }

  handleWriteToCircuitUIResponse(refs, constructOutputToWrite(null, lines.join("\n"), true), "query");

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

  let shellprompt = TV.carriageReturn + TV.newLine + TV.joernDefaultPrompt;

  term.prompt = async () => {
    await termWrite(term, shellprompt);
  };

  await termWrite(term, TV.joernWelcomeScreen);
  await term.prompt();

  return term;
};

export const initCircuitUI=refs=>{
  const el = refs.circuitUIRef.current;

  el.children[1].children[0].addEventListener("keydown", async function handleInitCircuitUIInputKeyDown(e){
   const { term } = store.getState().terminal;
   await handleXTermOnKey(term, refs, {domEvent: e});
  }, false);

  el.children[1].children[1].addEventListener("click", async function handleInitCircuitUIButtonClick(e){
    const { term, busy } = store.getState().terminal;
    if(!busy){
      await handleEnter(term, refs);
    }
  }, false);

  return ()=>{
    el.children[1].children[0].removeEventListener("keydown", handleInitCircuitUIInputKeyDown);
    el.children[1].children[1].removeEventListener("click", handleInitCircuitUIButtonClick);
  }
};

export const handleWriteToCircuitUIResponse=(refs, value, res_type)=>{
  const circuitUIResEl = refs.circuitUIRef.current.children[0];
  const containerDiv = circuitUIResEl.ownerDocument.createElement('div');
  if(res_type === "query"){
  containerDiv.classList.add('query');
  }else{
   containerDiv.classList.add('response');
  };

  const p = circuitUIResEl.ownerDocument.createElement('p');
  p.innerHTML = value;
  
  if(res_type === "stderr"){
    const errEl = circuitUIResEl.ownerDocument.createElement('span');
    errEl.classList.add("error");
    errEl.innerText = "ERROR";
    p.prepend(errEl);
  };

  containerDiv.append(p);
  circuitUIResEl.append(containerDiv);
  circuitUIResEl.scrollTop = circuitUIResEl.scrollHeight;
};

export const handleWriteToCircuitUIInput=(refs)=>{
    const input = refs.circuitUIRef.current.children[1].children[0];
    input.value = data_obj.data;
    input.setSelectionRange(data_obj.cursorPosition, data_obj.cursorPosition);
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

export const handleXTermOnKey = async (term, refs,  e) => {
  const ev = e.domEvent;
  const not_combination_keys = !ev.altKey && !ev.ctrlKey && !ev.metaKey;
  const { history, busy } = store.getState().terminal;

  if (ev.code === 'KeyC' && ev.ctrlKey) {
    handleCopyToClipBoard(term.getSelection());
  }

  if (ev.code === 'KeyV' && ev.ctrlKey && !busy) {
    handlePasteFromClipBoard(term);
  }

  if (busy) return;

  if (ev.code === 'Enter') {
    await handleEnter(term, refs);
  } else if (ev.code === 'Backspace') {
    await handleBackspace(term, refs);
  } else if (ev.code === 'ArrowUp') {
    await handleArrowUp(term, refs,  history, ev);
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
    !latest?.ignore
  ) {
    return await handleWriteQueryResult(term, refs, latest);
  } else if (
    term &&
    !latest?.ignore &&
    latest?.query &&
    !(latest?.result?.stdout && latest?.result?.stderr)
  ) {
    if (latest.origin === 'script') {
      await handleWriteScriptQuery(term, refs);
    } else if (latest.origin !== 'terminal') {
      await handleWriteQuery(term, refs, latest);
    }
  }
};
