import { windowActionApi } from '../../assets/js/utils/ipcRenderer';

export const setSettings = setting => {
  const { cert_path, cert_passphrase } = setting.server;
  cert_path &&
    windowActionApi.importCertificate({ cert_path, cert_passphrase });

  setting.server.cert_path = 'up to date';
  setting.server.cert_passphrase = 'up to date';

  return dispatch => {
    dispatch({
      type: 'SET_SETTINGS',
      payload: setting,
    });
  };
};
