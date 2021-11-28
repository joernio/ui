import axios from 'axios';
import { errorStrings } from '../assets/js/utils/defaultVariables';
import { store } from '../store/configureStore';

class API {
  request = ({ path = '/', method = 'GET', data }) => {
    let {
      url,
      auth_username: username,
      auth_password: password,
      enable_http,
    } = store.getState().settings.server;
    const connected = store.getState().status.connected;
    url = url.split('/');
    url =
      url[url.length - 1] === ''
        ? `${url.join('/')}${path}`
        : `${url.join('/')}/${path}`;

    if (!connected) {
      return new Promise((_, reject) => {
        reject(errorStrings.ws_not_connected);
      });
    } else if (!enable_http && url.startsWith('http://')) {
      return new Promise((_, reject) => {
        reject(errorStrings.http_disabled);
      });
    } else if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return new Promise((_, reject) => {
        reject(errorStrings.bad_url_format);
      });
    } else if (connected && method === 'GET') {
      return axios({
        method: 'get',
        url,
        auth: { username, password },
      });
    } else if (connected && data) {
      return axios({
        method: 'post',
        url,
        data,
        auth: { username, password },
      });
    } else {
      return new Promise((_, reject) => {
        reject(errorStrings.bad_request);
      });
    }
  };

  /**********************query******************************/
  query = query => {
    const path = 'query';
    const method = 'POST';
    const data = { query };

    return this.request({ path, method, data }).then(res => res.data);
  };
  /****************************************************/

  /**********************get query result******************************/
  getQueryResult = uuid => {
    const path = `result/${uuid}`;
    return this.request({ path }).then(res => res.data);
  };
  /****************************************************/
}

export default API;
