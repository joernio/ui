import React from 'react';
import { MenuDivider, Menu, MenuItem, Icon } from '@blueprintjs/core';
import { ContextMenu2, Tooltip2 } from '@blueprintjs/popover2';
import { makeStyles } from '@material-ui/core/styles';
import styles from '../../assets/js/styles/components/project/projectStyles';
import commonStyles from '../../assets/js/styles';

import {
	handleOpenProject,
	handleCloseProject,
	handleDeleteProject,
} from './projectScripts';

import { addToQueue } from '../../assets/js/utils/scripts';

const useStyles = makeStyles(styles);
const useCommonStyles = makeStyles(commonStyles);

function Project(props) {
	const classes = useStyles(props);
	const commonClasses = useCommonStyles(props);

	const { name, index } = props;

	return (
		<ContextMenu2
			data-test="project"
			autoFocus={false}
			content={
				<Menu className={classes.menuStyle}>
					<MenuItem
						tabIndex="0"
						className={classes.menuItemStyle}
						onClick={() => addToQueue(handleOpenProject(name))}
						text="open"
					/>
					<MenuItem
						className={classes.menuItemStyle}
						onClick={() => addToQueue(handleCloseProject(name))}
						text="close"
					/>
					<MenuDivider className={classes.menuDividerStyle} />
					<MenuItem
						className={classes.menuItemStyle}
						onClick={() => addToQueue(handleDeleteProject(name))}
						text="delete"
					/>
				</Menu>
			}
		>
			<Tooltip2
				className={classes.projectInfoTooltipStyles}
				placement="right"
				popoverClassName={commonClasses.toolTipStyle}
				minimal={true}
				usePortal={false}
				openOnTargetFocus={false}
				content={
					<div className={classes.projectInfoContainerStyle}>
						<p>
							Language -{' '}
							{props.projects[name].language
								? props.projects[name].language
								: 'Unknown'}
						</p>
						<p>
							State -{' '}
							{props.projects[name].open
								? 'Activated'
								: 'Deactivated'}
						</p>
						{/* <p>
              Status -{' '}
              {props.projects[name].cpg &&
              props.projects[name].language &&
              props.projects[name].language !== 'Unknown'
                ? 'Supported'
                : props.projects[name].open &&
                  props.projects[name].language &&
                  props.projects[name].language === 'Unknown'
                ? 'Unsupported'
                : 'Unknown'}
            </p> */}
					</div>
				}
			>
				<div
					key={index}
					className={classes.projectSectionStyle}
					tabIndex="0"
				>
					<h3
						className={classes.projectNameStyle}
						key={`${name}-${index}`}
					>
						{name}
					</h3>
					{props.projects[name].open ? (
						props.projects[name].language === 'Unsupported' ? (
							<Icon
								icon="high-priority"
								className={commonClasses.iconStyle}
							/>
						) : (
							<Icon
								icon="dot"
								className={commonClasses.iconStyle}
							/>
						)
					) : null}
				</div>
			</Tooltip2>
		</ContextMenu2>
	);
}

export default Project;
