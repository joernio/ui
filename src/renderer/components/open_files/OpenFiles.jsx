import React from 'react';
import clsx from 'clsx';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Icon } from '@blueprintjs/core';
import * as filesSelectors from '../../store/selectors/filesSelectors';
import * as settingsSelectors from '../../store/selectors/settingsSelectors';
import * as workSpaceSelectors from '../../store/selectors/workSpaceSelectors';
import {
	openFile,
	closeFile,
	isElementScrolled,
	discardDialogHandler,
	openSyntheticFile,
} from '../../assets/js/utils/scripts';
import { syntheticFiles } from '../../assets/js/utils/defaultVariables';
import styles from '../../assets/js/styles/components/open_files/openFilesStyles';
import {
	getEditorFilesFromOpenFiles,
	handleToggleFilesVisible,
} from './openFilesScripts';
import commonStyles from '../../assets/js/styles';

const useStyles = makeStyles(styles);
const useCommonStyles = makeStyles(commonStyles);

function OpenFiles(props) {
	const filesContainerEl = React.useRef(null);
	const classes = useStyles(props);
	const commonClasses = useCommonStyles(props);

	const [state, setState] = React.useState({
		files: {},
		filesVisible: true,
		scrolled: false,
	});

	const handleSetState = obj => {
		if (obj) {
			Promise.resolve(obj).then(obj => {
				setState(state => ({ ...state, ...obj }));
			});
		}
	};

	React.useEffect(() => {
		if (props.openFiles) {
			const files = getEditorFilesFromOpenFiles(props.openFiles);
			handleSetState({ files: files || {} });
		}
	}, [props.openFiles]);

	React.useEffect(() => {
		const callback = e =>
			handleSetState({ scrolled: isElementScrolled(e) });

		if (filesContainerEl.current) {
			filesContainerEl.current.addEventListener('scroll', callback);

			return () =>
				filesContainerEl.current &&
				filesContainerEl.current.removeEventListener(
					'scroll',
					callback,
				);
		}
	}, [filesContainerEl.current]);

	const { files, filesVisible, scrolled } = state;

	const { openFiles } = props;

	return Object.keys(props.projects).length > 0 ? (
		<div className={classes.rootStyle} tabIndex="0" data-test="open-files">
			<div
				className={classes.titleSectionStyle}
				onClick={() =>
					handleSetState(handleToggleFilesVisible(filesVisible))
				}
			>
				{filesVisible ? (
					<Icon
						className={commonClasses.iconStyle}
						icon="chevron-down"
					/>
				) : (
					<Icon
						className={commonClasses.iconStyle}
						icon="chevron-right"
					/>
				)}
				<h2 className={classes.titleStyle}>Open Editor</h2>
			</div>
			<div
				ref={filesContainerEl}
				className={clsx(
					classes.filesSectionStyle,
					commonClasses.scrollBarStyle,
					commonClasses.scrollBarDarkStyle,

					{
						[classes.insetScrolledStyle]: scrolled,
					},
					{
						[classes.filesVisible]: filesVisible,
						[classes.filesHidden]: !filesVisible,
					},
				)}
			>
				{filesVisible && files
					? Object.keys(files).map((path, idx) => {
							let filename = path.split('/');
							filename = filename[filename.length - 1];
							return (
								<div
									key={`${idx}-${filename}`}
									className={classes.fileSectionStyle}
									tabIndex="0"
								>
									<h3
										className={classes.fileNameStyle}
										key={path}
										onClick={() =>
											discardDialogHandler(() => {
												syntheticFiles.filter(type =>
													path.endsWith(type),
												).length > 0
													? openSyntheticFile(
															path,
															openFiles[path],
													  )
													: openFile(path);
											})
										}
									>
										{filename}
									</h3>

									{files[path] === false ? (
										<Icon
											icon="dot"
											className={clsx(
												'unsaved-icon',
												commonClasses.iconStyle,
											)}
										/>
									) : null}

									<Icon
										icon="small-cross"
										className={clsx(
											commonClasses.iconStyle,
											{
												'unsaved-cross-icon':
													files[path] === false,
											},
										)}
										onClick={() =>
											discardDialogHandler(() => {
												closeFile(path);
											})
										}
									/>
								</div>
							);
					  })
					: null}
			</div>
		</div>
	) : null;
}

const mapStateToProps = state => ({
	openFiles: filesSelectors.selectOpenFiles(state),
	projects: workSpaceSelectors.selectProjects(state),
	prefersDarkMode: settingsSelectors.selectPrefersDarkMode(state),
});

export default connect(mapStateToProps, null)(OpenFiles);
