import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';

import iconChevronDown from '../../assets/image/icon-chevron-down.svg';
import { windowActionApi } from '../../assets/js/utils/ipcRenderer';
import { openFile, generateRandomID } from '../../assets/js/utils/scripts';
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

export const { workerPool } = store.getState().query;
export const data_obj = { data: '', cursorPosition: 0, currentBlockID: null };

/**
 * udate data
 * @param {*} str
 */
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

/**
 * Function to update the cursor position when
 * typing query in the query input
 * @param {number} value
 */
export const updateCursorPosition = value => {
	TWS.data_obj.cursorPosition = value;
};

/**
 * Function to construct input to write
 * @returns
 */
export const constructInputToWrite = () =>
	TV.clearLine +
	TV.cpgDefaultPrompt +
	TWS.data_obj.data +
	TV.carriageReturn +
	TV.cursorPositionFromStart
		.split('<n>')
		.join(TV.cpgDefaultPrompt.length + TWS.data_obj.cursorPosition);

/**
 * construct output to write
 * @param {*} prompt
 * @param {*} value
 * @param {*} isCircuitUI
 * @returns
 */
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

/**
 * Function to resize the terminal height
 * @param {*} fitAddon
 */
export const handleResize = fitAddon => {
	fitAddon && fitAddon.fit();
};

/**
 * function to empty workspace
 * @param {*} workspace
 * @param {*} prev_workspace
 * @returns true if no project is available,
 * false if a project is found otherwise an empty object
 */
export const handleEmptyWorkspace = (workspace, prev_workspace) => {
	if (workspace && Object.keys(workspace.projects).length < 1) {
		return { isMaximized: true };
	}
	if (
		workspace &&
		Object.keys(workspace.projects).length > 0 &&
		Object.keys(prev_workspace?.projects ? prev_workspace.projects : {})
			.length < 1
	) {
		return { isMaximized: false };
	}

	return {};
};

/**
 * set suggestion box tracker content
 */
export const setSuggestionBoxTrackerContent = el => {
	el.innerText = data_obj.data;
};

/**
 * Function to suggest queries related to what the user is typing on the
 * query input
 */
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

/**
 * handle suggestion click
 * @param {*} e
 * @param {*} refs
 * @param {*} term
 */
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

/**
 * suggest query for Xterm
 * @param {*} term
 */
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

/**
 * write query result
 * @param {*} term
 * @param {*} refs
 * @param {*} latest
 * @returns
 */
export const handleWriteQueryResult = async (term, refs, latest) => {
	TWS.updateData(null);
	TWS.updateCursorPosition(0);

	const res_type = latest.result.stdout
		? 'stdout'
		: latest.result.stderr
		? 'stderr'
		: null;
	const lines = res_type ? latest.result[res_type].split('\n') : [];

	for (let i = 0; i < lines.length; i += 1) {
		// eslint-disable-next-line no-await-in-loop
		await TWS.termWriteLn(term, TWS.constructOutputToWrite(null, lines[i]));
	}

	TWS.handleWriteToCircuitUIResponse(refs, lines.join('\n'), res_type);

	await term.prompt();
	store.dispatch(setTerminalBusy(false));
	return true;
};

/**
 * write script query
 * @param {*} term
 * @param {*} refs
 * @param {*} latest
 */
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

/**
 * write query
 * @param {*} term
 * @param {*} refs
 * @param {*} latest
 */
export const handleWriteQuery = async (term, refs, latest) => {
	TWS.updateData(null);
	TWS.updateCursorPosition(0);

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

	TWS.handleWriteToCircuitUIResponse(refs, lines.join('\n'), 'query');

	store.dispatch(setTerminalBusy(true));
};

/**
 * init Xterm
 */
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

/**
 * init circuit ui
 * @param {*} refs
 * @returns
 */
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
		startLine = Number(
			startLine.replace('Some(value = ', '').replace(')', ''),
		);
		endLine = Number(endLine.replace('Some(value = ', '').replace(')', ''));
		await openFile(filename);
		store.dispatch(setHighlightRange({ startLine, endLine }));
	}
};

/**
 * toggle all blocks
 * @param {*} e
 */
