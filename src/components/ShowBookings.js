import React from 'react';
import { connect } from 'react-redux';
import './../styles/base.css';
import '../styles/legend.css';
import { setTab } from '../actions';
import BookingService from './../services/bookingService';
import FloorService from './../services/floorService';
import uuid from 'uuid';
import Image from './image';
import Logo from './logo';
import { Link, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

/** Shows the floorplan with the desks and bookings ina given time fram */
class ShowBookings extends React.Component {
  /** */
  constructor(props) {
    super(props);

    /** Start with an empty set of bookings*/
    this.state = { bookings: [], floor: null };
    /** To get the bookings within the dates */
    this.service = new BookingService();
    /** To get the floor image and desk icons */
    this.floorService = new FloorService();
    this.getFloor();
  }

  /** Takes a date and returns the next day */
  nextDay(start) {
    var tomorrow = new Date(start);
    tomorrow.setDate(start.getDate() + 1);
    return tomorrow;
  }

  /** Formats the date for requesting to DB - (mongo date structure) */
  formatDate(d) {
    var month = '' + d.getMonth();
    var day = '' + d.getDate();
    var year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
  }

  /** Gets the floor info from db */
  getFloor = async () => {
    try {
      const { floor, office } = this.props.view;
      var theFloor = await this.floorService.getFloors({
        floor: floor,
        office: office,
      });
      this.setState({ floor: theFloor[0] });
    } catch (err) {
      this.setState({ floor: 'NaN' });
    }
  };

  /** Gets the x-offset for each of the desk icons on the floorplan */
  calcX = (x) => {
    const { floor } = this.state;
    var contX = $(window).width() * 0.6;
    var ratio = contX / floor.width;
    return x * ratio + (40 * contX) / 2000;
  };
  /** Gets the y-offset for each of the desk icons on the floorplan */
  calcY = (x) => {
    const { floor } = this.state;
    var contY = $(window).width() * 0.6 * (floor.height / floor.width);
    var ratio = contY / floor.height;
    return x * ratio + (40 * contY) / 1500;
  };

  /** Fetches the bookings from the DB*/
  async componentDidMount() {
    const { dispatch } = this.props;
    const { view } = this.props;
    dispatch(setTab('viewAll'));
    if (!view) {
      return;
    }
    const startDate = view.dates.split('-');
    var start = new Date(startDate[2].trim(), startDate[1], startDate[0]);
    var end = new Date(startDate[5], startDate[4], startDate[3].trim());
    var bookings = [];
    while (true) {
      var d = this.formatDate(start);
      var body = {
        office: view.office,
        floor: view.floor,
        date: d,
      };
      await this.service.getBookings(body).then((data) => {
        bookings = bookings.concat(data);
      });
      start = this.nextDay(start);
      if (start > end) {
        break;
      }
    }
    this.setState({ bookings: bookings });
  }

  /** */
  render() {
    const { bookings, floor } = this.state;
    const { view } = this.props;
    /** If the user reloads, redux store is cleared, so have to send back out to select details page */
    if (view === null) {
      return <Redirect to="/viewAllBookings"></Redirect>;
    }
    if (floor === 'NaN') {
      return (
        <div>Error fetching floor. Check your connection and try again.</div>
      );
    }
    var nested = [];
    /**119-137 format the bookings as nested arrays, where each bottom-level array represents all bookings on one date */
    if (bookings.length > 0) {
      var i = 0;
      while (1) {
        let start = bookings[i].date;
        var onThisDay = [];
        while (1) {
          onThisDay.push(bookings[i]);
          i = i + 1;
          if (i >= bookings.length || bookings[i].date !== start) {
            break;
          }
        }
        if (onThisDay.length > 0) nested.push(onThisDay);
        if (i >= bookings.length) {
          break;
        }
      }
    }

    if (floor === null) {
      return <Logo />;
    }

    return (
      <div>
        <div className="legend">
          <div className="legend-p">
            <div className="legend-icon green" />
            <div className="legend-text"> Bookable </div>
            <div className="legend-icon grey" />
            <div className="legend-text"> Unbookable </div>
          </div>
        </div>
        <div className="pics2" id="container">
          {floor.desks.map((desk) => (
            <div
              className={`desk-icon-admin-small ${
                desk.bookable ? 'bookable' : 'unbookable-admin'
              }`}
              onClick={() => this.select(desk.name)}
              style={{ left: this.calcX(desk.x), top: this.calcY(desk.y) }}
              key={uuid()}
            >
              <div className="desk-icon-div-admin">
                {desk.name} <br />
                <i className="laptop icon desk-i-admin" />{' '}
              </div>
            </div>
          ))}
          <Image data={floor.image.data.data}></Image>{' '}
        </div>
        <div className="details show"> Bookings </div>
        <div className="sub-header">
          You are viewing bookings for floor <b>{view.floor}</b> at{' '}
          <b>{view.office + ' '}</b>
          for <b>{view.dates}</b>
        </div>
        <div className="bookings">
          {nested.length > 0 ? (
            nested.map((bookingDay) => (
              <div key={uuid()}>
                <div className="booking date">
                  Date: {bookingDay[0].date.substr(0, 10)}
                </div>
                {bookingDay.map((booking) => (
                  <div key={uuid()}>
                    <div className="booking desk"> Desk {booking.desk} </div>
                    <div className="booking data">
                      {booking.name} <br></br>
                      {booking.email}
                    </div>
                  </div>
                ))}
              </div>
            ))
          ) : (
            <div className="booking desk">No desk bookings scheduled.</div>
          )}
        </div>
        <div className="show-back">
          <Link to="/">
            <div className="ui blue button">Back</div>
          </Link>
        </div>
      </div>
    );
  }
}

ShowBookings.propTypes = {
  view: PropTypes.object,
  dispatch: PropTypes.func,
};

/** Stick view into props */
const mapStateToProps = (state) => ({
  view: state.view,
});

export default connect(mapStateToProps)(ShowBookings);
