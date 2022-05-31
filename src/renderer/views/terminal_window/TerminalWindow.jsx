import React from 'react';
import clsx from 'clsx';
import { connect } from 'react-redux';
import {
	CellMeasurer,
	WindowScroller,
	CellMeasurerCache,
	List,
} from 'react-virtualized';
import 'xterm/css/xterm.css';
import { makeStyles } from '@material-ui/core';
import { Icon } from '@blueprintjs/core';
import { Popover2 } from '@blueprintjs/popover2';
import UiQuery from '../../components/ui_query/UiQuery';
import UiQueryResponse from '../../components/ui_query_response/UiQueryResponse';
import { store } from '../../store/configureStore';
import * as terminalActions from '../../store/actions/terminalActions';
import * as settingsActions from '../../store/actions/settingsActions';
import * as terminalSelectors from '../../store/selectors/terminalSelectors';
import * as settingsSelectors from '../../store/selectors/settingsSelectors';
import * as querySelectors from '../../store/selectors/querySelectors';
import * as statusSelectors from '../../store/selectors/statusSelectors';
import * as workSpaceSelectors from '../../store/selectors/workSpaceSelectors';
import styles from '../../assets/js/styles/views/terminal/terminalStyles';
import {
	initResize,
	throttle,
	areResultsEqual,
	deepClone,
} from '../../assets/js/utils/scripts';
import {
	initXterm,
	initCircuitUI,
	initFitAddon,
	handleResize,
	handleMaximize,
	resizeHandler,
	openXTerm,
	sendQueryResultToXTerm,
	handleTerminalMaximizeToggle,
	handleAddQueryToHistory,
	handleEmptyWorkspace,
	handleSuggestionClick,
	handleToggleAllBlocks,
} from './terminalWindowScripts';
import commonStyles from '../../assets/js/styles';

const useStyles = makeStyles(styles);
const useCommonStyles = makeStyles(commonStyles);

export const rowRenderer = obj => {
	const {
		key, // Unique key within array of rows
		index, // Index of row within collection
		parent,
		// eslint-disable-next-line no-unused-vars
		isScrolling, // The List is currently being scrolled
		// eslint-disable-next-line no-unused-vars
		isVisible, // This row is visible within the List (eg it is not an overscanned row)
		// eslint-disable-next-line no-unused-vars
		style, // Style object to be applied to row (to position it)
	} = obj;

	const { refs, circuit_ui_responses } = store.getState().terminal;

	const item = circuit_ui_responses.indexes[index];

	return (
		<CellMeasurer
			cache={refs.cacheRef.current}
			columnIndex={0}
			key={key}
			parent={parent}
			rowIndex={index}
		>
			{({ measure, registerChild }) => {
				if (item.res_type === 'query') {
					return (
						<UiQuery
							cache={refs.cacheRef.current}
							vList={refs.vListEl.current}
							rowsRendered={refs.rowsRenderedRef.current}
							measure={measure}
							item={item}
							registerChild={registerChild}
							{...obj}
						/>
					);
					// eslint-disable-next-line no-else-return
				} else {
					return (
						<UiQueryResponse
							cache={refs.cacheRef.current}
							vList={refs.vListEl.current}
							rowsRendered={refs.rowsRenderedRef.current}
							measure={measure}
							item={item}
							registerChild={registerChild}
							{...obj}
						/>
					);
				}
			}}
		</CellMeasurer>
	);
};

