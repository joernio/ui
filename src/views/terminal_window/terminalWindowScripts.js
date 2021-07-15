import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';

import {
  joernWelcomeScreen,
  joernDefaultPrompt,
} from '../../assets/js/utils/defaultVariables';

const data_obj = { data: '' };

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

export const initFitAddon = state => {
  let fitAddon = null;
  if (state.term) {
    fitAddon = new FitAddon();
    state.term.loadAddon(fitAddon);
    fitAddon.fit();
    return { fitAddon };
  } else {
    return { fitAddon };
  }
};

export const handleResize = state => {
  state.fitAddon && state.fitAddon.fit();
};

export const handleMaximize = (window, state, props) => {
  if (state.isMaximized) {
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

export const resizeHandler = (terminalHeight, diff, props,  window) => {
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

export const moveCursorToLineStart = term => {
  for (let i = 0; i <= 9; i++) {
    term.write('\b \b');
  }
};

export const handleTerminalMaximizeToggle = bool => {
  return { isMaximized: !bool };
};

export const openXTerm = (terminalRef, state, props) => {
  if (state.term) {
    state.term.onKey(e => {
      handleXTermOnData(state.term, props, e);
    });
    state.term.open(terminalRef.current);
  }
};

export const handleXTermOnData = (term, props, e) => {
  const ev = e.domEvent;
  const printable = !ev.altKey && !ev.ctrlKey && !ev.metaKey;

  if (ev.code === 'Enter') {
    term.prompt();

    const query = {
      query: data_obj.data,
      origin: 'terminal',
      ignore: false,
    };
    props.enQueueQuery(query);
    data_obj.data = '';
  } else if (ev.code === 'Backspace') {
    // Do not delete the prompt

    if (term._core.buffer.x > 8) {
      term.write('\b \b');
      data_obj.data = data_obj.data.slice(0, data_obj.data.length - 1);
    }
  } else if (printable) {
    const max_char = Math.round(
      term._core._viewportScrollArea.offsetWidth / 9.077922077922079,
    );
    if (max_char === term._core.buffer.x) term.write('         '); //don't write under the prompt text to avoid writing text that can't be deleted
    term.write(e.key);
    data_obj.data += e.key;
  }
};

export const sendQueryResultToXTerm = (state, results) => {
  const latest = results[Object.keys(results)[Object.keys(results).length - 1]];
  const { term } = state;

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
      return true;
    } else if (latest.result.stderr) {
      latest.result.stderr.split('\n').forEach((str, index) => {
        if (index < 1) moveCursorToLineStart(term);
        term.writeln(' ' + str);
      });
      term.prompt();
      return true;
    }
  } else if (
    term &&
    !latest?.ignore &&
    latest?.query &&
    !(latest?.result?.stdout && latest?.result?.stderr)
  ) {
    if (latest.origin === 'script') {
      term.write('Running script .....');
      term.prompt();
    } else if (latest.origin !== 'terminal') {
      latest.query.split('\n').forEach((str, index) => {
        if (index < 1) {
          term.writeln(str);
        } else {
          term.writeln(' ' + str);
        }
      });
      term.prompt();
    }
  }
};
