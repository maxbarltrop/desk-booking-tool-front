import React from 'react';
import { Navbar } from '../../components/NavBar';
import { shallow } from 'enzyme';
import ReactTestUtils from 'react-dom/test-utils'; // ES6

//jest.mock('../../services/Auth');

let wrapper;

beforeEach(() => {
  wrapper = shallow(<Navbar />);
});

test('Should render when logged in', () => {
  //wrapper.setProps({ loggedIn: true });
  expect(wrapper).toMatchSnapshot();
});