function TerminalWindow(props) {
	const { terminalHeight } = props;
	const { isMaximized, query_suggestions, circuit_ui_responses } = props;
	const { prefersTerminalView } = props;

	const classes = useStyles(props);
	const commonClasses = useCommonStyles(props);

	const refs = {
		terminalRef: React.useRef(null),
		circuitUIRef: React.useRef(null),
		resizeEl: React.useRef(null),
		vListEl: React.useRef(null),
		cacheRef: React.useRef(
			new CellMeasurerCache({
				minHeight: 0,
				defaultHeight: 50,
				fixedWidth: true,
			}),
		),
		rowsRenderedRef: React.useRef({}),
	};

	const resize = () => {
		window.requestIdleCallback(() => handleResize(props.fitAddon));
	};

	React.useEffect(() => {
		(async () => {
			props.setTerm(await initXterm(props.prefersDarkMode));
			props.setRefs(refs);
		})();
	}, []);

	React.useEffect(() => {
		const el = refs.circuitUIRef.current?.children[0];

		if (el) {
			setTimeout(() => {
				el.scrollTop = el.scrollHeight;
			}, 0);
		}

		/**
		 * HACK
		 * For some reason, props.circuit_ui_responses object doesn't get updated
		 * as fast as store is in some scenarios and as a result,
		 * useEffect doesn't get triggered as often as it should so we can trigger scroll.
		 * Here we deliberately subscribe to store and manually perform some checks
		 * before deciding if we are to scroll or not.
		 * THIS IS A HACK, THERE SHOULD BE A BETTER SOLUTION.
		 */
		const unsubscribe = store.subscribe(() => {
			const new_circuit_ui_responses =
				store.getState().terminal.circuit_ui_responses;
			const rowCount = refs.vListEl.current?.props.rowCount;

			if (el && new_circuit_ui_responses.length !== rowCount) {
				setTimeout(() => {
					el.scrollTop = el.scrollHeight;
				}, 0);
			}
		});

		return unsubscribe;
	}, [circuit_ui_responses.length]);

	React.useEffect(() => {
		props.setIsMaximized(
			handleEmptyWorkspace(props.projects, props.prev_projects),
		);
		props.setPrevProjects({
			prev_projects: props.projects ? deepClone(props.projects) : {},
		});
	}, [props.projects]);

	React.useEffect(() => {
		if (refs.terminalRef.current && props.term) {
			openXTerm(refs, props.term);
			props.setFitAddon(initFitAddon(props.term));
			window.addEventListener('resize', resize);

			return () => window && window.removeEventListener('resize', resize);
		}
	}, [refs.terminalRef, props.term]);

	React.useEffect(() => {
		if (refs.circuitUIRef.current) {
			return initCircuitUI(refs);
		}
	}, [refs.circuitUIRef]);

	React.useEffect(() => {
		const observer = new ResizeObserver(throttle(resize, 50));
		refs.terminalRef.current && observer.observe(refs.terminalRef.current);

		return () =>
			refs.terminalRef.current &&
			observer.unobserve(refs.terminalRef.current);
	}, [props.fitAddon]);

	React.useEffect(() => {
		if (props.term) {
			props.term.setOption('theme', {
				background: props.prefersDarkMode ? '#000000' : '#ffffff',
				foreground: props.prefersDarkMode ? '#ffffff' : '#000000',
				cursorAccent: props.prefersDarkMode ? '#ffffff' : '#000000',
				cursor: props.prefersDarkMode ? '#ffffff' : '#000000',
			});

			props.term.setOption(
				'fontSize',
				props?.fontSize ? Number(props.fontSize.split('px')[0]) : 16,
			);
		}
	}, [props.prefersDarkMode, props.fontSize]);

	React.useEffect(() => {
		props.handleSetState(handleMaximize(window, props));
	}, [props.isMaximized]);

	React.useEffect(() => {
		setTimeout(resize, 500);
	}, [props.terminalHeight]);

	React.useEffect(() => {
		if (props?.queue && Object.keys(props.queue).length) {
			handleAddQueryToHistory(props.queue);
		}
	}, [props.queue]);

	React.useEffect(() => {
		(async () => {
			if (props?.results) {
				const bool = areResultsEqual(props.prev_results, props.results);
				const wroteToTerminal =
					!bool &&
					(await sendQueryResultToXTerm(props.results, refs));

				wroteToTerminal && props.setPrevResults(props.results);
			}
		})();
	}, [props.results]);

	React.useEffect(() => {
		if (refs.resizeEl.current) {
			const callback = initResize(
				refs.resizeEl.current,
				'row',
				(terminalHeight, diff) =>
					props.handleSetState(
						resizeHandler(terminalHeight, diff, props, window),
					),
			);
			return () => {
				refs.resizeEl.current &&
					refs.resizeEl.current.removeEventListener(
						'mousedown',
						callback,
					);
			};
		}
	}, [refs.resizeEl.current]);

	return (
		<div
			ref={refs.terminalRef}
			className={clsx(
				classes.terminalStyle,
				commonClasses.scrollBarStyle,
				{
					[classes.terminalOpen]: terminalHeight,
					[classes.terminalClose]: !terminalHeight,
				},
			)}
			data-test="terminal-window"
		>
			<div
				ref={refs.resizeEl}
				className={classes.resizeHandleStyle}
			></div>
			<div className={classes.terminalControlContainerStyle}>
				{prefersTerminalView ? (
					<Icon
						icon="application"
						className={classes.terminalControlItemsStyle}
						onClick={() =>
							props.setSettings({
								prefersTerminalView: !prefersTerminalView,
							})
						}
					/>
				) : (
					<Icon
						icon="console"
						className={classes.terminalControlItemsStyle}
						onClick={() =>
							props.setSettings({
								prefersTerminalView: !prefersTerminalView,
							})
						}
					/>
				)}

				<Icon
					icon="minus"
					className={classes.terminalControlItemsStyle}
					onClick={() => props.handleSetState({ terminalHeight: 0 })}
				/>

				{isMaximized ? (
					<Icon
						icon="minimize"
						className={classes.terminalControlItemsStyle}
						onClick={() =>
							props.setIsMaximized(
								handleTerminalMaximizeToggle(isMaximized),
							)
						}
					/>
				) : (
					<Icon
						icon="maximize"
						className={classes.terminalControlItemsStyle}
						onClick={() =>
							props.setIsMaximized(
								handleTerminalMaximizeToggle(isMaximized),
							)
						}
					/>
				)}
			</div>
			<div ref={refs.circuitUIRef} className={classes.circuitUIStyle}>
				<div
					className={clsx(commonClasses.scrollBarStyle)}
					id="circuit-ui-results-container"
				>
					<div id="circuit-ui-welcome-screen-container">
						<h1>CPG Explorer</h1>
						<p>Let&apos;s Explore</p>
						<p>
							{!props.connected
								? 'Waiting for CPG server connection...'
								: Object.keys(props.projects).length < 1
								? 'Click on File -> Import File / Import Directory to begin importing your code'
								: 'Start writing some queries below. Type "help" for more instructions'}
						</p>
					</div>
					<div id="circuit-ui-results-and-toggler">
						<div
							data-blocks-collapsed
							className="toggle-bar"
							onClick={() =>
								handleToggleAllBlocks(
									refs.cacheRef.current,
									refs.vListEl.current,
								)
							}
						></div>
						<div id="circuit-ui-results">
							<WindowScroller
								scrollElement={
									refs.circuitUIRef.current?.children[0]
								}
							>
								{({
									height,
									isScrolling,
									onChildScroll,
									scrollTop,
								}) => (
									<List
										ref={refs.vListEl}
										autoHeight
										height={height}
										isScrolling={isScrolling}
										onScroll={onChildScroll}
										width={
											refs.circuitUIRef.current
												?.children[0].offsetWidth
										}
										rowCount={circuit_ui_responses.length}
										onRowsRendered={obj => {
											refs.rowsRenderedRef.current = obj;
										}}
										deferredMeasurementCache={
											refs.cacheRef.current
										}
										rowHeight={
											refs.cacheRef.current.rowHeight
										}
										rowRenderer={rowRenderer}
										scrollTop={scrollTop}
									/>
								)}
							</WindowScroller>
						</div>
					</div>
				</div>
				<div id="circuit-ui-input-container">
					<input type="text" placeholder="▰  query" />
					<button>Run Query ↵</button>
					<Popover2
						className={classes.querySelectionTooltipStyle}
						portalClassName={
							classes.querySelectionToolTipPortalStyle
						}
						content={
							<div
								className={clsx(
									classes.querySuggestionsStyle,
									commonClasses.scrollBarStyle,
									commonClasses.scrollBarDarkStyle,
								)}
							>
								{query_suggestions.map(
									(query_suggestion, idx) => (
										<div
											key={`${idx}-${query_suggestion}`}
											className={
												classes.querySuggestionStyle
											}
											onClick={e =>
												handleSuggestionClick(
													e,
													refs,
													props.term,
												)
											}
										>
											{query_suggestion}
										</div>
									),
								)}
							</div>
						}
						placement="right-end"
						interactionKind="click"
						minimal={true}
						isOpen={
							query_suggestions.length > 0 && !prefersTerminalView
						}
					>
						<span id="suggestion-box-tracker"></span>
					</Popover2>
				</div>
			</div>
		</div>
	);
}

