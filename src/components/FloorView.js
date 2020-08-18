import React from 'react';
import uuid from 'uuid';
import FloorService from '../services/floorService';
import BookingService from '../services/bookingService';
import Image from './image.js';
import Legend from './legend';
import Logo from './logo';

export default class FloorView extends React.Component {
  constructor(props) {
    super(props);

    this.state = { floor: null, booked: {}, selected: {} };

    this.floorService = new FloorService();
    this.bookingService = new BookingService();

    this.getBookings();
  }

  getFloor = async () => {
    const { floor, office } = this.props;
    const theFloor = await this.floorService.getFloors({
      floor,
      office,
    });
    this.setState({ floor: theFloor[0] });
  };

  getBookings = async () => {
    await this.getFloor();
    const { date, newFloor, office } = this.props;
    const { floor } = this.state;
    const bookings = await this.bookingService.getBookings({
      date,
      office,
      floor: newFloor,
    });
    var booked = {};
    var selected = {};
    for (let i in floor.desks) {
      selected[floor.desks[i].name] = false;
      if (
        bookings.find((booking) => booking.desk === floor.desks[i].name) !==
        undefined
      ) {
        booked[floor.desks[i].name] = true;
      } else {
        booked[floor.desks[i].name] = false;
      }
    }
    selected[this.props.desk] = true;
    this.setState({ booked: booked, selected: selected });
  };

  calcX = (x) => {
    const { floor } = this.state;
    const contX = $(window).width() * 0.6;
    const ratio = contX / floor.width;
    return x * ratio + (25 * contX) / 2000;
  };

  calcY = (x) => {
    const { floor } = this.state;
    const contY = $(window).width() * 0.6 * (floor.height / floor.width);
    const ratio = contY / floor.height;
    return x * ratio + (25 * contY) / 1500;
  };

  render() {
    const { date, office } = this.props;
    const { booked, floor, selected } = this.state;
    if (floor === null) {
      return <Logo />;
    }

    return (
      <div>
        <div className="view-sub-header">
          {date.substr(0, 10)} on {this.props.floor} at {office}
        </div>
        <Legend />
        <div className="pics2" id="container">
          <Image data={floor.image.data.data} />
          {floor.desks.map((desk) => (
            <div
              className={`desk-icon ${
                !selected[desk.name]
                  ? booked[desk.name]
                    ? 'booked'
                    : desk.bookable
                    ? 'avail'
                    : 'unbookable'
                  : 'selected'
              }`}
              key={uuid()}
              style={{ left: this.calcX(desk.x), top: this.calcY(desk.y) }}
            >
              <div className="desk-icon-div">
                {desk.name} <br />
                <i className="laptop icon desk-i" />{' '}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}
