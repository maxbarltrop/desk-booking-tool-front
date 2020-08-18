import React from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { setTab } from '../actions';
import './../styles/base.css';
import { Card, Header } from 'semantic-ui-react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import FloorService from '../services/floorService';
import Dialog from '@material-ui/core/Dialog';
import uuid from 'uuid';
import Image from './image';
import Logo from './logo';
import PropTypes from 'prop-types';
/** For editing the restrictions on the floorplan image*/
class SetRestrictions extends React.Component {
  /**  */
  constructor(props) {
    super(props);

    /** Stores floor info. Deskdict keys the desk names to a boolean indicating whether they are bookable.
     * Desks is just the desks array from the floor
     */
    this.state = {
      desks: [],
      image: null,
      done: false,
      floor: null,
      deskDict: {},
    };
    /** Service to get floor */
    this.service = new FloorService();
    this.getDesks();
  }
  /** Set tab for navbar */
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(setTab('desks'));
  }
  /** Update the desk dict when a checkbox is toggled  */
  handleChecking = (e) => {
    var { deskDict } = this.state;
    deskDict[e.target.name] = !deskDict[e.target.name];
    this.setState({ deskDict: deskDict });
  };
  /** Returns the x-offset for the desk icon */
  calcX = (x) => {
    const { floor } = this.state;
    var contX = $(window).width() * 0.8;
    var ratio = contX / floor.width;
    return x * ratio + (40 * contX) / 2000;
  };
  /** Returns the y-offset for a desk icon*/
  calcY = (x) => {
    const { floor } = this.state;
    var contY = $(window).width() * 0.8 * (floor.height / floor.width);
    var ratio = contY / floor.height;
    return x * ratio + (40 * contY) / 1500;
  };
  /** Set the state up with all the floor data  */
  getDesks = async () => {
    var { rest } = this.props;
    var floors = await this.service.getFloors(rest);
    var desks = floors[0].desks;
    var image = floors[0].image;
    var floor = floors[0];
    var deskDict = {};
    for (let i in desks) {
      deskDict[desks[i].name] = desks[i].bookable;
    }
    this.setState({
      desks: desks,
      image: image,
      floor: floor,
      deskDict: deskDict,
    });
  };

  /** Write to DB using edit method, but submitting every value as a call */
  save = async () => {
    // make some call to axios to write the restrictions to the DB
    const { desks, deskDict } = this.state;
    const { rest } = this.props;
    desks.map((desk) => {
      this.service.editFloors({
        office: rest.office,
        floor: rest.floor,
        desk: desk.name,
        x: desk.x,
        y: desk.y,
        bookable: deskDict[desk.name],
      });
    });
    this.setState({ done: true });
  };
  /** Reload the page after */
  done = () => {
    window.location.reload();
  };
  /** For checking the checkbox on the icon */
  handle = (name) => {
    var { deskDict } = this.state;
    deskDict[name] = !deskDict[name];
    this.setState({ deskDict: deskDict });
  };
  /** */
  render() {
    const { rest } = this.props;
    const { desks, image, deskDict } = this.state;

    if (rest === null) {
      return <Redirect to="/restrict"></Redirect>;
    }

    return (
      <div>
        <div className="details show"> Desk Restrictions </div>
        <div className="sub-header">
          You are setting restrictions for floor <b>{rest.floor}</b> at{' '}
          <b>
            {rest.office + ' '}. Use the checkboxes on the floorplan or at the
            bottom of the page to mark which desks can be booked. Changes will
            only apply to future bookings.{' '}
          </b>
        </div>
        <div className="pics" id="container">
          {image ? <Image data={image.data.data}></Image> : <Logo />}
          {desks.map((desk) => (
            <div
              className={`desk-icon-admin ${
                deskDict[desk.name] ? 'bookable' : 'unbookable-admin'
              }`}
              key={uuid()}
              style={{ left: this.calcX(desk.x), top: this.calcY(desk.y) }}
            >
              <div className="desk-icon-div-admin">
                {desk.name}
                <br />
                <i className="laptop icon desk-i-admin" />
                <br />
                <div className="ui checkbox">
                  <input
                    type="checkbox"
                    name="example"
                    onChange={() => this.handle(desk.name)}
                    checked={deskDict[desk.name]}
                  />
                  <label />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="restrictions">
          {desks.map((desk) => (
            <FormControlLabel
              control={
                <Checkbox
                  checked={deskDict[desk.name]}
                  onChange={this.handleChecking}
                  name={desk.name}
                  color="primary"
                />
              }
              label={desk.name}
              key={uuid()}
            />
          ))}{' '}
        </div>
        <Link to="/restrict">
          <div className="ui blue button">Back</div>
        </Link>
        <div className="ui blue button" onClick={this.save}>
          Save
        </div>
        <Dialog
          open={this.state.done}
          aria-labelledby="form-dialog-title"
          style={{ width: '100%', maxWidth: 'xl' }}
        >
          <Card>
            <Header>Your changes have been saved.</Header>
            <div className="ui blue button done" onClick={this.done}>
              Done
            </div>
          </Card>
        </Dialog>
      </div>
    );
  }
}

SetRestrictions.propTypes = {
  rest: PropTypes.objectOf(PropTypes.object),
  dispatch: PropTypes.func,
};
/** Puts the restrictions info into a prop for diplaying  */
const mapStateToProps = (state) => ({
  rest: state.rest,
});

export default connect(mapStateToProps)(SetRestrictions);
