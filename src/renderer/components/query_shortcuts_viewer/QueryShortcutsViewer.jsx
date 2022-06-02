import React from 'react';
import { connect } from 'react-redux';
import { Dialog, Icon, HTMLSelect, Switch, Divider } from '@blueprintjs/core';
import { makeStyles } from '@material-ui/core';
import * as settingsActions from '../../store/actions/settingsActions';
import {
	handleSaveQueryShortcut,
	buildPropertyColumns,
	handleOnKeyDown,
	openDialog,
	closeDialog,
	clearKeybindingInput,
} from './queryShortcutsViewerScripts';
import styles from '../../assets/js/styles/components/query_shortcuts_viewer/queryShortcutsViewerStyles';
import QueryShortcutTable from '../query_shortcut_table/QueryShortcutTable';

const useStyles = makeStyles(styles);

function QueryShortcutsViewer(props) {
	const classes = useStyles(props);
	const refs = {
		searchQueryShortcutsEl: React.useRef(null),
		shortcutDialogEl: React.useRef(null),
		keybindingColumnResizerEl: React.useRef(null),
		behaviourColumnResizerEl: React.useRef(null),
		backgroundColumnResizerEl: React.useRef(null),
	};
	const [state, setState] = React.useState({
		dialogOpen: false,
		values: {},
		queries: [],
		keybindings: [],
		behaviours: [],
		backgrounds: [],
	});

	const handleSetState = obj => {
		if (obj) {
			Promise.resolve(obj).then(obj => {
				setState(state => ({ ...state, ...obj }));
			});
		}
	};

	React.useEffect(() => {
		const callback = () =>
			handleSetState(
				buildPropertyColumns(
					refs.searchQueryShortcutsEl.current?.value
						? refs.searchQueryShortcutsEl.current.value
						: '',
					props.settings.queryShortcuts,
				),
			);
		callback();
		if (refs.searchQueryShortcutsEl.current) {
			refs.searchQueryShortcutsEl.current.removeEventListener(
				'keypress',
				callback,
			);
			refs.searchQueryShortcutsEl.current.addEventListener(
				'keypress',
				callback,
			);
			return () =>
				refs.searchQueryShortcutsEl.current &&
				refs.searchQueryShortcutsEl.current.removeEventListener(
					'keypress',
					callback,
				);
		}
	}, [props.settings.queryShortcuts, refs.searchQueryShortcutsEl.current]);

	const {
		queries,
		keybindings,
		behaviours,
		backgrounds,
		dialogOpen,
		values,
	} = state;

	const { queryShortcuts } = props.settings;

	return (
		<div className={classes.rootStyle} data-test="query-shortcuts-viewer">
			<input
				className={classes.searchInputStyle}
				ref={refs.searchQueryShortcutsEl}
				id=""
				type="text"
				placeholder="Type to search query shortcut"
			/>
			<div
				className={classes.addShortcutStyle}
				onClick={() => handleSetState(openDialog(null, queryShortcuts))}
			>
				<Icon icon="plus" className={classes.iconStyle} />
			</div>

			<QueryShortcutTable
				queries={queries}
				keybindings={keybindings}
				behaviours={behaviours}
				backgrounds={backgrounds}
				handleSetState={handleSetState}
				{...props}
			/>

			<Dialog
				portalClassName={classes.queryShortcutCreationDialogStyle}
				autoFocus={true}
				canEscapeKeyClose={false}
				canOutsideClickClose={true}
				enforceFocus={true}
				isOpen={dialogOpen}
				title="New Query Shortcut"
				isCloseButtonShown={false}
				onClose={() => handleSetState(closeDialog())}
				usePortal={true}
			>
				<div
					className={classes.queryShortcutCreationDialogContentStyle}
				>
					<div id="shortcut-dialog-content">
						<h4>Query</h4>
						<input
							id="query"
							type="text"
							placeholder="i.e. workspace"
							defaultValue={values.query}
							onChange={e =>
								handleSetState(handleOnKeyDown(e, values))
							}
						/>

						<h4>Keybinding</h4>
						<div className={classes.keybindingInputContainerStyle}>
							<input
								type="text"
								id="keybinding"
								placeholder="i.e ctrl+i"
								defaultValue={values.keybinding}
								onKeyDown={e =>
									handleSetState(handleOnKeyDown(e, values))
								}
							/>
							<Icon
								icon="cross"
								onClick={e =>
									handleSetState(
										clearKeybindingInput(e, values),
									)
								}
							/>
						</div>

						<h4>Behaviour</h4>
						<HTMLSelect
							className={classes.selectInputStyle}
							minimal={true}
							id="behaviour"
							defaultValue={values.behaviour}
							onChange={e =>
								handleSetState(handleOnKeyDown(e, values))
							}
						>
							<option value="run as soon as possible">
								Run as soon as possible
							</option>
							<option value="paste to terminal">
								Paste to terminal
							</option>
						</HTMLSelect>

						<h4>Background</h4>
						<Switch
							className={classes.switchInputStyle}
							innerLabelChecked="on"
							id="background"
							innerLabel="off"
							defaultChecked={values.background}
							onChange={e =>
								handleSetState(handleOnKeyDown(e, values))
							}
						/>
					</div>
				</div>
				<Divider className={classes.menuDividerStyle} />
				<div className={classes.submitSectionStyle}>
					<h3 onClick={() => handleSetState(closeDialog())}>
						Cancel
					</h3>
					<h3
						className="save"
						onClick={() =>
							handleSetState(
								handleSaveQueryShortcut(
									values,
									queryShortcuts,
									props,
								),
							)
						}
					>
						Save
					</h3>
				</div>
			</Dialog>
		</div>
	);
}

const mapStateToProps = state => ({
	query: state.query,
	settings: state.settings,
});

const mapDispatchToProps = dispatch => ({
	setQueryShortcuts: shortcut =>
		dispatch(settingsActions.setQueryShortcuts(shortcut)),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(QueryShortcutsViewer);
