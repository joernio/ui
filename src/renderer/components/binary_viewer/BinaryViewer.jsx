import React from 'react';
import MonacoEditor from 'react-monaco-editor';
import clsx from 'clsx';
import { connect } from 'react-redux';
import {
	CellMeasurer,
	WindowScroller,
	CellMeasurerCache,
	List,
} from 'react-virtualized';
import { makeStyles } from '@material-ui/core';
import { Icon } from '@blueprintjs/core';
import { Tooltip2 } from '@blueprintjs/popover2';
import * as filesSelectors from '../../store/selectors/filesSelectors';
import * as statusSelectors from '../../store/selectors/statusSelectors';
import * as settingsSelectors from '../../store/selectors/settingsSelectors';
import * as filesActions from '../../store/actions/filesActions';
import * as queryActions from '../../store/actions/queryActions';
import {
	vars,
	widthResizeHandler,
	heightResizeHandler,
	filterMethods,
	editorDidMount,
	getDecompiledMethods,
	getMethodBinary,
	methodBinaryQuery,
	getDefaultMethodContainerHeight,
	customScrollToIndex,
	getMethodPositionInDecompiledMethodsEditor,
} from './binaryViewerScripts';
import {
	initResize,
	isElementScrolled,
	addToQueue,
	handleEditorGoToLineAndHighlight,
} from '../../assets/js/utils/scripts';
import styles from '../../assets/js/styles/components/binary_viewer/binaryViewerStyles';
import commonStyles from '../../assets/js/styles';

const useCommonStyles = makeStyles(commonStyles);
const useStyles = makeStyles(styles);

const cache = new CellMeasurerCache({
	minHeight: 0,
	defaultHeight: 50,
	fixedWidth: true,
});

