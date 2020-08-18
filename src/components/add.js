import React from 'react';
import { connect } from 'react-redux';
import './../styles/add.css';
import { setTab, setImage } from '../actions';
import { Button } from '@material-ui/core';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

/** Upload floorplan pdf page */
class Add extends React.Component {
  /** */
  constructor(props) {
    super(props);
    /** No image has been uploaded yes */
    this.state = { image: null };
  }
  /**  Sets the tab for the navbar */
  componentDidMount() {
    this.props.dispatch(setTab('add'));
  }

  /** Create a URL for the image to display on the next page, and write the image data to redux */
  readFile = (e) => {
    var imageURL = URL.createObjectURL(e.target.files[0]);
    this.setState({ image: imageURL });
    this.props.dispatch(
      setImage({ url: imageURL, image: Array.from(e.target.files)[0] })
    );
  };
  /** */
  render() {
    return (
      <div>
        <div className="details">Upload Your Floor Plan</div>
        <div className="choose">Choose a .jpeg or .png </div>
        <input
          type="file"
          onChange={this.readFile}
          className="inpt"
          accept=".jpg,.png,.jpeg,.JPG"
        />

        {this.state.image ? (
          <div>
            <img src={this.state.image} alt="floorplan" className="preview" />
            <Link to="/floorBuilder">
              <Button
                variant="contained"
                color="primary"
                onClick={this.makeDesk}
                className="upload-btn mui-btn"
                onClick={this.next}
              >
                Next
              </Button>
            </Link>
          </div>
        ) : (
          ''
        )}
      </div>
    );
  }
}

Add.propTypes = {
  dispatch: PropTypes.any,
};

export default connect()(Add);
