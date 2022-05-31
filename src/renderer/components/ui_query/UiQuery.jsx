import React from 'react';
import clsx from 'clsx';
import { connect } from 'react-redux';
import * as terminalSelectors from '../../store/selectors/terminalSelectors';
import { handleToggleBlock } from './uiQueryScripts';
import iconChevronDown from '../../assets/image/icon-chevron-down.svg';

function UiQuery(props) {
	const {
		item: { block_id },
		registerChild,
	} = props;
	const { circuit_ui_responses } = props;

	return (
		<div ref={registerChild} key={props.key} style={props.style}>
			<div
				className={clsx('query', {
					dropdown: circuit_ui_responses.all[block_id].dropdown,
				})}
				data-block-id={block_id}
			>
				<img
					className={{
						'hide-icon':
							!circuit_ui_responses.all[block_id].ui_response,
					}}
					src={iconChevronDown}
					onClick={() =>
						handleToggleBlock(block_id, props.cache, props.vList)
					}
				/>
				<p
					className="content"
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
});

export default connect(mapStateToProps, null)(UiQuery);
