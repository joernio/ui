import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';

import { windowActionApi } from '../../assets/js/utils/ipcRenderer';
import {
	generateRandomID,
	deepClone,
	addToQueue,
} from '../../assets/js/utils/scripts';
import {
	terminalVariables as TV,
	printable,
} from '../../assets/js/utils/defaultVariables';

import {
	setHistory,
	setTerminalBusy,
	setQuerySuggestions,
	setCircuitUIResponses,
	setSuggestionDialogOpen,
} from '../../store/actions/terminalActions';
import { store } from '../../store/configureStore';

import * as TWS from './terminalWindowScripts';
import querydb from '../../assets/js/utils/queries'; // eslint-disable-line import/extensions

export const { workerPool } = store.getState().query;

// TODO: remove stale refs variable file wide

export const vars = {
	data: '',
	cursorPosition: 0,
	currentBlockID: null,
};

export const updateData = str => {
	if (str) {
		TWS.vars.data = `${TWS.vars.data.slice(
			0,
			TWS.vars.cursorPosition,
		)}${str}${TWS.vars.data.slice(TWS.vars.cursorPosition)}`;
	} else {
		TWS.vars.data = '';
	}
};

export const updateCursorPosition = value => {
	TWS.vars.cursorPosition = value;
};

export const constructInputToWrite = () =>
	TV.clearLine +
	TV.cpgDefaultPrompt +
	TWS.vars.data +
	TV.carriageReturn +
	TV.cursorPositionFromStart
		.split('<n>')
		.join(TV.cpgDefaultPrompt.length + TWS.vars.cursorPosition);

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

export const setSuggestionsPopoverMarginLeftTrackerContent = el => {
	el.innerText = vars.data;
};

export const getQuerySuggestionFromHistory = () => {
	const { results } = store.getState().query;
	let suggestions = Object.keys(results);
	suggestions = suggestions.map(key => results[key].query);
	suggestions = suggestions.filter(query =>
		query && vars.data && query.startsWith(vars.data) ? true : false,
	);
	suggestions.reverse();
	suggestions = [...new Set(suggestions)]; // remove duplicates
	suggestions = suggestions.map(suggestion => ({
		suggestion,
		origin: 'history',
	}));
	return suggestions;
};

export const getQuerySuggestionFromQueryDatabase = () => {
	let query = vars.data.replace(/\((.+?)\)/g, '("")');
	query = query.split('.');
	let suggestions = querydb;

  // eslint-disable-next-line no-restricted-syntax
	for (const str of query) {
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
		suggestions = Object.keys(suggestions).map(
			suggestion => `.${suggestion}`,
		);
	}

	suggestions = suggestions.map(suggestion => `${vars.data}${suggestion}`);

	suggestions = suggestions.map(suggestion => ({
		suggestion,
		origin: 'database',
	}));
	return suggestions;
};

