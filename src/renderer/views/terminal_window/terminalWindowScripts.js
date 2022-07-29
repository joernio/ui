import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';

import { windowActionApi } from '../../assets/js/utils/ipcRenderer';
import { generateRandomID, deepClone, addToQueue } from '../../assets/js/utils/scripts';
import {
	terminalVariables as TV,
	printable,
} from '../../assets/js/utils/defaultVariables';

import {
	setHistory,
	setTerminalBusy,
	setQuerySuggestions,
	setCircuitUIResponses,
} from '../../store/actions/terminalActions';
import { store } from '../../store/configureStore';

import * as TWS from './terminalWindowScripts';

export const { workerPool } = store.getState().query;
export const data_obj = { data: '', cursorPosition: 0, currentBlockID: null };

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

export const handleTerminalMaximizeToggle = bool => ({ isMaximized: !bool });

export const handleResize = fitAddon => {
	fitAddon && fitAddon.fit();
};

export const handleEmptyWorkspace = (projects, prev_projects) => {
	if (projects && Object.keys(projects).length < 1) {
		return { isMaximized: true };
	}
	if (
		projects &&
		Object.keys(projects).length > 0 &&
		Object.keys(prev_projects ? prev_projects : {}).length < 1
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
	query_strings = query_strings.filter(
		query_string =>
			!!(
				query_string &&
				data_obj.data &&
				query_string.startsWith(data_obj.data)
			),
	);
	query_strings.reverse();
	query_strings = [...new Set(query_strings)]; // remove duplicates
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

export const handlePrintable = async (term, refs, e) => {
	TWS.updateData(e.key);
	TWS.updateCursorPosition(TWS.data_obj.cursorPosition + e.key.length);
	await TWS.termWrite(term, TWS.constructInputToWrite());
	TWS.handleWriteToCircuitUIInput(refs);
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
  addToQueue(query);
	store.dispatch(setTerminalBusy(true));
	await TWS.termWrite(term, TWS.constructInputToWrite());
	await TWS.termWriteLn(term, '');
	TWS.handleWriteToCircuitUIResponse(refs, TWS.data_obj.data, 'query');
	TWS.updateData(null);
	TWS.updateCursorPosition(0);
	TWS.handleWriteToCircuitUIInput(refs);
};

export const handleBackspace = async (term, refs) => {
	const { data } = TWS.data_obj;
	const { cursorPosition } = TWS.data_obj;
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
	const prev_query = TWS.getPrev(history);
	const new_history = TWS.rotatePrev({ ...history });
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
	const next_query = TWS.getNext(history);
	const new_history = TWS.rotateNext({ ...history });
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
	await TWS.writeSuggestionToXterm(term, refs);
	TWS.updateCursorPosition(
		TWS.data_obj.cursorPosition < TWS.data_obj.data.length
			? TWS.data_obj.cursorPosition + 1
			: TWS.data_obj.data.length,
	);
	await TWS.termWrite(term, TWS.constructInputToWrite());
	TWS.handleWriteToCircuitUIInput(refs);
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
	return next || '';
};

export const getPrev = history => {
	let prev = Object.keys(history.prev_queries);
	prev = prev[prev.length - 1];
	prev = history.prev_queries[prev];

	if (prev) {
		return prev;
	}
	return TWS.getNext(history);
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
	}
	return fitAddon;
};

export const handleWriteQueryResult = async (term, refs, latest) => {
	TWS.updateData(null);
	TWS.updateCursorPosition(0);

	const res_type = latest.result.stdout
		? 'stdout'
		: latest.result.stderr
		? 'stderr'
		: null;

	TWS.handleWriteToCircuitUIResponse(refs, latest.result[res_type], res_type);

	const lines = res_type ? latest.result[res_type].split('\n') : [];

	for (let i = 0; i < lines.length; i += 1) {
		// eslint-disable-next-line no-await-in-loop
		await TWS.termWriteLn(term, TWS.constructOutputToWrite(null, lines[i]));
	}

	await term.prompt();
	store.dispatch(setTerminalBusy(false));
	return true;
};

export const handleWriteScriptQuery = async (term, refs, latest) => {
	const { busy } = store.getState().terminal;

	TWS.updateData(null);
	TWS.updateCursorPosition(0);

	TWS.handleWriteToCircuitUIResponse(refs, latest.query, 'query');

	await TWS.termWriteLn(
		term,
		TWS.constructOutputToWrite(TV.cpgDefaultPrompt, latest.query),
	);

	!busy && (await term.prompt());
};

export const handleWriteQuery = async (term, refs, latest) => {
	TWS.updateData(null);
	TWS.updateCursorPosition(0);

	TWS.handleWriteToCircuitUIResponse(refs, latest.query, 'query');

	const lines = latest.query.split('\n');

	for (let i = 0; i < lines.length; i += 1) {
		if (i < 1) {
			// eslint-disable-next-line no-await-in-loop
			await TWS.termWriteLn(
				term,
				TWS.constructOutputToWrite(TV.cpgDefaultPrompt, lines[i]),
			);
		} else {
			// eslint-disable-next-line no-await-in-loop
			await TWS.termWriteLn(
				term,
				TWS.constructOutputToWrite(null, lines[i]),
			);
		}
	}

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

	const shellprompt = TV.carriageReturn + TV.newLine + TV.cpgDefaultPrompt;

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
		async e => {
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
		async () => {
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
			// eslint-disable-next-line no-undef
			handleInitCircuitUIInputKeyDown, // this is undefined, why does it still work?
		);
		el.children[1].children[1].removeEventListener(
			'click',
			// eslint-disable-next-line no-undef
			handleInitCircuitUIButtonClick, // this is undefined, why does it still work?
		);
	};
};

export const handleToggleAllBlocks = (cache, vList) => {
	const circuit_ui_responses = deepClone(
		store.getState().terminal.circuit_ui_responses,
	);

	circuit_ui_responses.dropdown = !circuit_ui_responses.dropdown;

	Object.keys(circuit_ui_responses.all).forEach(block_id => {
		const block = circuit_ui_responses.all[block_id];
		block.dropdown = circuit_ui_responses.dropdown;
	});

	store.dispatch(setCircuitUIResponses(circuit_ui_responses));

	cache.clearAll();
	vList.recomputeRowHeights();
};

export const handleWriteToCircuitUIResponse = (refs, value, res_type) => {
  // remove stale refs variable file wide
	let { circuit_ui_responses } = store.getState().terminal;
	circuit_ui_responses = deepClone(circuit_ui_responses);

	if (res_type === 'query') {
		const block_id = generateRandomID();

		TWS.data_obj.currentBlockID = block_id;
		value = TWS.constructOutputToWrite(null, value, true);

		const block = {
			dropdown: true,
			ui_query: {
				res_type,
				value,
			},
		};

		circuit_ui_responses.length += 1;
		circuit_ui_responses.indexes.push({
			res_type,
			block,
			block_id,
			sub_block_id: null,
		});

		circuit_ui_responses.all[block_id] = block;

		store.dispatch(setCircuitUIResponses(circuit_ui_responses));
	} else {
		circuit_ui_responses.all[TWS.data_obj.currentBlockID]['ui_response'] = {
			res_type,
			responses: {},
		};

		if (res_type === 'stderr') {
			value = TWS.constructOutputToWrite(null, value, true);

			const block_id = TWS.data_obj.currentBlockID;
			const sub_block_id = generateRandomID();
			const block = circuit_ui_responses.all[block_id];

			block['ui_response']['responses'][sub_block_id] = { value };

			block['ui_response']['length'] = 1;
			circuit_ui_responses.length += 1;
			circuit_ui_responses.indexes.push({
				res_type,
				block,
				block_id,
				sub_block_id,
			});

			store.dispatch(setCircuitUIResponses(circuit_ui_responses));
		} else if (res_type === 'stdout') {
			const listContentSeperator = generateRandomID();
			const objValueSeperator = generateRandomID();

			const callback = data => {
				window.requestIdleCallback(() => {
					const block_id = data.blockID;
					const sub_block_id = generateRandomID();
					const block = circuit_ui_responses.all[block_id];

					block['ui_response']['length'] = block['ui_response'][
						'length'
					]
						? block['ui_response']['length'] + 1
						: 1;
					circuit_ui_responses.length += 1;

					circuit_ui_responses.indexes.push({
						res_type,
						block,
						block_id,
						sub_block_id,
					});

					block['ui_response']['dropdown'] = true;

					block['ui_response']['responses'][sub_block_id] = {
						dropdown: false,
						value: data.value,
					};

					store.dispatch(setCircuitUIResponses({...circuit_ui_responses}));
				});
			};

			/**
			 * Infer if value can potentially require
			 * heavy parsing and is therefore more suitable for the worker process.
			 */
			if (!value.split('List[Method] = List(')[1]) {
				value = TWS.constructOutputToWrite(null, value, true);
				const block_id = TWS.data_obj.currentBlockID;
				const sub_block_id = generateRandomID();
				const block = circuit_ui_responses.all[block_id];

				block['ui_response']['length'] = block['ui_response']['length']
					? block['ui_response']['length'] + 1
					: 1;
				circuit_ui_responses.length += 1;

				circuit_ui_responses.indexes.push({
					res_type,
					block,
					block_id,
					sub_block_id,
				});

				block['ui_response']['responses'][sub_block_id] = { value };

				store.dispatch(setCircuitUIResponses(circuit_ui_responses));
			} else {
				const data = { value, listContentSeperator, objValueSeperator, blockID: TWS.data_obj.currentBlockID };
				TWS.workerPool.queue(worker => {
					return worker.parseCircuitUIResponseValue(data).subscribe(callback);
        });
			}
		}
	}
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

export const handleMaximize = (terminalRef, isMaximized) => {
	if (isMaximized) {
		return {
			terminalHeight: `${terminalRef.current.parentElement.getBoundingClientRect().height - 37}px`,
		};
	}
	return { terminalHeight: '468px' };
};

export const resizeHandler = (terminalHeight, diff, terminalRef) => {
  const parentElementDimension = terminalRef.current.parentElement.getBoundingClientRect();
	if (Number(terminalHeight.split('px')[0]) < 218 && diff < 0) {
		terminalHeight = 0;
  } else if(Number(terminalHeight.split('px')[0]) < 218 && diff > 0) {
		terminalHeight = '468px';
	} else if ( diff > 0 && terminalRef?.current &&
    Number(terminalHeight.split('px')[0]) + 37 >= parentElementDimension.height
	) {
		terminalHeight  = `${parentElementDimension.height - 37}px`;
	};

  return { terminalHeight };
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

		const prev_keys = Object.keys(history.prev_queries);

		if (prev_keys.length >= 500) {
			history = removeOldestQueryFromHistory(history, prev_keys);
		}

		store.dispatch(setHistory(history));
	}
};

export const sendQueryResultToXTerm = async (results, refs) => {
	const { term } = store.getState().terminal;

	const latest =
		results[Object.keys(results)[Object.keys(results).length - 1]];

	if (
		term &&
		(latest?.result.stdout || latest?.result.stderr) &&
		!latest?.ignore &&
		latest.post_query_uuid &&
		(latest.workspace || latest.project)
	) {
		return await handleWriteQueryResult(term, refs, latest); // eslint-disable-line no-return-await
	}

	if (
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
