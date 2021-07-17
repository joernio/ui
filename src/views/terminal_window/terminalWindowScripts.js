import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { enQueueQuery } from '../../store/actions/queryActions';
import {
  setHistory,
  setTerminalBusy,
} from '../../store/actions/terminalActions';
import { store } from '../../store/configureStore';

import {
  joernWelcomeScreen,
  joernDefaultPrompt,
} from '../../assets/js/utils/defaultVariables';

const data_obj = { data: '' };

export const moveCursorToLineStart = term => {
  for (let i = 0; i <= 9; i++) {
    term.write('\b \b');
  }
};

export const clearLine = async term => {
  await new Promise(resolve => {
    const clearLineSync = term => {
      if (term._core.buffer.x > 8) {
        term.write('\b \b', () => clearLineSync(term));
      } else {
        resolve();
      }
    };

    clearLineSync(term);
  });
};

export const handleTerminalMaximizeToggle = bool => {
  return { isMaximized: !bool };
};

export const handleResize = fitAddon => {
  fitAddon && fitAddon.fit();
};

export const openXTerm = (terminalRef, term) => {
  if (term) {
    term.onKey(e => {
      handleXTermOnData(term, e);
    });

    term.open(terminalRef.current);
  }
};

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

export const removeOldestQueryFromHistory = (history, prev_keys, next_keys) => {
  if (next_keys.length === 0) {
    delete history.prev_queries[prev_keys[0]];
  } else {
    delete history.next_queries[next_keys[next_keys.length - 1]];
  }

  return history;
};

export const addQueryToHistory = (history, queue, key, next_keys) => {
  if (next_keys.length === 0) {
    history.prev_queries[key] = queue[key];
  } else {
    let entries = Object.entries(history.next_queries);
    entries.unshift([key, queue[key]]);
    history.next_queries = Object.fromEntries(entries);
  }

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

export const initXterm = prefersDarkMode => {
  const term = new Terminal({
    cursorBlink: true,
    theme: {
      background: prefersDarkMode ? '#000000' : '#ffffff',
      foreground: prefersDarkMode ? '#ffffff' : '#000000',
      cursorAccent: prefersDarkMode ? '#ffffff' : '#000000',
      cursor: prefersDarkMode ? '#ffffff' : '#000000',
    },
  });

  let shellprompt = joernDefaultPrompt;

  term.prompt = function () {
    term.write(shellprompt);
  };

  term.write(joernWelcomeScreen);
  term.prompt();

  return term;
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

export const handleQuery = queue => {
  let { history } = store.getState().terminal;
  let key = Object.keys(queue);
  key = key[key.length - 1];

  if (
    !queue[key].ignore &&
    !history.prev_queries[key] &&
    !history.next_queries[key]
  ) {
    let prev_keys = Object.keys(history.prev_queries);
    let next_keys = Object.keys(history.next_queries);

    history = addQueryToHistory(history, queue, key, next_keys);

    if (prev_keys.length + next_keys.length >= 250) {
      history = removeOldestQueryFromHistory(history, prev_keys, next_keys);
    }

    return { history };
  }

  return {};
};

export const handleXTermOnData = async (term, e) => {
  const ev = e.domEvent;
  const printable = !ev.altKey && !ev.ctrlKey && !ev.metaKey;
  const { history, busy } = store.getState().terminal;

  if (busy) return;

  if (ev.code === 'Enter') {
    const query = {
      query: data_obj.data,
      origin: 'terminal',
      ignore: false,
    };
    store.dispatch(enQueueQuery(query));
    store.dispatch(setTerminalBusy(true));
    data_obj.data = '';
    term.writeln('');
  } else if (ev.code === 'Backspace') {
    if (term._core.buffer.x > 8) {
      // Do not delete the prompt
      term.write('\b \b');
      data_obj.data = data_obj.data.slice(0, data_obj.data.length - 1);
    }
  } else if (ev.code === 'ArrowUp') {
    ev.preventDefault();
    let prev_query = getPrev(history);
    let new_history = rotatePrev({ ...history });
    await clearLine(term);
    term.write(prev_query.query ? prev_query.query : '');
    data_obj.data = prev_query.query ? prev_query.query : '';
    store.dispatch(setHistory(new_history));
  } else if (ev.code === 'ArrowDown') {
    ev.preventDefault();
    let next_query = getNext(history);
    let new_history = rotateNext({ ...history });
    await clearLine(term);
    term.write(next_query.query ? next_query.query : '');
    data_obj.data = next_query.query ? next_query.query : '';
    store.dispatch(setHistory(new_history));
  } else if (printable) {
    const max_char = Math.round(
      term._core._viewportScrollArea.offsetWidth / 9.077922077922079,
    );
    if (max_char === term._core.buffer.x) term.write('         '); //don't write under the prompt text to avoid writing text that can't be deleted
    term.write(e.key);
    data_obj.data += e.key;
  }
};

export const sendQueryResultToXTerm = results => {
  const { term } = store.getState().terminal;

  const latest = results[Object.keys(results)[Object.keys(results).length - 1]];

  if (
    term &&
    (latest?.result.stdout || latest?.result.stderr) &&
    !latest?.ignore
  ) {
    if (latest.result.stdout) {
      latest.result.stdout.split('\n').forEach((str, index) => {
        if (index < 1) moveCursorToLineStart(term);
        term.writeln(' ' + str);
      });
      term.prompt();
      store.dispatch(setTerminalBusy(false));
      return true;
    } else if (latest.result.stderr) {
      latest.result.stderr.split('\n').forEach((str, index) => {
        if (index < 1) moveCursorToLineStart(term);
        term.writeln(' ' + str);
      });
      term.prompt();
      store.dispatch(setTerminalBusy(false));
      return true;
    }
  } else if (
    term &&
    !latest?.ignore &&
    latest?.query &&
    !(latest?.result?.stdout && latest?.result?.stderr)
  ) {
    if (latest.origin === 'script') {
      term.writeln('Running script .....');
      store.dispatch(setTerminalBusy(true));
    } else if (latest.origin !== 'terminal') {
      latest.query.split('\n').forEach((str, index) => {
        if (index < 1) {
          term.writeln(str);
        } else {
          term.writeln(' ' + str);
        }
      });
      store.dispatch(setTerminalBusy(true));
    }
  }
};
