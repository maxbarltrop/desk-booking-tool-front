import React from 'react';
import { connect } from 'react-redux';
import { Router, Route, Switch } from 'react-router-dom';
import history from '../history';
import BookADesk from '../components/BookADesk';
import ViewPreviousBookings from '../components/ViewPreviousBooking';
import setBooking from '../components/setBooking';
import Confirmation from '../components/Confirmation';
import ViewBookings from '../components/ViewBookings.js';
import ShowBookings from '../components/ShowBookings.js';
import RestrictDesks from '../components/RestrictDesks.js';
import SetRestrictions from '../components/setRestrictions.js';
import DragBox from '../components/dragBox.js';
import Restrictions from '../components/Restrictions';
import Add from '../components/add';
import AdminNavBar from '../components/NavBarAdmin';
import Feedback from '../components/feedback';
import { setUser } from '../actions';

class AdminRouter extends React.Component {
  constructor(props) {
    super(props);
    const { dispatch, user } = props;
    dispatch(setUser(user.userName));
  }
  render() {
    return (
      <Router history={history}>
        <div>
          <AdminNavBar />
          <Switch>
            <Route path="/" component={BookADesk} exact />
            <Route path="/BookADesk" component={BookADesk} exact />
            <Route
              path="/ViewPreviousBookings"
              component={ViewPreviousBookings}
              exact
            />
            <Route path="/setBooking" component={setBooking} exact />
            <Route path="/confirmation" component={Confirmation} exact />
            <Route path="/viewAllBookings" component={ViewBookings} exact />
            <Route path="/bookings" component={ShowBookings} exact />
            <Route path="/restrict" component={RestrictDesks} exact />
            <Route path="/setRestriction" component={SetRestrictions} exact />
            <Route path="/userRestrictions" component={Restrictions} exact />
            <Route path="/floorBuilder" component={DragBox} />
            <Route path="/addFloor" component={Add} />
            <Route path="/feedback" component={Feedback} />
          </Switch>
        </div>
      </Router>
    );
  }
}
export default connect()(AdminRouter);
