import React from 'react';

const APIContext = React.createContext(null);

// eslint-disable-next-line react/display-name
export const withAPI = Component => props =>
	(
		<APIContext.Consumer>
			{api => <Component {...props} api={api} />}
		</APIContext.Consumer>
	);

export default APIContext;
