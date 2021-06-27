import axios from 'axios';
import { store } from '../store/configureStore';

class API {
  request = ({ path = '/', method = 'GET', body }) => {
    const { protocol, domain, port } = store.getState().settings.server_auth;
    const url = `${protocol}://${domain}:${port}/${path}`;

    if (method === 'GET') {
      console.log('inside api get');
      return axios.get(url);
    } else if (body) {
      return axios.post(url, body);
    }
  };

  /**********************query******************************/
  query = query => {
    console.log('api.query was called: ', query);
    const path = 'query';
    const method = 'POST';
    const body = JSON.stringify({ query });

    return this.request({ path, method, body }).then(res => {
      return res.data;
    });
  };
  /****************************************************/

  /**********************get query result******************************/
  getQueryResult = uuid => {
    console.log('api.getQueryResult was called: ', uuid);
    const path = `result/${uuid}`;
    return this.request({ path }).then(res => {
      return res.data;
    });
  };
  /****************************************************/
}

export default API;
