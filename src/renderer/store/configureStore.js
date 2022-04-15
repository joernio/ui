import { createStore, applyMiddleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import rootReducer from './reducers';
import thunk from 'redux-thunk';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import createMigrate from 'redux-persist/lib/createMigrate';
import migrations from './storeMigrations';

const persistConfig = {
  key: 'root',
  storage,
  version: 0,
  whitelist: ['settings', 'files'],
  blacklist: ['status', 'terminal', 'query', 'workspace', 'editor'],
  stateReconciler: autoMergeLevel2,
  migrate: createMigrate(migrations, { debug: true }),
};

const middlewares = [thunk];

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(persistedReducer, applyMiddleware(...middlewares));
const persistor = persistStore(store);
export { middlewares, store, persistor };
