import { windowActionApi } from '../../assets/js/utils/ipcRenderer';

export const setSettings = setting => {
  const { cert_path, cert_passphrase } = setting.server;
  cert_path &&
    windowActionApi.importCertificate({ cert_path, cert_passphrase });

  delete setting.server.cert_path;
  delete setting.server.cert_passphrase;

  return dispatch => {
    dispatch({
      type: 'SET_SETTINGS',
      payload: setting,
    });
  };
};
