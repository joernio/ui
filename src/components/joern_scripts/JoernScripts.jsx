import React from 'react';
import clsx from 'clsx';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import * as queryActions from '../../store/actions/queryActions';
import { Icon } from '@blueprintjs/core';
import { MenuDivider, Menu, MenuItem } from '@blueprintjs/core';
import { ContextMenu2 } from '@blueprintjs/popover2';
import styles from '../../assets/js/styles/components/joern_scripts/joernScriptsStyles';
import {
  openFile,
  saveFile,
  deleteFile,
  handleScrollTop,
} from '../../assets/js/utils/scripts';
import {
  runScript,
  getJoernScripts,
  getJoernScriptsFromRecent,
  handleToggleScriptsVisible,
} from './joernScriptsScripts';

const useStyles = makeStyles(styles);

function JoernScripts(props) {
  const scriptsContainerEl = React.useRef(null);
  const classes = useStyles(props);
  const [state, setState] = React.useState({
    scripts: {},
    recentScripts: {},
    scriptsVisible: true,
    scrolled: false,
  });

  React.useEffect(async () => {
    const scripts = await getJoernScripts(props);
    handleSetState({ scripts: scripts ? scripts : {} });
  }, [props.workspace]);

  React.useEffect(() => {
    const scripts = getJoernScriptsFromRecent(props);
    handleSetState({ recentScripts: scripts ? scripts : {} });
  }, [props.files]);

  React.useEffect(() => {
    const callback = e => handleSetState(handleScrollTop(e));

    if (scriptsContainerEl.current) {
      scriptsContainerEl.current.addEventListener('scroll', callback);

      return () =>
        scriptsContainerEl.current &&
        scriptsContainerEl.current.removeEventListener('scroll', callback);
    }
  }, [scriptsContainerEl.current]);

  const handleSetState = obj => {
    if (obj) {
      Promise.resolve(obj).then(obj => {
        setState(state => ({ ...state, ...obj }));
      });
    }
  };

  let { scripts, recentScripts, scriptsVisible, scrolled } = state;

  scripts = { ...scripts, ...recentScripts };

  return Object.keys(props.workspace.projects).length > 0 ? (
    <div className={classes.rootStyle} tabIndex="0" data-test="joern-scripts">
      <div
        className={classes.titleSectionStyle}
        onClick={() =>
          handleSetState(handleToggleScriptsVisible(scriptsVisible))
        }
      >
        {scriptsVisible ? (
          <Icon className={classes.iconStyle} icon="chevron-down" />
        ) : (
          <Icon className={classes.iconStyle} icon="chevron-right" />
        )}
        <h2 className={classes.titleStyle}>scripts</h2>
      </div>
      <div
        ref={scriptsContainerEl}
        className={clsx(
          classes.scriptsSectionStyle,
          {
            [classes.scrolledStyle]: scrolled,
          },
          {
            [classes.scriptsVisible]: scriptsVisible,
            [classes.scriptsHidden]: !scriptsVisible,
          },
        )}
      >
        {scriptsVisible && scripts
          ? Object.keys(scripts).map(path => {
              let filename = path.split('/');
              filename = filename[filename.length - 1];
              return (
                <ContextMenu2
                  content={
                    <Menu className={classes.menuStyle}>
                      <MenuItem
                        className={classes.menuItemStyle}
                        onClick={() => {
                          saveFile(path);
                        }}
                        text="Save"
                      />
                      <MenuDivider className={classes.menuDividerStyle} />
                      <MenuItem
                        className={classes.menuItemStyle}
                        onClick={() => {
                          deleteFile(path);
                        }}
                        text="Delete"
                      />
                    </Menu>
                  }
                >
                  <div className={classes.scriptSectionStyle} tabindex="0">
                    <h3
                      className={classes.scriptNameStyle}
                      key={path}
                      onClick={() => (path ? openFile(path) : null)}
                    >
                      {filename}
                    </h3>
                    {filename.endsWith('.sc') ? (
                      <Icon
                        icon="play"
                        className={classes.iconStyle}
                        onClick={() => runScript(path, props)}
                      />
                    ) : null}
                  </div>
                </ContextMenu2>
              );
            })
          : null}
      </div>
    </div>
  ) : null;
}

const mapStateToProps = state => {
  return {
    query: state.query,
    workspace: state.workspace,
    files: state.files,
    settings: state.settings,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    enQueueQuery: query => {
      return dispatch(queryActions.enQueueQuery(query));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(JoernScripts);
