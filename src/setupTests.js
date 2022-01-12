import Enzyme from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

Enzyme.configure({
  adapter: new Adapter(),
  disapbleLifecycleMethods: true, //did you mean to write disableLifeCyleMethods
});
global.ResizeObserver = require('resize-observer-polyfill');
