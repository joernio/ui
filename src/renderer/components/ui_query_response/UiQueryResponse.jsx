import React from 'react';
import clsx from 'clsx';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import {
	handleToggleAllSubBlocks,
	handleToggleSubBlock,
	openFileAndGoToLineFromCircuitUI,
} from './uiQueryResponseScripts';
import iconChevronDown from '../../assets/image/icon-chevron-down.svg';

function UiQueryResponse(props) {
	const {
		item: { res_type, block_id, sub_block_id },
		registerChild,
		rowsRendered,
	} = props;
	const { circuit_ui_responses } = props;
	const { value, dropdown: sub_block_dropdown } =
		circuit_ui_responses.all[block_id].ui_response.responses[sub_block_id];

	return (
		<div
			ref={registerChild}
			className={clsx('response', {
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
				<div className="content">
					<span className="error">ERROR</span>
					<span dangerouslySetInnerHTML={{ __html: value }} />
				</div>
			) : null}
			{res_type === 'stdout' && typeof value === 'string' ? (
				<div className="content">
					<div dangerouslySetInnerHTML={{ __html: value }}></div>
				</div>
			) : null}
			{res_type === 'stdout' && !(typeof value === 'string') ? (
				<div className="content list">
					<span
						className="object-title"
						onClick={() => openFileAndGoToLineFromCircuitUI(value)}
						dangerouslySetInnerHTML={{
							__html: `${value.fullName}()`,
						}}
					></span>
					<img
						className={clsx({ dropdown: sub_block_dropdown })}
						src={iconChevronDown}
						onClick={() =>
							handleToggleSubBlock(
								block_id,
								sub_block_id,
								props.measure,
							)
						}
					/>
					{Object.keys(value).map((each, index) => (
						<div
							key={`${index}-${each}`}
							className={clsx('object-entry-container', {
								dropdown: sub_block_dropdown,
							})}
						>
							<span className="object-key">{each}</span>
							<span>{value[each]}</span>
						</div>
					))}
				</div>
			) : null}
		</div>
	);
}

const mapStateToProps = state => ({
	circuit_ui_responses: createSelector(
		[state => state.terminal],
		terminal => terminal.circuit_ui_responses,
	)(state),
});

export default connect(mapStateToProps, null)(UiQueryResponse);
