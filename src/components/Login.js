import React, { PureComponent } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import '../styles/Login.css';
import Navbar from 'react-bootstrap/Navbar';
import logo from '../assets/logo-blue-2X.png';
import AuthContext from '../services/auth';
/**
 * login component
 */
class Login extends PureComponent {
  /**
   * log in
   */
  loginAdal = () => {
    AuthContext.login();
  };

  /**
   * renders login component
   */
  render() {
    return (
      <div>
        <Navbar bg="light" expand="lg" className="login-navbar">
          <img src={logo} alt="logo" id="login-logo" />
          <Navbar.Brand className="login-title">Desk Booking Tool</Navbar.Brand>
        </Navbar>
        <div className="login-login-card">
          <Card className="login-card">
            <Card.Body>
              <Card.Title className="login-card-title">
                Login with Azure Active Directory
              </Card.Title>
              <hr />
              <Button
                variant="primary"
                className="login-btn"
                onClick={this.loginAdal}
              >
                Azure Login
              </Button>
            </Card.Body>
          </Card>
        </div>
      </div>
    );
  }
}

export default Login;