export const suggestSimilarQueries = () => {
	let suggestions = getQuerySuggestionFromHistory();
	suggestions = [...suggestions, ...getQuerySuggestionFromQueryDatabase()];
	store.dispatch(setQuerySuggestions(suggestions));
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
	TWS.updateCursorPosition(TWS.vars.cursorPosition + str.length);
	await TWS.termWrite(term, TWS.constructInputToWrite());
	TWS.handleWriteToCircuitUIInput(refs);
	refs.circuitUIRef.current.children[1].children[0].focus();
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
			const target_element_dimensions =
				target_element.getBoundingClientRect();
			if (
				target_element_dimensions.width + offset_width <
				container_width
			) {
				target_element.style.marginLeft = `${offset_width}px`;
			} else if (
				target_element_dimensions.width + offset_width >=
				container_width
			) {
				offset_width =
					container_width - target_element_dimensions.width;
				target_element.style.marginLeft = `${offset_width}px`;
			} else if (
				target_element.style.marginLeft &&
				offset_width <
					Number(target_element.style.marginLeft.split('px')[0])
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

	for (let i = 0; i < children.length; i += 1) {
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

	for (let i = 0; i < children.length; i += 1) {
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
		let str_to_write = query_suggestions[0].suggestion.split(vars.data)[1];
		str_to_write =
			TV.clearLine +
			TV.cpgDefaultPrompt +
			TWS.vars.data +
			TV.formatText
				.split('<n>')
				.join('38;2;169;169;169')
				.split('<o>')
				.join(str_to_write) +
			TV.carriageReturn +
			TV.cursorPositionFromStart
				.split('<n>')
				.join(TV.cpgDefaultPrompt.length + TWS.vars.cursorPosition);
		await TWS.termWrite(term, str_to_write);
	}
};

export const handlePrintable = async (term, refs, e) => {
	TWS.updateData(e.key);
	TWS.updateCursorPosition(TWS.vars.cursorPosition + e.key.length);
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
		query: TWS.vars.data,
		origin: 'terminal',
		ignore: false,
	};
	addToQueue(query);
	store.dispatch(setTerminalBusy(true));
	await TWS.termWrite(term, TWS.constructInputToWrite());
	await TWS.termWriteLn(term, '');
	TWS.handleWriteToCircuitUIResponse(refs, TWS.vars.data, 'query');
	TWS.updateData(null);
	TWS.updateCursorPosition(0);
	TWS.handleWriteToCircuitUIInput(refs);
};

export const handleBackspace = async (term, refs) => {
	const { data } = TWS.vars;
	const { cursorPosition } = TWS.vars;
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
			? TWS.vars.cursorPosition + prev_query.query.length
			: 0,
	);
	refs.circuitUIRef.current.children[1].children[0].value = TWS.vars.data;
	await TWS.termWrite(term, TWS.constructInputToWrite());
	TWS.handleWriteToCircuitUIInput(refs, ev);
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
			? TWS.vars.cursorPosition + next_query.query.length
			: 0,
	);
	refs.circuitUIRef.current.children[1].children[0].value = TWS.vars.data;
	await TWS.termWrite(term, TWS.constructInputToWrite());
	TWS.handleWriteToCircuitUIInput(refs, ev);
	store.dispatch(setHistory(new_history));
};

export const handleArrowLeft = async (term, refs) => {
	TWS.updateCursorPosition(
		TWS.vars.cursorPosition > 0 ? TWS.vars.cursorPosition - 1 : 0,
	);
	await TWS.termWrite(term, TWS.constructInputToWrite());
	TWS.handleWriteToCircuitUIInput(refs);
};

