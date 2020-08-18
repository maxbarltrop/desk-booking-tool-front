import React, { Component } from 'react';
import { connect } from 'react-redux';
import Draggable from 'react-draggable';
import FloorService from '../services/floorService';
import '../styles/base.css';
import uuid from 'uuid';
import { Redirect } from 'react-router-dom';
import { Button } from '@material-ui/core';
import { setTab } from '../actions';
import { Dialog, Select, MenuItem, InputLabel } from '@material-ui/core';
import { Card, Header } from 'semantic-ui-react';
import FormData from 'form-data';
import axios from 'axios';
import PropTypes from 'prop-types';

/** Gets the URL to make axios call from this file */
const URL = process.env.REACT_APP_API;
/** The component to drag desks and make a floor  */
class DragBox extends Component {
  /** */
  constructor(props) {
    super(props);
    /** Initialize state*/
    this.state = {
      disabled: false,
      name: '',
      floors: [],
      desks: [],
      autofill: false,
      openAuto: false,
      confirm: false,
      finalDesks: [],
      floorName: '',
      office: '',
    };
    /** To get the floors for when the user saves */
    this.service = new FloorService();
    this.getFloors();
    /** Style for icons that are bokable desks */
    this.bookStyle = {
      width: 90,
      border: '1px solid grey',
      padding: '2px 6px 1px 6px',
      backgroundColor: 'rgba(180,180,180,0.9)',
      borderRadius: '6px',
    };
    /** Style for icons that are unbookable */
    this.unbookStyle = {
      width: 90,
      border: '1px solid lightgrey',
      padding: '2px 6px 1px 6px',
      backgroundColor: 'rgba(150,255,150,0.95)',
      borderRadius: '6px',
    };
    /** Moves the deleted icons off the screen */
    this.deletedStyle = {
      width: 90,
      opacity: 0,
      zIndex: -10,
    };
  }
  /** Set the tab for the navbar */
  componentDidMount() {
    this.props.dispatch(setTab('add'));
  }
  /** Return a new desk */
  makeDesk = () => {
    var desk = {
      disabled: false,
      id: uuid(),
      name: '',
      bookable: true,
      deleted: false,
      x: 0,
      y: 0,
    };
    this.setState({ desks: [...this.state.desks, desk] });
  };
  /** Get floors from the DB  */
  getFloors = async () => {
    const floors = await this.service.getFloors({});
    this.setState({ floors: floors });
  };
  /** Toggle an element between locked and draggable */
  toggleDraggable = (id) => {
    var desks = this.state.desks;
    for (let i in desks) {
      if (desks[i].id === id) {
        desks[i].disabled = !desks[i].disabled;
      }
    }
    this.setState({ desks: desks });
  };
  /** Toggle bookable <---> unbookable  */
  click = (id) => {
    var desks = this.state.desks;
    for (let i in desks) {
      if (desks[i].id === id) {
        desks[i].bookable = !desks[i].bookable;
      }
    }
    this.setState({ desks: desks });
  };
  /** Sets a desk to deleted so it will no longer appear */
  delete = (id) => {
    var desks = this.state.desks;
    for (let i in desks) {
      if (desks[i].id === id) {
        desks[i].deleted = true;
      }
    }
    this.setState({ desks: desks });
  };

  /** Value setter */
  rename = (e) => {
    const { id, value } = e.target;
    var desks = this.state.desks;
    for (let i in desks) {
      if (desks[i].id === id) {
        desks[i].name = value;
      }
    }
    this.setState({ desks: desks });
  };

  /** Writes all the info to database using formdata */
  /** Saves the width and height of the floorplan as it was made so that the positions can
   * be scaled for smaller or larger screens on other tabs
   * Uses jQuery to get the position of all the desks, and saves that along with the desk name
   * and bookability
   */
  done = () => {
    var finalDesks = [];
    let cont = document.getElementById('dragContainer').getBoundingClientRect();
    var { desks, autofill } = this.state;
    var x = true;
    var i = 1;
    desks.map((desk) => {
      let newDesk = { bookable: desk.bookable, name: desk.name };
      if (newDesk.name === '' && !desk.deleted) {
        /** Starting with 1, try and set desk names */
        if (autofill) {
          while (1) {
            if (desks.find((d) => d.name == i.toString()) === undefined) {
              newDesk.name = i.toString();
              i = i + 1;
              break;
            }
          }
        } else {
          this.setState({ openAuto: true });
          x = false;
        }
      }
      let elem = document.getElementById(desk.id).getBoundingClientRect();
      newDesk['x'] = elem.x - cont.x - 0.6;
      newDesk['y'] = elem.y - cont.y - 0.6;
      if (!desk.deleted) {
        finalDesks.push(newDesk);
      }
    });
    if (x) {
      this.setState({ confirm: true, finalDesks: finalDesks, autofill: false });
    }
  };

  /** Sets the autofill value to true, so the submit function will just generate desk names */
  autofill = async () => {
    await this.setState({ autofill: true, openAuto: false });
    this.done();
  };

