import React from 'react';
import '../styles/Restrictions.css';
import '../styles/base.css';
import { connect } from 'react-redux';
import uuid from 'uuid';
import { setTab } from '../actions';
import BookingService from '../services/bookingService';
import FloorView from './FloorView';

class Restrictions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      searched: false,
      bookings: [],
      sort: 'date',
    };
    this.service = new BookingService();
  }

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

  sortByOffice = (d1, d2) => {
    if (d1.office < d2.office) {
      return -1;
    }
    if (d2.office > d1.office) {
      return 1;
    }
    return 0;
  };

  sortByDesk = (d1, d2) => {
    if (d1.desk < d2.desk) {
      return -1;
    }
    if (d2.desk > d1.desk) {
      return 1;
    }
    return 0;
  };

  dateSort = () => {
    var { bookings } = this.state;
    bookings = bookings.sort(this.sortByDate);
    this.setState({ bookings, sort: 'date' });
  };

  officeSort = () => {
    var { bookings } = this.state;
    bookings = bookings.sort(this.sortByOffice);
    this.setState({ bookings, sort: 'office' });
  };

  deskSort = () => {
    var { bookings } = this.state;
    bookings = bookings.sort(this.sortByDesk);
    this.setState({ bookings, sort: 'desk' });
  };

  async componentDidMount() {
    const { dispatch, email } = this.props;
    dispatch(setTab('view'));
    let bookings = await this.service.getBookings({ email: email.trim() });
    bookings = bookings.sort(this.sortByDate);
    for (const i in bookings) {
      bookings[i].expand = false;
    }
    this.setState({ bookings });
  }

  selectBooking = (index) => {
    const { bookings } = this.state;
    bookings[index].selected = !bookings[index].selected;
    this.setState({ bookings });
  };

  render() {
    const { bookings, sort } = this.state;
    return (
      <div>
        <div className="details" id="view-previous-header">
          My Bookings
        </div>

        <div className="toggle-buttons">
          <div
            className={`toggle-button toggle-date ${
              sort === 'date' ? 'toggle-active' : 'toggle-inactive'
            }`}
            onClick={this.dateSort}
          >
            Date
          </div>
          <div
            className={`toggle-button ${
              sort === 'office' ? 'toggle-active' : 'toggle-inactive'
            }`}
            onClick={this.officeSort}
          >
            Office
          </div>
          <div
            className={`toggle-button toggle-desk ${
              sort === 'desk' ? 'toggle-active' : 'toggle-inactive'
            }`}
            onClick={this.deskSort}
          >
            Desk
          </div>
        </div>

        <div className="search-results">
          {bookings.length > 0 ? (
            bookings.map((booking, index) => (
              <div key={uuid()}>
                <div className="booking-list">
                  <div className="booking date">
                    {booking.date.substr(0, 10)}
                  </div>
                  <div className="booking data">
                    Office:
                    {booking.office}
                  </div>
                  <div className="booking data">
                    Floor:
                    {booking.floor}
                  </div>
                  <div className="booking data">
                    Desk:
                    {booking.desk}
                  </div>
                  <a
                    className="booking book-link"
                    onClick={() => {
                      this.selectBooking(index);
                    }}
                  >
                    {!booking.selected
                      ? '+ View on floorplan'
                      : ' - Collapse floorplan'}
                  </a>
                  <div className="floorplan-box">
                    {booking.selected ? (
                      <FloorView
                        date={booking.date}
                        floor={booking.floor}
                        office={booking.office}
                        desk={booking.desk}
                      />
                    ) : (
                      ''
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="booking date">No Bookings Made Yet.</div>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  email: state.user,
});

export default connect(mapStateToProps)(Restrictions);
