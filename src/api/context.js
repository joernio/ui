import React from 'react';
const APIContext = React.createContext(null);

/**
 * A wrapper around API component
 * @param {Object} Component
 * @returns a react higher order component
 */
export const withAPI = Component => props =>
  (
    <APIContext.Consumer>
      {api => <Component {...props} api={api} />}
    </APIContext.Consumer>
  );

export default APIContext;
