import React from 'react';
import clsx from 'clsx';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import * as terminalSelectors from '../../store/selectors/terminalSelectors';
import * as settingsSelectors from '../../store/selectors/settingsSelectors';
import CustomIcon from '../custom_icon/CustomIcon';
import {
	handleToggleAllSubBlocks,
	handleToggleSubBlock,
	openFileAndGoToLineFromCircuitUI,
} from './uiQueryResponseScripts';
import styles from '../../assets/js/styles/components/ui_query_response/uiQueryResponseStyles';
import commonStyles from '../../assets/js/styles';
import { customIcons } from '../../assets/js/utils/defaultVariables';

const useStyles = makeStyles(styles);
const useCommonStyles = makeStyles(commonStyles);

function UiQueryResponse(props) {
	const classes = useStyles(props);
	const commonClasses = useCommonStyles(props);
	const {
		item: { res_type, block_id, sub_block_id },
		registerChild,
		rowsRendered,
	} = props;
	const { circuit_ui_responses } = props;
	if (!circuit_ui_responses.all[block_id].ui_response.responses[sub_block_id])
		return null;
	const { value, dropdown: sub_block_dropdown } =
		circuit_ui_responses.all[block_id].ui_response.responses[sub_block_id];

	return (
		<div
			ref={registerChild}
			className={clsx(classes.uiResponseStyle, {
				dropdown: circuit_ui_responses.all[block_id].dropdown,
			})}
			data-block-id={block_id}
			style={props.style}
			key={props.key}
		>
			{circuit_ui_responses.all[block_id].ui_response.length > 1 ? (
				<div
					className="toggle-bar"
					onClick={() =>
						handleToggleAllSubBlocks(
							block_id,
							rowsRendered,
							props.cache,
							props.vList,
						)
					}
				></div>
			) : null}
			{res_type === 'stderr' ? (
				<div className={classes.contentStyle}>
					<span className={classes.errorStyle}>ERROR</span>
					<span dangerouslySetInnerHTML={{ __html: value }} />
				</div>
			) : null}
			{res_type === 'stdout' && typeof value === 'string' ? (
				<div className={classes.contentStyle}>
					<div dangerouslySetInnerHTML={{ __html: value }}></div>
				</div>
			) : null}
			{res_type === 'stdout' && !(typeof value === 'string') ? (
				<div className={clsx(classes.contentStyle, classes.listStyle)}>
					<div className={classes.objectTitleSectionStyle}>
						<span
							className={classes.objectTitleStyle}
							onClick={() =>
								openFileAndGoToLineFromCircuitUI(value)
							}
							dangerouslySetInnerHTML={{
								__html: `${value.fullName}()`,
							}}
						></span>
						<CustomIcon
							className={clsx(
								commonClasses.iconStyle,
								classes.customIconStyle,
								{ dropdown: sub_block_dropdown },
							)}
							icon={customIcons.chevron_down}
							iconSize={20}
							onClick={() =>
								handleToggleSubBlock(
									block_id,
									sub_block_id,
									props.measure,
								)
							}
						/>
					</div>
					{Object.keys(value).map((each, index) => (
						<div
							key={`${index}-${each}`}
							className={clsx(classes.objectEntryContainerStyle, {
								dropdown: sub_block_dropdown,
							})}
						>
							<span className={classes.objectKeyStyle}>
								{each}
							</span>
							<span>{value[each]}</span>
						</div>
					))}
				</div>
			) : null}
		</div>
	);
}

const mapStateToProps = state => ({
	circuit_ui_responses: terminalSelectors.selectCircuitUiResponses(state),
	prefersDarkMode: settingsSelectors.selectPrefersDarkMode(state),
});

export default connect(mapStateToProps, null)(UiQueryResponse);
