import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import uuid from 'uuid';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormControl';
import FormControl from '@material-ui/core/FormControl';
import history from '../history';
import { setTab, setDesk } from '../actions';
import '../styles/base.css';
import BookingService from '../services/bookingService';
import Image from './image';
import Legend from './legend';

class setBooking extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      desk: '',
      booked: {},
      err: false,
      selected: {},
      loading: true,
    };

    this.service = new BookingService();
    this.getBookings();
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(setTab('book'));
  }

  handleDesk = (e) => {
    this.setState({ desk: e.target.value });
    const { desks } = this.props.floor;
    if (desks.find((element) => element.name === e.target.value)) {
      this.select(e.target.value);
    }
  };

  load = () => {
    setTimeout(() => {
      this.setState({ loading: false });
    }, 700);
  };

  format = (d) => {
    const date = d.split('-');
    return [date[2], date[1], date[0]].join('-');
  };

  getBookings = async () => {
    const { booking, floor } = this.props;
    if (!booking) return;
    const bookings = await this.service.getBookings({
      date: this.format(booking.date),
      office: booking.office,
      floor: booking.floor,
    });
    var booked = {};
    var selected = {};
    // floor.desks.forEach((element) => {
    //   selected[element.id] = false;
    //   if (bookings.find((booking) => booking.desk === element.name)) {
    //     booked[element.name] = true;
    //   } else {
    //     booked[element.name] = false;
    //   }
    // });

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

    // for (const i in floor.desks) {
    //   selected[floor.desks[i].name] = false;
    //   if (
    //     bookings.find((booking) => booking.desk === floor.desks[i].name)
    //     !== undefined
    //   ) {
    //     booked[floor.desks[i].name] = true;
    //   } else {
    //     booked[floor.desks[i].name] = false;
    //   }
    // }
    this.setState({ booked, selected });
  };

  save = () => {
    const { dispatch } = this.props;
    const { desk } = this.state;
    this.setState({ err: false });
    if (desk === '') {
      this.setState({ err: true });
    } else {
      dispatch(setDesk(desk));
      history.push('/Confirmation');
    }
    return true;
  };

  calcX = (x) => {
    const { floor } = this.props;
    var contX = $(window).width() * 0.8;
    var ratio = contX / floor.width;
    return x * ratio + (40 * contX) / 2000;
  };

  calcY = (x) => {
    const { floor } = this.props;
    var contY = $(window).width() * 0.8 * (floor.height / floor.width);
    var ratio = contY / floor.height;
    return x * ratio + (40 * contY) / 1500;
  };

  select = (name) => {
    const { selected } = this.state;
    const { booked } = this.state;
    const { desks } = this.props.floor;
    desks.forEach((desk) => {
      if (desk.name === name) {
        if (!booked[desk.name] && desk.bookable) {
          this.setState({ desk: name });

          desks.forEach((elm) => {
            if (elm.name !== name) {
              selected[elm.name] = false;
            }
          });

          // for (const i in desks) {
          //   if (desks[i].name !== name) {
          //     selected[desks[i].name] = false;
          //   }
          // }
          selected[name] = true;
        }
      }
    });
    this.setState({ selected });
  };

  render() {
    const { booking, floor } = this.props;
    const { booked, err, selected } = this.state;
    if (floor === null) {
      history.push('/BookADesk');
      return null;
    }
    return (
      <div>
        <Legend available unbookable selected booked />
        <div className="sub-header">
          Click on an available desk to make a booking for floor{' '}
          <b>{booking.floor}</b> at{' '}
          <b>
            {`${booking.office} `} for
            {booking.date}{' '}
          </b>{' '}
        </div>
        <div className="pics" id="container">
          {floor.desks.map((desk) => (
            <div
              type="button"
              className={`desk-icon ${
                !selected[desk.name]
                  ? desk.bookable
                    ? booked[desk.name]
                      ? 'booked'
                      : 'available'
                    : 'unbookable'
                  : 'selected'
              }`}
              onClick={() => this.select(desk.name)}
              onKeyDown={(ev) => {
                if (ev.keyCode == 13) {
                  this.select(desk.name);
                }
              }}
              style={{ left: this.calcX(desk.x), top: this.calcY(desk.y) }}
            >
              <div className="desk-icon-div">
                {desk.name} <br />
                <i className="laptop icon desk-i-admin" />{' '}
              </div>
            </div>
          ))}
          <Image data={floor.image.data.data} />{' '}
        </div>

        <div className="sub-header">Or, select from menu:</div>
        <div className="restrictions">
          <FormControl variant="outlined" className="my-input desk-box">
            <InputLabel
              id="demo-simple-select-outlined-label"
              className="my-text"
            >
              Desk
            </InputLabel>
            <Select
              labelId="demo-simple-select-outlined-label"
              className="my-text"
              id="demo-simple-select-outlined"
              onChange={this.handleDesk}
              label="Office"
              value={this.state.desk}
            >
              {floor.desks.map((desk) => (
                <MenuItem
                  value={desk.name}
                  className="my-text"
                  key={uuid()}
                  disabled={!desk.bookable || booked[desk.name]}
                >
                  {`${desk.name} ${
                    desk.bookable
                      ? booked[desk.name]
                        ? '(Booked)'
                        : ''
                      : '(Not bookable)'
                  }`}
                </MenuItem>
              ))}
            </Select>
            {err ? (
              <FormHelperText>
                Please select a desk before continuing
              </FormHelperText>
            ) : (
              ''
            )}
          </FormControl>
        </div>
        <div
          className="ui button"
          onClick={() => {
            history.push('/BookADesk');
          }}
        >
          Back
        </div>
        <div className="ui blue button" onClick={this.save}>
          Next
        </div>
      </div>
    );
  }
}

/**
 * PropType checking
 */
setBooking.propTypes = {
  dispatch: PropTypes.func,
  floor: PropTypes.PropTypes.object,
  booking: PropTypes.PropTypes.object,
};

/**
 * mapStateToProps function imports the required states from the store
 * as Props
 */
const mapStateToProps = (state) => ({
  booking: state.booking,
  floor: state.floor,
});

export default connect(mapStateToProps)(setBooking);