export const handleToggleAllBlocks = e => {
	const collapsed = e.target.getAttribute('data-blocks-collapsed');

	const queryContainers =
		e.target.parentElement.getElementsByClassName('query');
	const responseContainers =
		e.target.parentElement.getElementsByClassName('response');

	if (responseContainers.length) {
		if (collapsed) {
			e.target.removeAttribute('data-blocks-collapsed');
		} else {
			e.target.setAttribute('data-blocks-collapsed', true);
		}
	}
	// eslint-disable-next-line no-restricted-syntax
	for (const el of queryContainers) {
		if (collapsed) {
			el.classList.remove('dropdown');
		} else {
			el.classList.add('dropdown');
		}
	}

	// eslint-disable-next-line no-restricted-syntax
	for (const el of responseContainers) {
		if (collapsed) {
			el.classList.remove('dropdown');
		} else {
			el.classList.add('dropdown');
		}
	}
};

/**
 * Function to toggle the visibility of query response block
 * @param {HTMLCollection} e
 */
export const handleToggleBlock = e => {
	const queryContainer = e.target.parentElement;

	const blockID = queryContainer.getAttribute('data-block-id');

	const responseContainer = queryContainer.parentElement.querySelector(
		`.response[data-block-id='${blockID}']`,
	);

	queryContainer.classList.toggle('dropdown');
	responseContainer.classList.toggle('dropdown');
};

/**
 * toggle all sub blocks
 * @param {*} e
 */
export const handleToggleAllSubBlocks = e => {
	const collapsed = e.target.getAttribute('data-sub-blocks-collapsed');

	const objectContainers =
		e.target.parentElement.getElementsByClassName('object-container');

	if (objectContainers.length) {
		if (collapsed) {
			e.target.removeAttribute('data-sub-blocks-collapsed');
		} else {
			e.target.setAttribute('data-sub-blocks-collapsed', true);
		}
	}
	// eslint-disable-next-line no-restricted-syntax
	for (const el of objectContainers) {
		if (collapsed) {
			el.classList.remove('dropdown');
		} else {
			el.classList.add('dropdown');
		}
	}
};

/**
 * toggle sub block
 * @param {*} e
 */
export const handleToggleSubBlock = e => {
	e.target.parentElement.classList.toggle('dropdown');
};

/**
 * handleInsertELementToCircuitUIResponseNode
 * @param {*} obj
 */
export const handleInsertELementToCircuitUIResponseNode = obj => {
	let { value } = obj;
	const { resultsContainer, valueContainer } = obj;

	if (typeof value === 'string') {
		valueContainer.parentElement.removeChild(
			valueContainer.parentElement.children[0],
		);

		value = TWS.constructOutputToWrite(null, value, true);

		const p = resultsContainer.ownerDocument.createElement('p');
		p.classList.add('content');
		p.innerHTML = value;
		valueContainer.appendChild(p);
	} else {
		const objContainer =
			resultsContainer.ownerDocument.createElement('div');
		objContainer.classList.add('object-container');
		const objTitle = resultsContainer.ownerDocument.createElement('span');
		objTitle.innerHTML = `${value.fullName}()`;
		objTitle.classList.add('object-title');

		objTitle.onclick = () => openFileAndGoToLineFromCircuitUI(value);

		const objToggleIcon =
			resultsContainer.ownerDocument.createElement('img');
		objToggleIcon.setAttribute('src', iconChevronDown);
		objToggleIcon.onclick = handleToggleSubBlock;
		objContainer.append(objTitle, objToggleIcon);

		Object.keys(value).forEach(prop => {
			const objEntryContainer =
				resultsContainer.ownerDocument.createElement('div');
			objEntryContainer.classList.add('object-entry-container');
			const objKey = resultsContainer.ownerDocument.createElement('span');
			objKey.classList.add('object-key');
			const objValue =
				resultsContainer.ownerDocument.createElement('span');
			objKey.innerText = prop;
			objValue.innerText = value[prop];
			objEntryContainer.append(objKey, objValue);
			objContainer.append(objEntryContainer);
		});

		valueContainer.appendChild(objContainer);
	}

	resultsContainer.scrollTop = resultsContainer.scrollHeight;
};

/**
 * handleWriteToCircuitUIResponse
 * @param {*} refs
 * @param {*} value
 * @param {*} res_type
 */
