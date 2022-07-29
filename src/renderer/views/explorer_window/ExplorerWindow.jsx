import React from 'react';
import clsx from 'clsx';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Icon } from '@blueprintjs/core';
import Folders from '../../components/folders/Folders';
import Workspace from '../../components/workspace/Workspace';
import CpgScripts from '../../components/cpg_scripts/CpgScripts';
import OpenFiles from '../../components/open_files/OpenFiles';
import * as settingsSelectors from '../../store/selectors/settingsSelectors';
import * as querySelectors from '../../store/selectors/querySelectors';
import { initResize } from '../../assets/js/utils/scripts';
import { resizeHandler } from './explorerWindowScripts';
import styles from '../../assets/js/styles/views/explorer_window/explorerWindowStyles';

const useStyles = makeStyles(styles);

function ExplorerWindow(props) {
  const { drawerWidth } = props;

	const classes = useStyles(props);
  const refs = {
    resizeEl: React.useRef(null),
    explorerWindowEl: React.useRef(null)
  };

  React.useEffect(()=>{
    if (refs.explorerWindowEl.current){
      refs.explorerWindowEl.current.style.width = drawerWidth;
    }
  },[drawerWidth]);

	React.useEffect(() => {
		if (refs.resizeEl.current) {
			const callback = initResize(
				refs.resizeEl.current,
				'col',
				(drawerWidth, diff, commit) => {
          const obj = resizeHandler(drawerWidth, diff, refs.explorerWindowEl);
          refs.explorerWindowEl.current.style.width = obj.drawerWidth;

          if(commit || obj.drawerWidth === 0) props.handleSetState(obj);
				},
			);
			return () => {
				refs.resizeEl.current &&
					refs.resizeEl.current.removeEventListener('mousedown', callback);
			};
		}
	}, [refs.resizeEl.current]);

	return (
		<div
      ref={refs.explorerWindowEl}
			className={clsx(classes.root, {
				[classes.drawerOpen]: drawerWidth,
				[classes.drawerClose]: !drawerWidth,
			})}
			data-test="explorer-window"
		>
			<div ref={refs.resizeEl} className={classes.resizeHandleStyle}></div>
			<h1 className={classes.titleStyle}>explorer</h1>
			{Object.keys(props.results).length < 1 ? (
				<Icon
					icon="refresh"
					iconSize={40}
					className={clsx(
						classes.refreshIconStyle,
						'refresh-icon-animation',
					)}
				/>
			) : (
				<>
					<CpgScripts />
					<OpenFiles />
					<Workspace />
					<Folders />
				</>
			)}
		</div>
	);
}

const mapStateToProps = state => ({
	results: querySelectors.selectResults(state),
	prefersDarkMode: settingsSelectors.selectPrefersDarkMode(state),
});

export default connect(mapStateToProps, null)(ExplorerWindow);
