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
	isElementScrolled,
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
	calculateSuggestionsPopoverMarginLeft,
	vars,
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
	const classes = useStyles(props);
	const commonClasses = useCommonStyles(props);

	const refs = {
		terminalRef: React.useRef(null),
		circuitUIRef: React.useRef(null),
		resizeEl: React.useRef(null),
		vListEl: React.useRef(null),
		suggestionsPopoverMarginLeftTrackerEl: React.useRef(null),
		suggestionsContainerEl: React.useRef(null),
		cacheRef: React.useRef(
			new CellMeasurerCache({
				minHeight: 0,
				defaultHeight: 50,
				fixedWidth: true,
			}),
		),
		rowsRenderedRef: React.useRef({}),
	};

	const [state, setState] = React.useState({
		scrolled: false,
	});

	const {
		terminalHeight,
		prefersTerminalView,
		isMaximized,
		query_suggestions,
		suggestion_dialog_open,
		circuit_ui_responses,
	} = props;
	const { scrolled } = state;

	const handleSetState = obj => {
		if (obj) {
			Promise.resolve(obj).then(obj => {
				setState(state => ({ ...state, ...obj }));
			});
		}
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
			el.scrollTop = el.scrollHeight;
		}
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
		props.handleSetState(
			handleMaximize(refs.terminalRef, props.isMaximized),
		);
	}, [props.isMaximized]);

	React.useEffect(() => {
		// verify that this useEffect is useful
		setTimeout(resize, 0);

		if (refs.terminalRef.current) {
			refs.terminalRef.current.style.height = props.terminalHeight;
		}
	}, [props.terminalHeight]);

	React.useEffect(() => {
		// eslint-disable-next-line no-undef
		const observer = new MutationObserver(() =>
			calculateSuggestionsPopoverMarginLeft(refs),
		);
		refs.suggestionsPopoverMarginLeftTrackerEl.current &&
			observer.observe(
				refs.suggestionsPopoverMarginLeftTrackerEl.current,
				{
					childList: true,
				},
			);
		return () =>
			refs.suggestionsPopoverMarginLeftTrackerEl.current &&
			observer.disconnect(
				refs.suggestionsPopoverMarginLeftTrackerEl.current,
			);
	}, [refs.suggestionsPopoverMarginLeftTrackerEl]);

	React.useEffect(() => {
		if (props.query_suggestions.length > 0 && !props.prefersTerminalView) {
			props.setSuggestionDialogOpen(true);
		} else {
			props.setSuggestionDialogOpen(false);
		}
	}, [props.query_suggestions]);

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
				(terminalHeight, diff, commit) => {
					const obj = resizeHandler(
						terminalHeight,
						diff,
						refs.terminalRef,
					);
					refs.terminalRef.current.style.height = obj.terminalHeight;

					if (commit || obj.terminalHeight === 0)
						props.handleSetState(obj);
				},
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
			<div
				className={clsx(classes.terminalControlContainerStyle, {
					[commonClasses.scrolledStyle]: scrolled,
				})}
			>
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
					onScroll={e =>
						handleSetState({ scrolled: isElementScrolled(e) })
					}
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
						shouldReturnFocusOnClose={true}
						placement="auto-end"
						interactionKind="click"
						minimal={true}
						isOpen={suggestion_dialog_open}
						onClose={() => props.setSuggestionDialogOpen(false)}
						className={classes.querySuggestionPopoverStyle}
						portalClassName={clsx(
							classes.querySuggestionPopoverPortalStyle,
							'query-suggestion-popover-portal',
						)}
						content={
							<div
								ref={refs.suggestionsContainerEl}
								className={clsx(
									classes.querySuggestionsStyle,
									commonClasses.scrollBarStyle,
									commonClasses.scrollBarDarkStyle,
								)}
							>
								{query_suggestions.map(
									(query_suggestion, index) => (
										<div
											tabIndex="0"
											autoFocus={
												index === 0 ? true : false
											}
											key={`${index}-${query_suggestion.suggestion}`}
											className={clsx(
												classes.querySuggestionStyle,
												{
													'query-suggestion-selected':
														index === 0
															? true
															: false,
												},
											)}
											onClick={e =>
												handleSuggestionClick(
													e,
													refs,
													props.term,
												)
											}
										>
											<Icon
												icon={query_suggestion.origin}
												className={
													classes.querySuggestionOriginIconStyle
												}
											/>

											{!vars.data
												? query_suggestion.suggestion
												: query_suggestion.suggestion
														.split(vars.data)
														.map((str, index) =>
															index === 0 ? (
																<span
																	className={
																		classes.querySuggestionMatchStyle
																	}
																	key={`${index}-${str}`}
																>
																	{vars.data}
																</span>
															) : (
																<span
																	key={`${index}-${str}`}
																>
																	{str}
																</span>
															),
														)}
										</div>
									),
								)}
							</div>
						}
					>
						<span
							id="suggestion-box-tracker"
							ref={refs.suggestionsPopoverMarginLeftTrackerEl}
						></span>
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
	suggestion_dialog_open: terminalSelectors.selectSuggestionDialogOpen(state),
	circuit_ui_responses: terminalSelectors.selectCircuitUiResponses(state),

	results: querySelectors.selectResults(state),
	queue: querySelectors.selectQueue(state),

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
	setSuggestionDialogOpen: bool =>
		dispatch(terminalActions.setSuggestionDialogOpen(bool)),
	setSettings: values => dispatch(settingsActions.setSettings(values)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TerminalWindow);
