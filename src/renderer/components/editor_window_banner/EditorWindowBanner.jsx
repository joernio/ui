import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import styles from '../../assets/js/styles/components/editor_window_banner/editorWindowBannerStyles';

const useStyles = makeStyles(styles);

function EditorWindowBanner(props) {
	const classes = useStyles(props);

	return props.message ? (
		<div className={classes.rootStyle}>{props.message}</div>
	) : null;
}

export default EditorWindowBanner;
