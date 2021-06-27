import { Terminal } from 'xterm';

import {
  joernWelcomeScreen,
  joernDefaultPrompt,
} from '../../assets/js/utils/defaultVariables';


const data_obj = { data: '' };

export const initXterm = () => {
  const term = new Terminal({ rows: 20 });

  let shellprompt = joernDefaultPrompt;

  term.prompt = function () {
    term.write(shellprompt);
  };

  term.writeln(joernWelcomeScreen);
  term.prompt();

  return term;
};

export const openXTerm = (terminalRef, state, props) => {
  if (terminalRef.current && state.term) {
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

    if (term._core.buffer.x > 7) {
      term.write('\b \b');
      data_obj.data = data_obj.data.slice(0, data_obj.data.length - 1);
    }
  } else if (printable) {
    term.write(e.key);
    data_obj.data += e.key;
  }
};

export const sendQueryResultToXTerm = (state, props) => {
  const { results } = props.query;
  const latest = results[Object.keys(results)[Object.keys(results).length - 1]];
  const { term } = state;

  if (
    term &&
    (latest?.result.stdout || latest?.result.stderr) &&
    !latest?.ignore
  ) {
    if (latest.result.stdout) {
      term.writeln(latest.result.stdout);
      term.prompt();
    } else if (latest.result.stderr) {
      term.writeln(latest.result.stderr);
      term.prompt();
    }
  } else if (
    term &&
    !latest?.ignore &&
    latest?.query &&
    !(latest?.result?.stdout && latest?.result?.stderr)
  ) {
    if (latest.origin === 'script') {
      term.writeln('Running script .....');
      term.prompt();
    } else if (latest.origin !== 'terminal') {
      term.writeln(latest.query);
      term.prompt();
    }
  }
};
