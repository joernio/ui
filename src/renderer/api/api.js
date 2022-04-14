import axios from 'axios';
import { apiErrorStrings } from '../assets/js/utils/defaultVariables';
import { store } from '../store/configureStore';

class API {
	// eslint-disable-next-line class-methods-use-this
	request = ({ path = '/', method = 'GET', data }) => {
		let {
			url,
			auth_username: username, // eslint-disable-line prefer-const
			auth_password: password, // eslint-disable-line prefer-const
		} = store.getState().settings.server;
		const connection_status = store.getState().status.connected;
		url = url.split('/');
		url =
			url[url.length - 1] === ''
				? `${url.join('/')}${path}`
				: `${url.join('/')}/${path}`;

		if (connection_status && method === 'GET') {
			return axios({
				method: 'get',
				url,
				auth: { username, password },
			});
		}
		if (connection_status && data) {
			return axios({
				method: 'post',
				url,
				data,
				auth: { username, password },
			});
		}
		if (!connection_status) {
			return new Promise((_, reject) => {
				reject(apiErrorStrings.ws_not_connected);
			});
		}
	};

	/** ********************query***************************** */
	query = query => {
		const path = 'query';
		const method = 'POST';
		const data = { query };

		return this.request({ path, method, data }).then(res => res.data);
	};
	/** ************************************************* */

	/** ********************get query result***************************** */
	getQueryResult = uuid => {
		const path = `result/${uuid}`;
		return this.request({ path }).then(res => res.data);
	};
	/** ************************************************* */
}

export default API;
