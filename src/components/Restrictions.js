import React from 'react';
import '../styles/Restrictions.css';
import { setTab } from '../actions';
import { connect } from 'react-redux';
import BookingRestrictionService from '../services/bookingRestrictionService';
import { setBookingRestrictions } from '../actions';
import PropTypes from 'prop-types';

/** Set continuous and ahead */
class Restrictions extends React.Component {
  /** */
  constructor(props) {
    super(props);
    /** Initializes the variables before the call*/
    this.state = {
      Continuous: '',
      Ahead: '',
      Error: false,
    };
    /** service to get bookings */
    this.bookingRestrictionService = new BookingRestrictionService();
  }
  /** Fetch the current values */
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(setTab('res'));
    this.bookingRestrictionService.getRestrictions().then((data) => {
      dispatch(
        setBookingRestrictions({
          CurrentContinuous: data[0].continuous,
          CurrentAhead: data[0].ahead,
        })
      );
    });
  }

  /** Check that both fields are number and submit to the DB */
  onUserSubmit = () => {
    const { current } = this.props;
    if (isNaN(this.state.Continuous) || isNaN(this.state.Ahead)) {
      this.setState({ Continuous: null, Ahead: null, Error: true });
    } else {
      this.setState({ Error: false });
    }
    // Send new numbers to backend
    console.log(this.state.Continuous || current.CurrentContinuous);
    this.bookingRestrictionService.postRestrictions(
      this.state.Continuous || current.CurrentContinuous,
      this.state.Ahead || current.CurrentAhead
    );
    this.setState({ Continuous: '', Ahead: '' });
    window.location.reload(false);
  };

  /** */
  render() {
    const { current } = this.props;
    return (
      <div className="App">
        <div className="Restrictions">
          <h1 className="title">Number of Continuous Days Allowed</h1>
          {this.state.Error ? (
            <h2 className="Error">Input must be a number!</h2>
          ) : null}
          <div className="Wrapper">
            <div className="ui input">
              <input
                type="text"
                placeholder="Enter a #"
                onChange={(event) => {
                  this.setState({ Continuous: event.target.value });
                }}
                value={this.state.Continuous}
              />
            </div>
            <h1 className="Current">
              {' '}
              &nbsp;Current: {current.CurrentContinuous}
            </h1>
          </div>
          <h1 className="title">Number of Days Ahead an Employee Can Book</h1>
          {this.state.Error ? (
            <h2 className="Error">Input must be a number!</h2>
          ) : null}
          <div className="Wrapper">
            <div className="ui input">
              <input
                type="text"
                placeholder="Enter a #"
                onChange={(event) => {
                  this.setState({ Ahead: event.target.value });
                }}
                value={this.state.Ahead}
              />
            </div>
            <h1 className="Current"> &nbsp;Current: {current.CurrentAhead}</h1>
          </div>
          <h1 className="Note">
            Note: Changes will only apply to future bookings.
          </h1>
          <div className="ui blue button" onClick={this.onUserSubmit}>
            Save
          </div>
        </div>
      </div>
    );
  }
}

Restrictions.propTypes = {
  current: PropTypes.objectOf(PropTypes.object),
  dispatch: PropTypes.func,
};

/** Redux */
const mapStateToProps = (state) => ({
  current: state.bookingRestriction,
});

export default connect(mapStateToProps)(Restrictions);
