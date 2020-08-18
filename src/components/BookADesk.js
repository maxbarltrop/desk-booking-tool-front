import React from 'react';
import { setTab, setFloor, setLimit, setBookingInfo } from '../actions';
import { connect } from 'react-redux';
import '../styles/base.css';
import { DateInput } from 'semantic-ui-calendar-react';
import { Form } from 'semantic-ui-react';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import uuid from 'uuid';
import moment from 'moment';
import BookingRestrictionService from '../services/bookingRestrictionService';
import FloorService from '../services/floorService';
import history from '../history';

class Book extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: '',
      office: '',
      floor: '',
      err: false,
      floors: [],
    };

    this.service = new FloorService();
    this.resService = new BookingRestrictionService();
    this.getFloors();
    this.getLimits();
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(setTab('book'));
  }

  getFloors = async () => {
    const floors = await this.service.getFloors({});
    this.setState({ floors });
  };

  getLimits = async () => {
    const { dispatch } = this.props;
    const limit = await this.resService.getRestrictions();
    dispatch(setLimit(limit[0]));
  };

  handleDateChange = (e, { value }) => {
    this.setState({ date: `${value}` });
  };

  handleOffice = (e) => {
    this.setState({ office: e.target.value });
  };

  handleFloor = (e) => {
    this.setState({ floor: e.target.value });
  };

  maxDate = () => {
    let { limit } = this.props;
    if (!limit) limit = { continuous: 0, ahead: 0 };
    const maxDate = moment();
    maxDate.add(limit.ahead, 'days');
    return maxDate;
  };

  handleCancel = () => {
    this.setState({
      date: '',
      office: '',
      floor: '',
    });
  };

  onNext = async () => {
    const { date, office, floor, floors } = this.state;
    const { dispatch } = this.props;
    await this.setState({ err: false });
    if (date === '' || office === '' || floor === '') {
      await this.setState({ err: true });
    } else {
      const { image } = floors.find(
        (elm) => elm.office == office && elm.floor == floor
      );
      const obj = {
        office,
        floor,
        date,
        image,
      };
      const selectedFloor = floors.find(
        (f) => f.office === office && f.floor === floor
      );
      dispatch(setFloor(selectedFloor));
      dispatch(setBookingInfo(obj));
      history.push('/setBooking');
    }
  };

  render() {
    const { err, floors } = this.state;
    let { limit } = this.props;
    this.maxDate();
    if (!limit) limit = { continuous: 0, ahead: 0 };
    const offices = [];
    for (const i in floors) {
      if (!offices.includes(floors[i].office)) offices.push(floors[i].office);
    }
    return (
      <div>
        <div className="details"> Details </div>
        <div className="note">
          You can book as much as {limit.continuous} continuous days and a
          maximum of {limit.ahead} days ahead
        </div>
        <Form className="detail-from">
          <FormControl variant="outlined" className="my-input">
            <InputLabel
              id="demo-simple-select-outlined-label"
              className="my-text"
            >
              Office
            </InputLabel>
            <Select
              labelId="demo-simple-select-outlined-label"
              className="my-text"
              id="demo-simple-select-outlined"
              onChange={this.handleOffice}
              label="Office"
              value={this.state.office}
            >
              {offices.map((office) => (
                <MenuItem value={office} className="my-text" key={uuid()}>
                  {office}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl variant="outlined" className="my-input">
            <InputLabel
              id="demo-simple-select-outlined-label"
              className="my-text"
            >
              Floor
            </InputLabel>
            <Select
              labelId="demo-simple-select-outlined-label"
              className="my-text"
              id="demo-simple-select-outlined"
              onChange={this.handleFloor}
              label="Floor"
              value={this.state.floor}
            >
              {this.state.office ? (
                floors.map((floor) =>
                  floor.office === this.state.office ? (
                    <MenuItem
                      value={floor.floor}
                      className="my-text"
                      key={uuid()}
                    >
                      {floor.floor}
                    </MenuItem>
                  ) : (
                    ''
                  )
                )
              ) : (
                <MenuItem value="" className="my-text" disabled>
                  No office selected
                </MenuItem>
              )}
            </Select>
          </FormControl>
          <DateInput
            name="datesRange"
            className="my-input my-text"
            placeholder="Select a Date"
            value={this.state.date}
            iconPosition="left"
            onChange={this.handleDateChange}
            maxDate={this.maxDate()}
          />
          <div className="ui button cancel" onClick={this.handleCancel}>
            Reset
          </div>

          <div className="ui blue button" onClick={this.onNext}>
            Next
          </div>
        </Form>
        {err ? (
          <div className="err">
            ! Please fill in all fields before continuing
          </div>
        ) : (
          ''
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  limit: state.limit,
});

export default connect(mapStateToProps)(Book);