function BinaryViewer(props) {
	const refs = {
		methodSearchDrawerEl: React.useRef(null),
		methodSearchResizeEl: React.useRef(null),
		methodSearchInputEl: React.useRef(null),
		methodSearchResultEl: React.useRef(null),
		methodContainerEl: React.useRef(null),
		binaryContainerEl: React.useRef(null),
		methodContainerResizeEl: React.useRef(null),
		decompiledBinaryEditorEl: React.useRef(null),
		vListEl: React.useRef(null),
	};

	const [state, setState] = React.useState({
		methodSearchDrawerWidth: '250px',
		methodContainerHeight: '0px',
		scrolled: false,
		filtered_methods: [],
		loading_methods: true,
		rows_rendered: {},
	});

	const handleSetState = obj => {
		if (obj) {
			Promise.resolve(obj).then(obj => {
				setState(state => ({ ...state, ...obj }));
			});
		}
	};

	const {
		methodSearchDrawerWidth,
		methodContainerHeight,
		scrolled,
		filtered_methods,
		loading_methods,
		rows_rendered,
	} = state;
	const { binaryViewerCache } = props;

	const classes = useStyles({ ...props, methodContainerHeight });
	const commonClasses = useCommonStyles(props);

	React.useEffect(() => {
		const filtered_methods = filterMethods(
			refs.methodSearchInputEl.current?.value,
			binaryViewerCache.methods,
		);
		const loading_methods = !binaryViewerCache.methods?.length
			? true
			: false;
		handleSetState({ ...filtered_methods, loading_methods });
		props.windowViewHandleSetState({ terminalHeight: '218px' });

		refs.decompiledBinaryEditorEl.current?.editor &&
			handleEditorGoToLineAndHighlight(
				refs.decompiledBinaryEditorEl.current.editor,
				binaryViewerCache.textSelectionRange,
			);

		if (
			!binaryViewerCache.methods?.length &&
			props.connected &&
			!vars.initQuerySent
		) {
			const query = {
				query: 'cpg.method.l',
				origin: 'workspace',
				ignore: false,
			};
			addToQueue(query);
			vars.initQuerySent = true; // ensure that this query doesn't run again, even when user switches tab.
		}

		if (binaryViewerCache?.selectedMethodIndex !== null) {
			handleSetState({
				methodContainerHeight: getDefaultMethodContainerHeight(
					refs.methodSearchDrawerEl.current,
				),
			});
			const range =
				refs.decompiledBinaryEditorEl.current?.editor &&
				getMethodPositionInDecompiledMethodsEditor(
					refs.decompiledBinaryEditorEl.current.editor,
					binaryViewerCache,
				);
			if (
				range?.startLineNumber !==
					binaryViewerCache.textSelectionRange?.startLine &&
				range?.endLineNumber !==
					binaryViewerCache.textSelectionRange?.endLine
			) {
				range &&
					props.setBinaryViewerCache({
						...binaryViewerCache,
						textSelectionRange: {
							startLine: range.startLineNumber,
							endLine: range.endLineNumber,
						},
					});

				const methodBinary = getMethodBinary(binaryViewerCache);
				if (!methodBinary) {
					addToQueue(
						methodBinaryQuery(
							binaryViewerCache.methods[
								binaryViewerCache.selectedMethodIndex
							].value.name,
						),
					);
				}
			}
		} else {
			handleSetState({ methodContainerHeight: '0px' });
		}
	}, [binaryViewerCache]);

	React.useEffect(() => {
		if (refs.methodSearchDrawerEl.current) {
			refs.methodSearchDrawerEl.current.style.width =
				methodSearchDrawerWidth;
		}
	}, [methodSearchDrawerWidth]);

	React.useEffect(() => {
		let methodSearchResizeCallback = () => {};
		let methodContainerResizeCallback = () => {};

		if (refs.methodSearchResizeEl.current) {
			methodSearchResizeCallback = initResize(
				refs.methodSearchResizeEl.current,
				'col',
				(methodSearchDrawerWidth, diff, commit) => {
					const obj = widthResizeHandler(
						methodSearchDrawerWidth,
						diff,
						refs.methodSearchDrawerEl,
					);
					refs.methodSearchDrawerEl.current.style.width =
						obj.methodSearchDrawerWidth;

					if (commit || obj.methodSearchDrawerWidth === 0)
						handleSetState(obj);
				},
			);
		}

		if (refs.methodContainerResizeEl.current) {
			methodContainerResizeCallback = initResize(
				refs.methodContainerResizeEl.current,
				'row',
				(methodContainerHeight, diff, commit) => {
					const obj = heightResizeHandler(
						methodContainerHeight,
						diff,
						refs.methodContainerEl,
					);
					refs.methodContainerEl.current.style.height =
						obj.methodContainerHeight;
					if (commit) handleSetState(obj);
				},
			);
		}

		return () => {
			refs.methodSearchResizeEl.current &&
				refs.methodSearchResizeEl.current.removeEventListener(
					'mousedown',
					methodSearchResizeCallback,
				);
			refs.methodContainerResizeEl.current &&
				refs.methodContainerResizeEl.current.removeEventListener(
					'mousedown',
					methodContainerResizeCallback,
				);
		};
	}, []);

	const options = {
		selectOnLineNumbers: true,
		roundedSelection: false,
		readOnly: true,
		cursorStyle: 'line',
		automaticLayout: true,
		fontSize: props.fontSize ? Number(props.fontSize.split('px')[0]) : 16,
	};

	return (
		<div className={clsx(classes.rootStyle)} data-test="binary-viewer">
			<div
				ref={refs.methodSearchDrawerEl}
				className={clsx(classes.methodSearchDrawerStyle, {
					[classes.methodSearchDrawerOpenStyle]:
						methodSearchDrawerWidth,
					[classes.methodSearchDrawerCloseStyle]:
						!methodSearchDrawerWidth,
				})}
			>
				<div
					ref={refs.methodSearchResizeEl}
					className={clsx(
						classes.methodSearchDrawerResizeHandleStyle,
					)}
				></div>
				<div
					className={clsx(
						commonClasses.cursorPointer,
						classes.methodSearchClosedTooltipContainerStyle,
						{
							[commonClasses.displayNone]:
								!!methodSearchDrawerWidth,
						},
					)}
					onClick={() =>
						handleSetState({ methodSearchDrawerWidth: '250px' })
					}
				>
					<Tooltip2
						popoverClassName={commonClasses.toolTipStyle}
						content={
							<span className={commonClasses.toolTipTextStyle}>
								expand methods drawer
							</span>
						}
						placement="right"
						usePortal={false}
						openOnTargetFocus={false}
					>
						<Icon
							icon="menu-open"
							iconSize={25}
							className={commonClasses.iconStyle}
						/>
					</Tooltip2>
				</div>
				<div
					className={clsx(classes.methodSearchContainerStyle, {
						[commonClasses.displayNone]: !methodSearchDrawerWidth,
					})}
				>
					{loading_methods ? (
						<div className={classes.loadingContainerStyle}>
							<Icon
								icon="refresh"
								iconSize={40}
								className={clsx(
									classes.loadingIconStyle,
									'refresh-icon-animation',
								)}
							/>
							<h4>Creating Decompiled Methods List ...</h4>
							<p>
								This might take a while but will be cached for
								subsequent use
							</p>
						</div>
					) : (
						<>
							<div
								className={clsx(
									classes.methodSearchInputContainerStyle,
								)}
							>
								<input
									className={classes.methodSearchInputStyle}
									ref={refs.methodSearchInputEl}
									id="binary-method-search-input"
									type="text"
									placeholder="Filter methods"
									onChange={e =>
										handleSetState(
											filterMethods(
												e.target.value,
												binaryViewerCache.methods,
											),
										)
									}
								/>
							</div>
							<div
								ref={refs.methodSearchResultEl}
								className={clsx(
									classes.methodSearchResultContainerStyle,
									commonClasses.scrollBarStyle,
									commonClasses.scrollBarDarkStyle,
									{
										[commonClasses.insetScrolledStyle]:
											scrolled,
									},
								)}
								onScroll={e =>
									handleSetState({
										scrolled: isElementScrolled(e),
									})
								}
							>
								{filtered_methods.length === 0 ? (
									<div className={classes.noResultStyle}>
										<Icon icon="issue" iconSize={40} />
										<h3>No Search Result</h3>
									</div>
								) : (
									<WindowScroller
										scrollElement={
											refs.methodSearchResultEl.current
										}
										key={
											!!refs.methodSearchResultEl.current
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
													refs.methodSearchResultEl
														.current?.offsetWidth
												}
												rowCount={
													filtered_methods.length
												}
												deferredMeasurementCache={cache}
												rowHeight={cache.rowHeight}
												scrollTop={scrollTop}
												onRowsRendered={obj => {
													customScrollToIndex({
														vList: refs.vListEl,
														prev_rows_rendered:
															rows_rendered,
														scroll_to_index:
															binaryViewerCache.selectedMethodIndex,
														el: refs
															.methodSearchResultEl
															.current,
													});
													!rows_rendered?.stopIndex &&
														handleSetState({
															rows_rendered: obj,
														});
												}}
												rowRenderer={obj => (
													<CellMeasurer
														cache={cache}
														columnIndex={0}
														key={obj.key}
														parent={obj.parent}
														rowIndex={obj.index}
													>
														{({
															registerChild,
														}) => (
															<h3
																className={clsx(
																	classes.methodNameStyle,
																	{
																		[classes.methodNameFocusedStyle]:
																			filtered_methods[
																				obj
																					.index
																			]
																				.index ===
																			binaryViewerCache.selectedMethodIndex,
																	},
																)}
																id={`method-${
																	filtered_methods[
																		obj
																			.index
																	].index
																}`}
																ref={
																	registerChild
																}
																style={
																	obj.style
																}
																tabIndex={0}
																onClick={() => {
																	props.setBinaryViewerCache(
																		{
																			...binaryViewerCache,
																			selectedMethodIndex:
																				filtered_methods[
																					obj
																						.index
																				]
																					.index,
																		},
																	);
																}}
															>
																{
																	filtered_methods[
																		obj
																			.index
																	].value.name
																}
															</h3>
														)}
													</CellMeasurer>
												)}
											/>
										)}
									</WindowScroller>
								)}
							</div>
						</>
					)}
				</div>
			</div>
			<div className={clsx(classes.binaryEditorsContainerStyle)}>
				{!binaryViewerCache?.methods.length ? (
					<Icon
						icon="refresh"
						iconSize={40}
						className={clsx(
							classes.loadingIconStyle,
							classes.loadingIconAbsolutePositionStyle,
							'refresh-icon-animation',
						)}
					/>
				) : (
					<>
						<div
							ref={refs.binaryContainerEl}
							className={clsx(classes.binaryContainerStyle)}
						>
							<MonacoEditor
								ref={refs.decompiledBinaryEditorEl}
								width="100%"
								height="100%"
								theme={
									props.prefersDarkMode
										? 'vs-dark'
										: 'vs-light'
								}
								language="typescript"
								value={getDecompiledMethods(
									binaryViewerCache.methods,
								)}
								options={options}
								editorDidMount={editorDidMount}
							/>
						</div>
						<div
							ref={refs.methodContainerEl}
							className={clsx(classes.methodContainerStyle, {
								[classes.methodContainerOpenStyle]:
									methodContainerHeight,
								[commonClasses.displayNone]:
									methodContainerHeight === '0px',
							})}
						>
							<div
								ref={refs.methodContainerResizeEl}
								className={clsx(
									classes.methodContainerResizeHandleStyle,
								)}
							></div>
							{!getMethodBinary(binaryViewerCache) ? (
								<Icon
									icon="refresh"
									iconSize={40}
									className={clsx(
										classes.loadingIconStyle,
										classes.loadingIconAbsolutePositionStyle,
										'refresh-icon-animation',
									)}
								/>
							) : (
								<MonacoEditor
									ref={refs.methodBinaryEditorEl}
									width="100%"
									height="100%"
									theme={
										props.prefersDarkMode
											? 'vs-dark'
											: 'vs-light'
									}
									language="typescript"
									value={getMethodBinary(binaryViewerCache)}
									options={options}
									editorDidMount={editorDidMount}
								/>
							)}
						</div>
					</>
				)}
			</div>
		</div>
	);
}

const mapStateToProps = state => ({
	binaryViewerCache: filesSelectors.selectBinaryViewerCache(state),
	prefersDarkMode: settingsSelectors.selectPrefersDarkMode(state),
	connected: statusSelectors.selectConnected(state),
});

const mapDispatchToProps = dispatch => ({
	setBinaryViewerCache: cache => {
		dispatch(filesActions.setBinaryViewerCache(cache));
	},
	peekQueue: () => dispatch(queryActions.peekQueue()),
});

export default connect(mapStateToProps, mapDispatchToProps)(BinaryViewer);
