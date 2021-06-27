import { combineReducers } from 'redux';

import files from './filesReducers';
import query from './queryReducers';
import settings from './settingsReducers';
import status from './statusReducers';
import workspace from './workSpaceReducers';

export default combineReducers({
  files,
  query,
  settings,
  status,
  workspace,
});
