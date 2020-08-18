import { createStore, combineReducers } from 'redux';
import bookingReducer from './bookingReducer';
import deskReducer from './deskReducer';
import tabReducer from './tabReducer';
import floorReducer from './floorReducer';
import limitReducer from './limitReducer';
import emailReducer from './emailReducer';
import bookingViewReducer from './bookingViewReducer';
import restrictReducer from './restrictReducer';
import restrictionsReducer from './restrictionsReducer';
import imageReducer from './imageReducer';
import viewReducer from './viewReducer';
import userReducer from './userReducer';

export default () => {
  const store = createStore(
    combineReducers({
      booking: bookingReducer,
      desk: deskReducer,
      tab: tabReducer,
      floor: floorReducer,
      limit: limitReducer,
      email: emailReducer,
      bookingView: bookingViewReducer,
      rest: restrictReducer,
      view: viewReducer,
      bookingRestriction: restrictionsReducer,
      image: imageReducer,
      user: userReducer,
    }),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  );

  return store;
};
