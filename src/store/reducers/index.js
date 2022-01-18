import { combineReducers } from 'redux';

import files from './filesReducers';
import query from './queryReducers';
import settings from './settingsReducers';
import status from './statusReducers';
import workspace from './workSpaceReducers';
import terminal from './terminalReducers';
import editor from './editorReducers';

export default combineReducers({
  files,
  query,
  settings,
  status,
  workspace,
  terminal,
  editor,
});
