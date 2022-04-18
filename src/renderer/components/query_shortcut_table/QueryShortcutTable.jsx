import React, { useEffect, useRef, useState } from 'react';
import { makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import { Tag, Icon } from '@blueprintjs/core';
import styles from '../../assets/js/styles/components/query_shortcut_table/QueryShortcutTableStyles';
import {
	handleMouseDown,
	handleMouseOver,
	handleMouseOut,
	handleResize,
	handleInitialTableWidth,
	handleMove,
	parseKeyBinding,
} from './queryShortcutTableScripts';
import {
	openDialog,
	deleteQueryShorcut,
} from '../query_shortcuts_viewer/queryShortcutsViewerScripts';

const useStyles = makeStyles(styles);

function QueryShortcutTable(props) {
	const [state, setState] = useState({
		mouseOver: 'up',
		hover: -1,
		containerWidth: 0,
		frameWidth: {
			f0: 0,
			f1: 100,
			f2: 400,
			f3: 700,
			f4: 1000,
		},
	});

	const refs = {
		frame2Ref: useRef(null),
		frame3Ref: useRef(null),
		frame4Ref: useRef(null),
		containerRef: useRef(null),
	};

	const handleSetState = obj => {
		setState(state => ({ ...state, ...obj }));
	};

	const { hover, containerWidth, frameWidth } = state;

	const {
		queries,
		keybindings,
		behaviours,
		backgrounds,
		drawerWidth,
		settings: { queryShortcuts },
	} = props;

	useEffect(() => {
		const callback = () =>
			handleSetState(handleResize(window, drawerWidth));
		window.addEventListener('resize', callback);
		return window.removeEventListener('resize', callback);
	}, []);

	useEffect(() => {
		handleInitialTableWidth(
			window,
			drawerWidth,
			containerWidth,
			frameWidth,
			handleSetState,
			refs,
		);
	}, [containerWidth]);

	const classes = useStyles(props);

	return (
		<>
			{queries.length ? (
				<div
					ref={refs.containerRef}
					onMouseMove={e =>
						handleMove({
							event: e,
							drawerWidth,
							state,
							window,
							refs,
							handleSetState,
						})
					}
					className={classes.rootStyle}
				>
					<div className={classes.frame0Style}>
						<div className={classes.contentStyle}>
							<div
								className={clsx(
									classes.headingStyle,
									'heading',
								)}
							>
								<div>Edit</div>
							</div>
							<div className={classes.innerContentStyle}>
								{queries.map((_, idx) =>
									idx !== 0 ? (
										<div
											key={idx}
											onMouseOver={() =>
												handleSetState(
													handleMouseOver(idx),
												)
											}
											onMouseOut={() =>
												handleSetState(handleMouseOut())
											}
											className={clsx(classes.itemStyle, {
												[classes.hoverStyle]:
													hover === idx,
												[classes.evenStyle]:
													idx % 2 === 0,
												[classes.oddStyle]:
													idx % 2 !== 0,
											})}
										>
											<div
												className={
													classes.iconContainerStyle
												}
											>
												<Icon
													icon="trash"
													className={
														classes.iconStyle
													}
													onClick={() =>
														props.setQueryShortcuts(
															deleteQueryShorcut(
																keybindings[
																	idx
																],
																queryShortcuts,
															),
														)
													}
												/>
												<Icon
													icon="edit"
													className={clsx(
														classes.iconStyle,
														classes.editQueryShortCutIconStyle,
													)}
													onClick={() =>
														props.handleSetState(
															openDialog(
																keybindings[
																	idx
																],
																queryShortcuts,
															),
														)
													}
												/>
											</div>
										</div>
									) : null,
								)}
							</div>
						</div>
					</div>

					<div className={classes.frame1Style}>
						<div className={classes.content}>
							<div className={classes.headingStyle}>
								{queries[0]}
							</div>
							<div className={classes.innerContentStyle}>
								{queries.map((item, idx) =>
									idx !== 0 ? (
										<div
											key={idx}
											onMouseOver={() =>
												handleSetState(
													handleMouseOver(idx),
												)
											}
											onMouseOut={() =>
												handleSetState(handleMouseOut())
											}
											className={clsx(classes.itemStyle, {
												[classes.hoverStyle]:
													hover === idx,
												[classes.evenStyle]:
													idx % 2 === 0,
												[classes.oddStyle]:
													idx % 2 !== 0,
											})}
										>
											{item}
										</div>
									) : null,
								)}
							</div>
						</div>
					</div>

					<div ref={refs.frame2Ref} className={classes.frame2Style}>
						<div className={classes.content}>
							<div className={classes.headingStyle}>
								{keybindings[0]}
							</div>
							<div className={classes.innerContentStyle}>
								<div
									onMouseDown={() =>
										handleSetState(
											handleMouseDown('frame2'),
										)
									}
									className={classes.dragStyle}
								></div>
								{keybindings.map((item, idx) =>
									idx !== 0 ? (
										<div
											key={idx}
											onMouseOver={() =>
												handleSetState(
													handleMouseOver(idx),
												)
											}
											onMouseOut={() =>
												handleSetState(handleMouseOut())
											}
											className={clsx(classes.itemStyle, {
												[classes.hoverStyle]:
													hover === idx,
												[classes.evenStyle]:
													idx % 2 === 0,
												[classes.oddStyle]:
													idx % 2 !== 0,
											})}
										>
											{parseKeyBinding(item).map(
												(value, idx) =>
													value === ' ' ||
													value === '+' ? (
														<span
															key={idx}
															className={
																classes.tagSeparationStyle
															}
														>
															{value}
														</span>
													) : (
														<Tag
															className={
																classes.keybindingStyle
															}
															key={idx}
														>
															{value}
														</Tag>
													),
											)}
										</div>
									) : null,
								)}
							</div>
						</div>
					</div>

					<div ref={refs.frame3Ref} className={classes.frame3Style}>
						<div className={classes.content}>
							<div className={classes.headingStyle}>
								{behaviours[0]}
							</div>
							<div className={classes.innerContentStyle}>
								<div
									onMouseDown={() =>
										handleSetState(
											handleMouseDown('frame3'),
										)
									}
									className={classes.dragStyle}
								></div>
								{behaviours.map((item, idx) =>
									idx !== 0 ? (
										<div
											key={idx}
											onMouseOver={() =>
												handleSetState(
													handleMouseOver(idx),
												)
											}
											onMouseOut={() =>
												handleSetState(handleMouseOut())
											}
											className={clsx(classes.itemStyle, {
												[classes.hoverStyle]:
													hover === idx,
												[classes.evenStyle]:
													idx % 2 === 0,
												[classes.oddStyle]:
													idx % 2 !== 0,
											})}
										>
											{item}
										</div>
									) : null,
								)}
							</div>
						</div>
					</div>

					<div ref={refs.frame4Ref} className={classes.frame4Style}>
						<div className={classes.contentStyle}>
							<div className={classes.headingStyle}>
								{backgrounds[0]}
							</div>
							<div className={classes.innerContentStyle}>
								<div
									onMouseDown={() =>
										handleSetState(
											handleMouseDown('frame4'),
										)
									}
									className={classes.dragStyle}
								></div>
								{backgrounds.map((item, idx) =>
									idx !== 0 ? (
										<div
											key={idx}
											onMouseOver={() =>
												handleSetState(
													handleMouseOver(idx),
												)
											}
											onMouseOut={() =>
												handleSetState(handleMouseOut())
											}
											className={clsx(classes.itemStyle, {
												[classes.hoverStyle]:
													hover === idx,
												[classes.evenStyle]:
													idx % 2 === 0,
												[classes.oddStyle]:
													idx % 2 !== 0,
											})}
										>
											{String(item)}
										</div>
									) : null,
								)}
							</div>
						</div>
					</div>
				</div>
			) : null}
		</>
	);
}

export default QueryShortcutTable;
