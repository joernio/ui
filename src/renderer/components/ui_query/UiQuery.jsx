import React from 'react';
import clsx from 'clsx';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import CustomIcon from '../custom_icon/CustomIcon';
import * as terminalSelectors from '../../store/selectors/terminalSelectors';
import * as settingsSelectors from '../../store/selectors/settingsSelectors';
import { handleToggleBlock } from './uiQueryScripts';
import styles from '../../assets/js/styles/components/ui_query/uiQueryStyles';
import commonStyles from '../../assets/js/styles';

const useStyles = makeStyles(styles);
const useCommonStyles = makeStyles(commonStyles);

function UiQuery(props) {
	const classes = useStyles(props);
	const commonClasses = useCommonStyles(props);
	const {
		item: { block_id },
		registerChild,
	} = props;
	const { circuit_ui_responses } = props;

	return (
		<div ref={registerChild} key={props.key} style={props.style}>
			<div className={classes.uiQueryStyle} data-block-id={block_id}>
				<CustomIcon
					className={clsx(
						commonClasses.iconStyle,
						classes.customIconStyle,
						{
							'hide-icon':
								!circuit_ui_responses.all[block_id].ui_response,
						},
						{
							dropdown:
								circuit_ui_responses.all[block_id].dropdown,
						},
					)}
					icon="custom-chevron-down"
					size={20}
					onClick={() =>
						handleToggleBlock(block_id, props.cache, props.vList)
					}
				/>
				<p
					className={classes.contentStyle}
					dangerouslySetInnerHTML={{
						__html: circuit_ui_responses.all[block_id].ui_query
							.value,
					}}
				/>
			</div>
		</div>
	);
}

const mapStateToProps = state => ({
	circuit_ui_responses: terminalSelectors.selectCircuitUiResponses(state),
	prefersDarkMode: settingsSelectors.selectPrefersDarkMode(state),
});

export default connect(mapStateToProps, null)(UiQuery);
