import React from 'react';
import { connect } from 'react-redux';
import './../styles/base.css';
import { Form } from 'semantic-ui-react';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import { setTab, setRestInfo } from '../actions';
import FloorService from './../services/floorService';
import uuid from 'uuid';
import { Redirect, Link } from 'react-router-dom';
import PropTypes from 'prop-types';

/** For setting desk restrictions */
class RestrictDesks extends React.Component {
  /** */
  constructor(props) {
    super(props);
    /** Manage the data*/
    this.state = { office: '', floor: '', err: false, floors: '', done: false };
    /** Initialize a floroservie */
    this.service = new FloorService();
    this.getFloors();
  }
  /** Set tab */
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(setTab('desks'));
  }

  /** On office change */
  handleOffice = (e) => {
    this.setState({ office: e.target.value });
  };

  /** On floor change*/
  handleFloor = (e) => {
    this.setState({ floor: e.target.value });
  };

  /** Send the info the redux store and move to page with floorplan */
  onNext = async () => {
    const { office, floor } = this.state;
    const { dispatch } = this.props;
    await this.setState({ err: false });
    if (office === '' || floor === '') {
      await this.setState({ err: true });
    } else {
      const obj = { office: office, floor: floor };
      dispatch(setRestInfo(obj));
      this.setState({ done: true });
    }
  };

  /** fetch floors from the backend */
  getFloors = async () => {
    const floors = await this.service.getFloors({});
    this.setState({ floors: floors });
  };

  /** render */
  render() {
    const { err, floors, done } = this.state;
    if (done) {
      return <Redirect to="/setRestriction" />;
    }
    var offices = [];
    for (let i in floors) {
      if (!offices.includes(floors[i].office)) offices.push(floors[i].office);
    }

    return (
      <div>
        <div className="details"> Set/View Restrictions</div>
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

RestrictDesks.propTypes = {
  dispatch: PropTypes.func,
};

export default connect()(RestrictDesks);
