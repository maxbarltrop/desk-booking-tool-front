import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Card, TextArea } from 'semantic-ui-react';
import { setTab } from '../actions';
import '../styles/feedback.css';
import icon from '../assets/icon/comments-solid.svg';
import HttpService from './../services/HttpService';
import { Redirect } from 'react-router-dom';
import { Dialog } from '@material-ui/core';
/** URL for API */
const URL = process.env.REACT_APP_API;

/**
 * feedback page
 */
class Feedback extends PureComponent {
  /**
   *
   * @param {*} props
   */
  constructor(props) {
    super(props);
    /**
     * feed back service
     */
    this.service = new HttpService();
    /**
     * state
     * show: boolean to show pop up or not
     * feedback: user feedback
     */
    this.state = {
      show: false,
      feedback: '',
      err: false,
      goHome: false,
    };
  }

  componentDidMount() {
    this.props.dispatch(setTab({ tab: 'null' }));
  }
  /**
   * send the feedback to feedback service
   */
  sendFeedback = async () => {
    const { feedback } = this.state;
    if (feedback.trim() === '') {
      this.setState({ err: true });
      return null;
    }
    const url = `http://${URL}/feedback`;
    const body = { feedback: feedback };
    const result = await this.service.postRequest(url, {}, {}, body);
    if (result && result.key) {
      this.setState({ show: true });
    } else {
      this.setState({ sendErr: true });
    }
  };

  /**
   * handle feedback content changes
   */
  handleFeedbackChange = (event) => {
    this.setState({ feedback: event.target.value });
  };

  home = () => {
    this.setState({ goHome: true });
  };

  /**
   * renders everything for feedback page
   */
  render() {
    const { show, err, goHome, sendErr } = this.state;
    if (goHome) {
      return <Redirect to="/"></Redirect>;
    }

    return (
      <div>
        <Card className="feedback-card">
          <div className="feed-header">
            <img src={icon} alt="comments" id="feedback-img" />
            <div className="feedback-title">Website Feedback</div>
            <div className="sub-text">
              Please give any relevant feedback about the website and user
              experience, or provide a suggestion on what could be better. This
              feedback will be forwarded to our development team directly.
            </div>
          </div>

          <TextArea
            placeholder="Help us improve!"
            className="feedback-text"
            style={{ minHeight: 100, maxWidth: '100%', minWidth: '100%' }}
            onChange={this.handleFeedbackChange}
          />
          <div>
            {err ? (
              <div className="ui negative message feed-err">
                Please fill out the comment box.
              </div>
            ) : (
              ''
            )}
            <div className="ui button feedback-btn" onClick={this.home}>
              Home
            </div>

            <div
              className="ui blue button feedback-btn"
              onClick={this.sendFeedback}
            >
              Submit
            </div>
          </div>
        </Card>
        <Dialog className="feed-dialog" open={show}>
          <div className="dialog-header">Thanks for your feedback!</div>
          <div className="ui blue button" id="home" onClick={this.home}>
            Home
          </div>
        </Dialog>
        <Dialog className="feed-dialog" open={sendErr}>
          <div className="dialog-header">
            Oops! Something went wrong sending your feedback. Comeback later and
            try again.
          </div>
          <div className="ui blue button" id="home" onClick={this.home}>
            Home
          </div>
        </Dialog>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  // view: state.view,
});

export default connect(mapStateToProps)(Feedback);
