import React from 'react';
import { connect } from 'react-redux';
import { Router, Route, Switch } from 'react-router-dom';
import history from '../history';
import BookADesk from '../components/BookADesk';
import ViewPreviousBookings from '../components/ViewPreviousBooking';
import UserNavBar from '../components/NavBarUser';
import setBooking from '../components/setBooking';
import Confirmation from '../components/Confirmation';
import { setUser } from '../actions';
import Feedback from '../components/feedback';

class UserRouter extends React.Component {
  constructor(props) {
    super(props);
    const { dispatch, user } = props;
    dispatch(setUser(user.userName));
  }
  render() {
    return (
      <Router history={history}>
        <div>
          <UserNavBar />
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
            <Route path="/feedback" component={Feedback} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default connect()(UserRouter);