  /** Once everything is verified, make an axios call */
  publish = async () => {
    const { finalDesks, office, floorName } = this.state;
    var containerHeight = document
      .getElementById('underlay')
      .getBoundingClientRect().height;
    var containerWidth = document
      .getElementById('dragContainer')
      .getBoundingClientRect().width;
    let data = new FormData();
    data.append('image', this.props.image.image, 'image');
    data.append('office', office);
    data.append('floor', floorName);
    data.append('width', containerWidth);
    data.append('desks', JSON.stringify(finalDesks));
    data.append('height', containerHeight);
    await axios
      .post(`http://${URL}/floorsFrontend`, data, {
        headers: {
          accept: 'application/json',
          'Accept-Language': 'en-US,en;q=0.8',
          'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
        },
      })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });

    location.reload();
  };

  /** Change the office name on the publish window */
  handleOffice = (e) => {
    this.setState({ office: e.target.value });
  };
  /** */
  render = () => {
    const { desks, floors, confirm, openAuto, office, floorName } = this.state;
    const { image } = this.props;

    if (image === null) {
      return <Redirect to="/addFloor" />;
    }
    const { url } = image;
    var offices = [];

    for (let i in floors) {
      if (!offices.includes(floors[i].office)) offices.push(floors[i].office);
    }

    return (
      <div>
        <div className="details"> Dynamic Floor Plan </div>
        <div className="detail-sub">
          Add desks using the button at the bottom of the page: drag and drop
          them onto the floorplan and enter a label.{' '}
        </div>
        <div id="dragContainer">
          <div className="underlay" id="underlay">
            <img src={url} alt="floorplan" className="floor-pic" />
          </div>

          <Button
            variant="contained"
            color="primary"
            className="mui-btn"
            onClick={this.done}
          >
            Done
          </Button>
          <Button
            variant="contained"
            color="primary"
            className="mui-btn"
            onClick={this.makeDesk}
          >
            <i className="plus icon pls"></i> New Desk
          </Button>
          {desks.map((desk) => (
            <Draggable
              disabled={desk.disabled}
              bounds="parent"
              key={desk.id}
              position={null}
            >
              <div
                style={
                  desk.deleted
                    ? this.deletedStyle
                    : !desk.bookable
                    ? this.bookStyle
                    : this.unbookStyle
                }
                className={
                  desk.disabled ? 'draggable' : 'draggable draggable-active'
                }
                id={desk.id}
              >
                <div className="edit-icon">
                  <div
                    className="my-i left"
                    onClick={() => this.toggleDraggable(desk.id)}
                  >
                    {desk.disabled ? (
                      <i className="hand rock icon"></i>
                    ) : (
                      <i className="lock icon"></i>
                    )}
                  </div>
                  <div
                    className="my-i right"
                    onClick={() => this.delete(desk.id)}
                  >
                    <i className="delete icon"></i>
                  </div>
                </div>
                <div className="icon-div">
                  <i className="laptop icon dbt-icon"></i>
                </div>
                <div className="ui input desk-input">
                  <input
                    type="text"
                    placeholder="Name"
                    onChange={this.rename}
                    value={desk.name}
                  ></input>
                </div>

                <div className="ui checkbox">
                  <input
                    type="checkbox"
                    name="example"
                    onChange={() => this.click(desk.id)}
                    checked={desk.bookable}
                  />
                  <label>Bookable?</label>
                </div>
                <br />
              </div>
            </Draggable>
          ))}
        </div>
        {/** Render the compenent to look at dialog flow. Will open the autfill? window first
         * if not all desks have names, and then the publish dialog
         */}
        {openAuto ? (
          <Dialog
            open={true}
            aria-labelledby="form-dialog-title"
            style={{ width: '100%', maxWidth: 'xl' }}
          >
            <Card className="my-card2">
              <Header className="conf-header">
                Some of Your Desks Don{"'"}t Have Names.
              </Header>
              <div className="thanks">Autofill them numerically?</div>
              <div
                className="ui button"
                id="pub-btn"
                onClick={() => {
                  this.setState({ openAuto: false });
                }}
              >
                Back
              </div>
              <div
                className="ui blue button"
                id="auto-btn"
                onClick={this.autofill}
              >
                Autofill
              </div>
            </Card>
          </Dialog>
        ) : (
          ''
        )}
        {confirm ? (
          <Dialog
            open={true}
            aria-labelledby="form-dialog-title"
            style={{ width: '100%', maxWidth: 'xl' }}
          >
            <Card className="my-card">
              <Header className="conf-header">Publish this floor?</Header>
              <div
                className="ui blue button"
                id="auto-btn"
                onClick={() => {
                  this.setState({ confirm: false });
                }}
              >
                Back
              </div>
              <InputLabel
                id="demo-simple-select-outlined-label"
                className="input-label"
              >
                Select Office
              </InputLabel>
              <Select
                labelId="demo-simple-select-outlined-label"
                className="office-selector"
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
              <div style={{ margin: 'auto' }}> {'//'} </div>
              <div className="ui input id-input office-input">
                <input
                  type="text"
                  placeholder="Enter a New Office Name"
                  onChange={(event) => {
                    this.setState({ office: event.target.value });
                  }}
                  value={this.state.office}
                />
              </div>
              <div className="ui input id-input">
                <input
                  type="text"
                  placeholder="Floor Name"
                  onChange={(event) => {
                    this.setState({ floorName: event.target.value });
                  }}
                  value={this.state.floorName}
                />
              </div>

              <div
                className={
                  office === '' || floorName === ''
                    ? 'ui blue button disabled'
                    : 'ui blue button'
                }
                id="pub-btn"
                onClick={this.publish}
              >
                Confirm
              </div>
            </Card>
          </Dialog>
        ) : (
          ''
        )}
      </div>
    );
  };
}

DragBox.propTypes = {
  image: PropTypes.objectOf(PropTypes.object),
  dispatch: PropTypes.func,
};

/** Redux */
const mapStateToProps = (state) => ({
  image: state.image,
});

export default connect(mapStateToProps)(DragBox);
