import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';

import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';

import App from './App';
import './assets/css/index.css';
import { store, persistor } from './store/configureStore';

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <React.StrictMode>
        <Suspense fallback={null}>
          <App />
        </Suspense>
      </React.StrictMode>
    </PersistGate>
  </Provider>,
  document.getElementById('electron'),
);
