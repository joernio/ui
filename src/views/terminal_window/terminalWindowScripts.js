import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { enQueueQuery } from '../../store/actions/queryActions';
import { windowActionApi } from '../../assets/js/utils/ipcRenderer';
import { printable } from '../../assets/js/utils/defaultVariables';
import {
  setHistory,
  setTerminalBusy,
  setQuerySuggestions,
  setSuggestionDialogOpen,
} from '../../store/actions/terminalActions';
import { store } from '../../store/configureStore';

import { terminalVariables as TV } from '../../assets/js/utils/defaultVariables';

import * as TWS from './terminalWindowScripts';
import querydb from '../../assets/js/utils/queries';

export const data_obj = { data: '', cursorPosition: 0 };

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

export const setSuggestionsPopoverMarginLeftTrackerContent = el => {
  el.innerText = data_obj.data;
};

export const suggestSimilarQueries = () => {
  let suggestions = getQuerySuggestionFromHistory();
  suggestions = [...suggestions, ...getQuerySuggestionFromQueryDatabase()];
  store.dispatch(setQuerySuggestions(suggestions));
};

export const getQuerySuggestionFromHistory = () => {
  const { results } = store.getState().query;
  let suggestions = Object.keys(results);
  suggestions = suggestions.map(key => results[key].query);
  suggestions = suggestions.filter(query =>
    query && data_obj.data && query.startsWith(data_obj.data) ? true : false,
  );
  suggestions.reverse();
  suggestions = [...new Set(suggestions)]; //remove duplicates
  suggestions = suggestions.map(suggestion => ({
    suggestion,
    origin: 'history',
  }));
  return suggestions;
};

export const getQuerySuggestionFromQueryDatabase = () => {
  let query = data_obj.data.replace(/\((.+?)\)/g, '("")');
  query = query.split('.');
  let suggestions = querydb;

  for (let str of query) {
    let child = suggestions[str];
    if (!child) {
      child = Object.keys(suggestions);
      suggestions = child.filter(query => query.startsWith(str));
      suggestions = suggestions.map(each => each.replace(str, ''));
      break;
    } else {
      suggestions = child;
    }
  }

  if (suggestions === true) return [];

  if (
    typeof suggestions === 'object' &&
    !Array.isArray(suggestions) &&
    suggestions !== null
  ) {
    suggestions = Object.keys(suggestions).map(suggestion => `.${suggestion}`);
  }

  suggestions = suggestions.map(suggestion => `${data_obj.data}${suggestion}`);

  suggestions = suggestions.map(suggestion => ({
    suggestion,
    origin: 'database',
  }));
  return suggestions;
};

