import React from 'react';
import '../styles/Restrictions.css';
import { connect } from 'react-redux';
import { Dialog } from '@material-ui/core';
import { Card, Header } from 'semantic-ui-react';
import history from '../history';
import { setTab } from '../actions';
import BookingService from '../services/bookingService';

class Confirmation extends React.Component {
  constructor(props) {
    super(props);

    this.state = { done: false, cont: false, same: false };
    this.service = new BookingService();
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(setTab('book'));
    this.checkContinuous();
  }

  componentDidUpdate() {}

  sortByDate = (d1, d2) => {
    if (parseInt(d1.date.substr(0, 4)) < parseInt(d2.date.substr(0, 4))) {
      return -1;
    }
    if (parseInt(d1.date.substr(0, 4)) > parseInt(d2.date.substr(0, 4))) {
      return 1;
    }
    if (parseInt(d1.date.substr(5, 2)) < parseInt(d2.date.substr(5, 2))) {
      return -1;
    }
    if (parseInt(d1.date.substr(5, 2)) > parseInt(d2.date.substr(5, 2))) {
      return 1;
    }
    if (parseInt(d1.date.substr(8, 2)) < parseInt(d2.date.substr(8, 2))) {
      return -1;
    }
    if (parseInt(d1.date.substr(8, 2)) > parseInt(d2.date.substr(8, 2))) {
      return 1;
    }
    return 0;
  };

  checkContinuous = async () => {
    const { email, booking, limit } = this.props;
    let bookings = await this.service.getBookings({
      email: email,
    });
    const bookDate = `${booking.date
      .split('-')
      .reverse()
      .join('-')}T00:00:00.000Z`;
    if (bookings.find((e) => e.date === bookDate) !== undefined) {
      this.setState({ same: true });
      return;
    }

    bookings.push({
      date: bookDate,
      email: identification.email,
    });
    bookings = bookings.sort(this.sortByDate);
    let curIndex = bookings.findIndex((e) => e.date === bookDate);
    let forward = 0;
    let backward = 0;
    while (1) {
      if (curIndex === bookings.length - 1) {
        break;
      }
      const dateA = new Date(bookings[curIndex].date);
      dateA.setDate(dateA.getDate() + 1);
      const A = dateA.toString().substr(0, 16);
      const dateB = new Date(bookings[curIndex + 1].date);
      const B = dateB.toString().substr(0, 16);
      if (A == B) {
        console.log('yes');
        forward += 1;
        curIndex += 1;
      } else {
        break;
      }
    }
    curIndex = bookings.findIndex((e) => e.date === bookDate);
    while (1) {
      if (curIndex === 0) {
        break;
      }
      const dateA = new Date(bookings[curIndex].date);
      dateA.setDate(dateA.getDate() - 1);
      const A = dateA.toString().substr(0, 16);
      const dateB = new Date(bookings[curIndex - 1].date);
      const B = dateB.toString().substr(0, 16);
      if (A === B) {
        backward += 1;
        curIndex -= 1;
      } else {
        break;
      }
    }
    const totalContinuous = 1 + forward + backward;
    if (totalContinuous > limit.continuous) {
      this.setState({ cont: true });
    }
  };

  onUserSubmit = async (event) => {
    const { desk, booking, email } = this.props;
    await this.service.postBooking({
      email: email,
      office: booking.office,
      date: booking.date.split('-').reverse().join('-'),
      floor: booking.floor,
      desk,
    });
    this.setState({ done: true });
  };

  done = () => {
    location.reload();
    return true;
  };

  goBack = () => {
    history.push('/setBooking');
  };

  render() {
    const { booking, desk, limit, email } = this.props;
    const { same, cont } = this.state;

    if (desk === null) {
      history.push('/setBooking');
      return null;
    }

    return (
      <div>
        <div className="details">Booking Confirmation</div>
        <div className="conf-data">
          <div className="conf">
            <b>Email:</b> {email}{' '}
          </div>

          <div className="conf">
            <b>Office:</b> {booking.office}
          </div>
          <div className="conf">
            <b>Floor: </b>
            {booking.floor}
          </div>
          <div className="conf">
            <b>Desk Selection:</b> {desk}
          </div>
          <div className="conf">
            <b>Date:</b> {booking.date}
          </div>
        </div>
        {same ? (
          <div className="warn">
            <p className="warn-text">
              ! You have already made a booking on this day.
            </p>
          </div>
        ) : (
          ''
        )}
        {cont ? (
          <div className="warn">
            <p className="warn-text">
              ! Cannot book more than {limit.continuous} days in a row.
            </p>
          </div>
        ) : (
          ''
        )}

        <div>
          <div className="ui button " onClick={this.goBack}>
            Back
          </div>
          <div
            className={`ui blue button ${same || cont ? 'disabled' : ''}`}
            onClick={this.onUserSubmit}
          >
            Confirm
          </div>
        </div>
        <Dialog
          open={this.state.done}
          aria-labelledby="form-dialog-title"
          style={{ width: '100%', maxWidth: 'xl' }}
        >
          <Card className="my-card3">
            <Header className="conf-header">
              Thanks for using the Desk Booking Tool.
            </Header>
            <div className="thanks">
              Your booking for desk {desk} on floor {booking.floor} at{' '}
              {booking.office} on {booking.date} is saved{' '}
            </div>
            <div className="thanks">
              A confirmation email has been sent to {email}
            </div>
            <div className="ui blue button" id="thanks-btn" onClick={this.done}>
              Done
            </div>
          </Card>
        </Dialog>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  identification: state.identification,
  booking: state.booking,
  desk: state.desk,
  limit: state.limit,
  email: state.user,
});

export default connect(mapStateToProps)(Confirmation);