export const handleArrowRight = async (term, refs) => {
	await TWS.writeSuggestionToXterm(term, refs);
	TWS.updateCursorPosition(
		TWS.vars.cursorPosition < TWS.vars.data.length
			? TWS.vars.cursorPosition + 1
			: TWS.vars.data.length,
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
		!(TWS.vars.cursorPosition < TWS.vars.data.length) &&
		query_suggestions.length > 0
	) {
		const str = query_suggestions[0].suggestion;
		TWS.updateData(null);
		TWS.updateCursorPosition(0);
		TWS.updateData(str);
		TWS.updateCursorPosition(TWS.vars.cursorPosition + str.length);
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
    // eslint-disable-next-line prefer-arrow-callback
		async function handleInitCircuitUIInputKeyDown(e) {
			const { suggestion_dialog_open } = store.getState().terminal;
			if (suggestion_dialog_open) {
				if (e.key === 'Escape')
					return store.dispatch(setSuggestionDialogOpen(false));
				if (['ArrowUp', 'ArrowDown'].includes(e.code))
					return focusPrevOrNextSuggestion(e, refs);
				if (['ArrowRight'].includes(e.code))
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
		// eslint-disable-next-line prefer-arrow-callback
		async function handleInitCircuitUIButtonClick() {
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

export const circuitUIResponseWorkerCallback = data => {
	const { circuit_ui_responses } = store.getState().terminal;
	const res_type = 'stdout'; // we can reasonably say that only stdout query responses can trigger this function.

	window.requestIdleCallback(() => {
		const block_id = data.blockID;
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

		block['ui_response']['dropdown'] = true;

		block['ui_response']['responses'][sub_block_id] = {
			dropdown: false,
			value: data.value,
		};

		store.dispatch(setCircuitUIResponses({ ...circuit_ui_responses }));
	});
};

export const handleWriteToCircuitUIResponse = (refs, value, res_type) => {
	let { circuit_ui_responses } = store.getState().terminal;
	circuit_ui_responses = deepClone(circuit_ui_responses);

	if (res_type === 'query') {
		const block_id = generateRandomID();

		TWS.vars.currentBlockID = block_id;
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
		circuit_ui_responses.all[TWS.vars.currentBlockID]['ui_response'] = {
			res_type,
			responses: {},
		};

		store.dispatch(setCircuitUIResponses(circuit_ui_responses));

		if (res_type === 'stderr') {
			value = TWS.constructOutputToWrite(null, value, true);

			const block_id = TWS.vars.currentBlockID;
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

			/**
			 * Infer if value can potentially require
			 * heavy parsing and is therefore more suitable for the worker process.
			 */
			if (!value.split('List[Method] = List(')[1]) {
				value = TWS.constructOutputToWrite(null, value, true);
				const block_id = TWS.vars.currentBlockID;
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
				const data = {
					value,
					listContentSeperator,
					objValueSeperator,
					blockID: TWS.vars.currentBlockID,
				};
				TWS.workerPool.queue(worker =>
					worker
						.parseCircuitUIResponseValue(data)
						.subscribe(circuitUIResponseWorkerCallback),
				);
			}
		}
	}
};

export const handleWriteToCircuitUIInput = (refs, ev) => {
	const input = refs.circuitUIRef.current.children[1].children[0];
	input.value = TWS.vars.data;

	/**
	 * Here we save state of the previous value of the
	 * input in the input itself through the input attribute "data-prev-value"
	 *
	 * This allows us to micro-control when calling handleWriteToCirtcuitInput
	 * is allowed to call suggestSimilarQueries().
	 *
	 * To be more specific, this ensures that the query suggestion dialog is
	 * closed immediately after the execution of a query,
	 * and is opened when a user tries typing a query and immediately clears the input,
	 * even when the input box contains just empty strings in both scenarios
	 */
	const prev_value = input.getAttribute('data-prev-value');
	input.setAttribute('data-prev-value', TWS.vars.data);
	if (prev_value.length > TWS.vars.data.length && prev_value.length > 1) {
		store.dispatch(setSuggestionDialogOpen(false));
		return;
	}
	/** ********************************** */

	input.setSelectionRange(TWS.vars.cursorPosition, TWS.vars.cursorPosition);
	if (!ev || !['ArrowUp', 'ArrowDown'].includes(ev.code))
		suggestSimilarQueries();
};

export const handleMaximize = (terminalRef, isMaximized) => {
	if (isMaximized) {
		return {
			terminalHeight: `${
				terminalRef.current.parentElement.getBoundingClientRect()
					.height - 37
			}px`,
		};
	}
	return { terminalHeight: '468px' };
};

export const resizeHandler = (terminalHeight, diff, terminalRef) => {
	const parentElementDimension =
		terminalRef.current.parentElement.getBoundingClientRect();
	if (Number(terminalHeight.split('px')[0]) < 218 && diff < 0) {
		terminalHeight = 0;
	} else if (Number(terminalHeight.split('px')[0]) < 218 && diff > 0) {
		terminalHeight = '468px';
	} else if (
		diff > 0 &&
		terminalRef?.current &&
		Number(terminalHeight.split('px')[0]) + 37 >=
			parentElementDimension.height
	) {
		terminalHeight = `${parentElementDimension.height - 37}px`;
	}

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