export const handleSuggestionClick = async (e, refs, term) => {
  let str;
  if (e.target.nodeName.toLowerCase() === 'div') {
    str = e.target.innerText;
  } else if (e.target.nodeName.toLowerCase() === 'span') {
    str = e.target.parentElement.innerText;
  } else if (e.target.nodeName.toLowerCase() === 'svg') {
    str = e.target.parentElement.parentElement.innerText;
  } else if (e.target.nodeName.toLowerCase() === 'path') {
    str = e.target.parentElement.parentElement.parentElement.innerText;
  }

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

export const calculateSuggestionsPopoverMarginLeft = ({
  suggestionsPopoverMarginLeftTrackerEl,
}) => {
  if (suggestionsPopoverMarginLeftTrackerEl.current) {
    const document =
      suggestionsPopoverMarginLeftTrackerEl.current.ownerDocument;
    let offset_width =
      suggestionsPopoverMarginLeftTrackerEl.current.offsetWidth;
    const container_width = document
      .getElementById('circuit-ui-input-container')
      .getBoundingClientRect().width;
    const target_element = document.querySelector(
      '.query-suggestion-popover-portal .bp3-popover2-transition-container',
    );

    if (target_element) {
      const target_element_dimensions = target_element.getBoundingClientRect();
      if (target_element_dimensions.width + offset_width < container_width) {
        target_element.style.marginLeft = `${offset_width}px`;
      } else if (
        target_element_dimensions.width + offset_width >=
        container_width
      ) {
        offset_width = container_width - target_element_dimensions.width;
        target_element.style.marginLeft = `${offset_width}px`;
      } else if (
        target_element.style.marginLeft &&
        offset_width < Number(target_element.style.marginLeft.split('px')[0])
      ) {
        target_element.style.marginLeft = `${offset_width}px`;
      }
    }
  }
};

export const focusPrevOrNextSuggestion = (e, refs) => {
  const children = refs.suggestionsContainerEl.current.children;
  const activeElement =
    refs.suggestionsContainerEl.current.ownerDocument.activeElement;

  for (let i = 0; i < children.length; i++) {
    if (children[i].classList.contains('query-suggestion-selected')) {
      children[i].classList.remove('query-suggestion-selected');

      if (e.code === 'ArrowUp' && i === 0) {
        children[children.length - 1].classList.add(
          'query-suggestion-selected',
        );
        children[children.length - 1].focus();
      } else if (e.code === 'ArrowUp' && i !== 0) {
        children[i - 1].classList.add('query-suggestion-selected');
        children[i - 1].focus();
      } else if (e.code === 'ArrowDown' && i === children.length - 1) {
        children[0].classList.add('query-suggestion-selected');
        children[0].focus();
      } else if (e.code === 'ArrowDown' && i !== children.length - 1) {
        children[i + 1].classList.add('query-suggestion-selected');
        children[i + 1].focus();
      }

      break;
    } else if (i === children.length - 1) {
      children[0].classList.add('query-suggestion-selected');
      children[0].focus();
    }
  }

  activeElement.focus();
};

export const selectSuggestionInFocus = refs => {
  const { term } = store.getState().terminal;
  const children = refs.suggestionsContainerEl.current.children;

  for (let i = 0; i < children.length; i++) {
    if (children[i].classList.contains('query-suggestion-selected')) {
      handleSuggestionClick({ target: children[i] }, refs, term);
      break;
    } else if (i === children.length - 1) {
      handleSuggestionClick({ target: children[0] }, refs, term);
    }
  }
};

export const suggestQueryForXterm = async term => {
  const { query_suggestions } = store.getState().terminal;
  await TWS.termWrite(term, TWS.constructInputToWrite());
  if (query_suggestions.length > 0) {
    let str_to_write = query_suggestions[0].suggestion.split(data_obj.data)[1];
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
    const str = query_suggestions[0].suggestion;
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
  TWS.handleWriteToCircuitUIResponse(
    refs,
    TWS.constructOutputToWrite(null, TWS.data_obj.data, true),
    'query',
  );
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
  await TWS.termWrite(term, TWS.constructInputToWrite());
  TWS.handleWriteToCircuitUIInput(refs, ev);
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
  await TWS.termWrite(term, TWS.constructInputToWrite());
  TWS.handleWriteToCircuitUIInput(refs, ev);
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

  TWS.handleWriteToCircuitUIResponse(
    refs,
    TWS.constructOutputToWrite(null, lines.join('\n'), true),
    res_type,
  );

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
  TWS.handleWriteToCircuitUIResponse(
    refs,
    TWS.constructOutputToWrite(null, latest.query, true),
    'query',
  );

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

  TWS.handleWriteToCircuitUIResponse(
    refs,
    TWS.constructOutputToWrite(null, lines.join('\n'), true),
    'query',
  );

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
      const { suggestion_dialog_open } = store.getState().terminal;
      if (suggestion_dialog_open) {
        if (e.key === 'Escape')
          return store.dispatch(setSuggestionDialogOpen(false));
        if (['ArrowUp', 'ArrowDown'].includes(e.code))
          return focusPrevOrNextSuggestion(e, refs);
        if (['Enter', 'ArrowRight'].includes(e.code))
          return selectSuggestionInFocus(refs);
      }
      const { term } = store.getState().terminal;
      await handleXTermOnKey(term, refs, { domEvent: e });
      setSuggestionsPopoverMarginLeftTrackerContent(
        refs.suggestionsPopoverMarginLeftTrackerEl.current,
      );
    },
    false,
  );

  el.children[1].children[1].addEventListener(
    'click',
    async function handleInitCircuitUIButtonClick(e) {
      const { term, busy } = store.getState().terminal;
      if (!busy) {
        await handleEnter(term, refs);
        setSuggestionsPopoverMarginLeftTrackerContent(
          refs.suggestionsPopoverMarginLeftTrackerEl.current,
        );
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

export const handleWriteToCircuitUIResponse = (refs, value, res_type) => {
  const circuitUIResEl = refs.circuitUIRef.current.children[0];
  const containerDiv = circuitUIResEl.ownerDocument.createElement('div');
  if (res_type === 'query') {
    containerDiv.classList.add('query');
  } else {
    containerDiv.classList.add('response');
  }

  const p = circuitUIResEl.ownerDocument.createElement('p');
  p.innerHTML = value;

  if (res_type === 'stderr') {
    const errEl = circuitUIResEl.ownerDocument.createElement('span');
    errEl.classList.add('error');
    errEl.innerText = 'ERROR';
    p.prepend(errEl);
  }

  containerDiv.append(p);
  circuitUIResEl.append(containerDiv);
  circuitUIResEl.scrollTop = circuitUIResEl.scrollHeight;
};

export const handleWriteToCircuitUIInput = (refs, ev) => {
  const input = refs.circuitUIRef.current.children[1].children[0];
  input.value = TWS.data_obj.data;
  input.setSelectionRange(
    TWS.data_obj.cursorPosition,
    TWS.data_obj.cursorPosition,
  );
  if (!ev || !['ArrowUp', 'ArrowDown'].includes(ev.code))
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
