import React from 'react';
import { connect } from 'react-redux';
import './../styles/base.css';
import { DatesRangeInput } from 'semantic-ui-calendar-react';
import { Form } from 'semantic-ui-react';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import { setViewInfo, setTab } from '../actions';
import FloorService from './../services/floorService';
import uuid from 'uuid';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

/**  To select the office, floor and date ranges for viewing bookings*/
class ViewBookings extends React.Component {
  /** */
  constructor(props) {
    super(props);
    /** All of the floor info */
    this.state = {
      datesRange: '',
      office: '',
      floor: '',
      image: null,
      err: false,
      done: false,
      floors: [],
    };
    /** To get the floor from the DB on next */
    this.service = new FloorService();
    this.getFloors();
  }

  /** set the navbar tab */
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(setTab('viewAll'));
  }
  /** Update the dates range */
  handleDateChange = (e, { value }) => {
    this.setState({ datesRange: `${value}` });
  };
  /** Update the office name */
  handleOffice = (e) => {
    this.setState({ office: e.target.value });
  };
  /** Update the floor name */
  handleFloor = (e) => {
    this.setState({ floor: e.target.value });
  };
  /** Resets the fields */
  handleCancel = () => {
    this.setState({
      datesRange: '',
      office: '',
      floor: '',
    });
  };
  /** Gets all the floors from the DB to feed into the list */
  getFloors = async () => {
    const floors = await this.service.getFloors({});
    this.setState({ floors: floors });
  };

  /**  Picks the info from the the floors array and puts it into redux for the show component */
  onNext = async () => {
    const { datesRange, office, floor, floors } = this.state;
    /** Finds the right floor from the array */
    const image = floors.find((elm) => {
      return elm.office == office && elm.floor == floor;
    }).image;
    const { dispatch } = this.props;
    await this.setState({ err: false });
    /** Shows an error if all the fields are not filled in */
    if (datesRange === '' || office === '' || floor === '') {
      await this.setState({ err: true });
    } else {
      const obj = {
        office: office,
        floor: floor,
        dates: datesRange,
        image: image,
      };
      /** Sends info to redux for the next page (ShowBookings) */
      await dispatch(setViewInfo(obj));
      this.setState({ done: true });
    }
  };
  /** */
  render() {
    const { err, floors, done } = this.state;
    var offices = [];

    if (done) {
      return <Redirect to="/bookings"></Redirect>;
    }

    for (let i in floors) {
      if (!offices.includes(floors[i].office)) offices.push(floors[i].office);
    }

    return (
      <div>
        <div className="details"> Details </div>
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
                <MenuItem value="" className="my-text" disabled={true}>
                  No office selected
                </MenuItem>
              )}
            </Select>
          </FormControl>
          <DatesRangeInput
            name="datesRange"
            className="my-input my-text"
            placeholder="From - To"
            value={this.state.datesRange}
            iconPosition="left"
            onChange={this.handleDateChange}
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

ViewBookings.propTypes = {
  dispatch: PropTypes.func,
};

export default connect()(ViewBookings);
