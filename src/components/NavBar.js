import React, { Component } from 'react';
import '../styles/Navbar.css';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

export class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.active = 'item active';
    this.inactive = 'item';
  }

  render() {
    const { tab } = this.props;

    return (
      <div>
        <Link to="/feedback" className="feedback-link">
          <div className="site-feedback">
            {' '}
            <i class="wrench icon" />
            Site Feedback{' '}
          </div>
        </Link>
        <div className="site-header">Desk Booking Tool</div>
        <div className="site-subheader">User Panel</div>

        <div className="custom-divider"> </div>
        <div className="ui blue six item menu">
          <Link
            to="/BookADesk"
            className={tab === 'book' ? this.active : this.inactive}
          >
            Book A Desk
          </Link>
          <Link
            className={tab === 'view' ? this.active : this.inactive}
            to="/ViewPreviousBookings"
          >
            View My Previous Bookings
          </Link>
          <Link
            to="/ViewAllBookings"
            className={tab === 'viewAll' ? this.active : this.inactive}
          >
            View All Bookings
          </Link>
          <Link
            className={tab === 'res' ? this.active : this.inactive}
            to="/userRestrictions"
          >
            Timing Restrictions
          </Link>
          <Link
            className={tab === 'desks' ? this.active : this.inactive}
            to="/restrict"
          >
            Restrict Desks
          </Link>
          <Link
            className={tab === 'add' ? this.active : this.inactive}
            to="/addFloor"
          >
            Add a Floor
          </Link>
        </div>
        <div className="custom-divider"> </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  tab: state.tab,
});

export default connect(mapStateToProps)(Navbar);
