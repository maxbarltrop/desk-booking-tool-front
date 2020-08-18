import React, { Component } from 'react';
import '../styles/Navbar.css';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import AuthContext from '../services/auth';

class UserNavbar extends React.Component {
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
        <button
          className="logout-button"
          onClick={() => {
            AuthContext.logOut();
          }}
        >
          Log Out
        </button>

        <div className="custom-divider"> </div>
        <div className="ui blue two item menu">
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
        </div>
        <div className="custom-divider"> </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  tab: state.tab,
});

export default connect(mapStateToProps)(UserNavbar);