export const handleWriteToCircuitUIResponse = (refs, value, res_type) => {
	const key = generateRandomID();

	let p;
	let valueWrapper;
	let valueContainer;
	const resultsContainer = refs.circuitUIRef.current.children[0];
	const circuitUIResEl =
		resultsContainer.ownerDocument.getElementById('circuit-ui-results');

	const containerDiv = circuitUIResEl.ownerDocument.createElement('div');
	circuitUIResEl.append(containerDiv);

	if (res_type === 'query') {
		const blockToggleIcon =
			circuitUIResEl.ownerDocument.createElement('img');
		blockToggleIcon.classList.toggle('hide-icon');
		blockToggleIcon.setAttribute('src', iconChevronDown);
		blockToggleIcon.onclick = TWS.handleToggleBlock;

		TWS.data_obj.currentBlockID = key;
		containerDiv.setAttribute('data-block-id', key);

		containerDiv.classList.add('query', 'dropdown');
		value = TWS.constructOutputToWrite(null, value, true);
		containerDiv.append(blockToggleIcon);

		p = circuitUIResEl.ownerDocument.createElement('p');
		p.classList.add('content');
		p.innerHTML = value;
		containerDiv.append(p);

		resultsContainer.scrollTop = resultsContainer.scrollHeight;
	} else {
		const queryContainer = circuitUIResEl.querySelector(
			`.query[data-block-id='${TWS.data_obj.currentBlockID}']`,
		);
		queryContainer.querySelector('img').classList.toggle('hide-icon');

		containerDiv.setAttribute('data-block-id', TWS.data_obj.currentBlockID);
		containerDiv.classList.add('response', 'dropdown');

		valueWrapper = circuitUIResEl.ownerDocument.createElement('div');
		valueWrapper.classList.add('value-wrapper');
		valueContainer = circuitUIResEl.ownerDocument.createElement('div');
		valueContainer.classList.add('value-container');

		valueWrapper.append(valueContainer);
		containerDiv.append(valueWrapper);

		if (res_type === 'stderr') {
			value = TWS.constructOutputToWrite(null, value, true);

			const errEl = resultsContainer.ownerDocument.createElement('span');
			errEl.classList.add('error');
			errEl.innerText = 'ERROR';

			const p = resultsContainer.ownerDocument.createElement('p');
			p.classList.add('content');
			p.innerHTML = value;

			p.prepend(errEl);
			valueContainer.appendChild(p);

			resultsContainer.scrollTop = resultsContainer.scrollHeight;
		} else if (res_type === 'stdout') {
			const listContentSeperator = generateRandomID();
			const objValueSeperator = generateRandomID();

			const sideToggleBar =
				circuitUIResEl.ownerDocument.createElement('div');
			sideToggleBar.classList.add('toggle-bar');
			sideToggleBar.onclick = TWS.handleToggleAllSubBlocks;

			valueWrapper.prepend(sideToggleBar);

			const callback = value => {
				window.requestIdleCallback(() =>
					handleInsertELementToCircuitUIResponseNode({
						value,
						resultsContainer,
						valueContainer,
					}),
				);
			};

			/**
			 * Infer if value can potentially require
			 * heavy parsing and is therefore more suitable for the worker process.
			 */
			if (!value.split('List[Method] = List(')[1]) {
				handleInsertELementToCircuitUIResponseNode({
					value,
					resultsContainer,
					valueContainer,
				});
			} else {
				const data = { value, listContentSeperator, objValueSeperator };
				TWS.workerPool.queue(worker =>
					worker
						.parseCircuitUIResponseValue(data)
						.subscribe(callback),
				);
			}
		}
	}
};

/**
 * Function to write to the query input
 * @param {*} refs
 */
export const handleWriteToCircuitUIInput = refs => {
	const input = refs.circuitUIRef.current.children[1].children[0];
	input.value = TWS.data_obj.data;
	input.setSelectionRange(
		TWS.data_obj.cursorPosition,
		TWS.data_obj.cursorPosition,
	);
	suggestSimilarQueries();
};

/**
 * Function to set terminal height
 * @param {Object} window
 * @param {Object} props
 * @returns a fixed terminal height or the maximum terminal height
 */
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
	}
	return { terminalHeight: '468px' };
};

/**
 * resizeHandler
 * @param {*} terminalHeight
 * @param {*} diff
 * @param {*} props
 * @param {*} window
 * @returns
 */
export const resizeHandler = (terminalHeight, diff, props, window) => {
	if (Number(terminalHeight.split('px')[0]) < 218 && diff < 0) {
		return { terminalHeight: 0 };
	}
	if (Number(terminalHeight.split('px')[0]) < 218 && diff > 0) {
		return { terminalHeight: '468px' };
	}
	if (
		Number(props.topNavHeight.split('px')[0]) +
			Number(props.statusBarHeight.split('px')[0]) +
			Number(terminalHeight.split('px')[0]) +
			50 <
		window.screen.height
	) {
		return { terminalHeight };
	}
};

/**
 * Add query to history
 * @param {*} queue
 */
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

/**
 * Send query result to Xterm
 * @param {*} results
 * @param {*} refs
 * @returns
 */
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
