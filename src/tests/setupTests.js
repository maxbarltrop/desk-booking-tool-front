import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import ReactTestUtils from 'react-dom/test-utils'; // ES6
global.XMLHttpRequest = undefined;
Enzyme.configure({
  adapter: new Adapter(),
});