const mapStateToProps = state => ({
	term: terminalSelectors.selectTerm(state),
	fitAddon: terminalSelectors.selectFitAddon(state),
	prev_results: terminalSelectors.selectPrevResults(state),
	prev_projects: terminalSelectors.selectPrevProjects(state),
	isMaximized: terminalSelectors.selectIsMaximized(state),
	query_suggestions: terminalSelectors.selectQuerySuggestions(state),
	circuit_ui_responses: terminalSelectors.selectCircuitUiResponses(state),

	results: querySelectors.selectResults(state),
	queue: querySelectors.selectQuery(state),

	projects: workSpaceSelectors.selectProjects(state),

	connected: statusSelectors.selectConnected(state),

	prefersDarkMode: settingsSelectors.selectPrefersDarkMode(state),
	prefersTerminalView: settingsSelectors.selectPrefersTerminalView(state),
	fontSize: settingsSelectors.selectFontSize(state),
});

const mapDispatchToProps = dispatch => ({
	setTerm: term => dispatch(terminalActions.setTerm(term)),
	setRefs: refs => dispatch(terminalActions.setRefs(refs)),
	setFitAddon: fit_addon => dispatch(terminalActions.setFitAddon(fit_addon)),
	setPrevResults: prev_results =>
		dispatch(terminalActions.setPrevResults(prev_results)),
	setPrevProjects: prev_projects =>
		dispatch(terminalActions.setPrevProjects(prev_projects)),
	setIsMaximized: obj => dispatch(terminalActions.setIsMaximized(obj)),
	setSettings: values => dispatch(settingsActions.setSettings(values)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TerminalWindow);
