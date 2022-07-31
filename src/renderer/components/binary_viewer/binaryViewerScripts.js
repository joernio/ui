export const vars = {
	tempMethods: [],
	tempMethodsNameIndexMapping: {},
	initQuerySent: false,
};

export const editorDidMount = (_, monaco) => {
	monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
		noSemanticValidation: true,
		noSyntaxValidation: true,
	});
};

export const methodBinaryQuery = name => {
	const query = {
		query: `cpg.method.name("${name}").call.code.p`,
		origin: 'workspace',
		ignore: false,
	};
	return query;
};

export const getMethodBinary = binaryViewerCache => {
	const methodName =
		binaryViewerCache.methods[binaryViewerCache.selectedMethodIndex]?.value
			.name;
	return binaryViewerCache.methodBinaries[methodName] || '';
};

export const getDecompiledMethods = methods => {
	const content = methods
		.map(method => method.value.code)
		.toString()
		.replaceAll(/(("","")|("",)|(""))\n?/gi, '\n');
	return content.replaceAll(/<empty>,?/gi, '<empty>\n');
};

export const getDefaultMethodContainerHeight = el => {
	if (el) {
		return `${el.getBoundingClientRect().height / 2}px`;
	} else {
		return '0px';
	}
};

export const filterMethods = (value, filtered_methods) => {
	filtered_methods = filtered_methods?.filter(
		method =>
			!method.value.code.includes('halt_baddata()') &&
			(value === undefined || method.value.name.startsWith(value)),
	);
	return { filtered_methods: filtered_methods || [] };
};

export const getMethodPositionInDecompiledMethodsEditor = (
	editor,
	binaryViewerCache,
) => {
	let code = binaryViewerCache.methods[
		binaryViewerCache.selectedMethodIndex
	]?.value.code
		.replaceAll('""', '')
		.trim();
	if (code) {
		code = code.split(/\n/);
		const str_to_search = code[0].startsWith('/*') ? code[1] : code[0];
		const range =
			editor._modelData.model.findMatches(str_to_search)[0].range; // eslint-disable-line no-underscore-dangle
		range.startLineNumber = code[0].startsWith('/*')
			? range.startLineNumber - 1
			: range.startLineNumber;
		range.endLineNumber = range.startLineNumber + code.length - 1;
		return range;
	}
};

export const customScrollToIndex = obj => {
	const { vList, prev_rows_rendered, scroll_to_index, el } = obj;
	if (
		vList.current &&
		prev_rows_rendered !== undefined &&
		prev_rows_rendered.startIndex === undefined &&
		el &&
		scroll_to_index
	) {
		const scrollTop = vList.current.getOffsetForRow({
			alignment: 'center',
			index: scroll_to_index,
		});

		/**
		 * Both scrollTop and scrollToPosition must be called for this to work.
		 * This is a hack so if you have a better option then 🤷‍♂️
		 * */
		el.scrollTop = scrollTop;
		vList.current.scrollToPosition(scrollTop);
	}
};

export const widthResizeHandler = (
	methodSearchDrawerWidth,
	diff,
	methodSearchDrawerEl,
) => {
	if (
		methodSearchDrawerWidth &&
		typeof methodSearchDrawerWidth === 'string'
	) {
		if (Number(methodSearchDrawerWidth.split('px')[0]) < 100) {
			if (diff < 0) {
				methodSearchDrawerWidth = 0;
			} else if (diff > 0) {
				methodSearchDrawerWidth = '100px';
			}
		} else if (
			methodSearchDrawerEl?.current &&
			Number(methodSearchDrawerWidth.split('px')[0]) + 5 >=
				methodSearchDrawerEl.current.parentElement.getBoundingClientRect()
					.width
		) {
			if (diff > 0) {
				methodSearchDrawerWidth = `${
					methodSearchDrawerEl.current.parentElement.getBoundingClientRect()
						.width - 5
				}px`;
			}
		}
	}

	return { methodSearchDrawerWidth };
};

export const heightResizeHandler = (
	methodContainerHeight,
	diff,
	methodContainerEl,
) => {
	const parentElementDimension =
		methodContainerEl.current.parentElement.getBoundingClientRect();

	if (
		!methodContainerHeight ||
		typeof methodContainerHeight !== 'string' ||
		Number(methodContainerHeight.split('px')[0]) < 200
	) {
		methodContainerHeight = '200px';
	} else if (
		diff > 0 &&
		methodContainerEl?.current &&
		Number(methodContainerHeight.split('px')[0]) + 5 >=
			parentElementDimension.height
	) {
		methodContainerHeight = `${parentElementDimension.height - 5}px`;
	}

	const binaryContainerHeight = `${
		parentElementDimension.height -
		Number(methodContainerHeight.split('px')[0])
	}px`;

	return { methodContainerHeight, binaryContainerHeight };
};
