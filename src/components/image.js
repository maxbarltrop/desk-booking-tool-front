import React, { Component } from 'react';
import '../styles/base.css';

class Image extends Component {
  constructor(props) {
    super(props);
    this.state = {
      img: '',
    };
  }

  arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = [].slice.call(new Uint8Array(buffer));
    bytes.forEach((b) => (binary += String.fromCharCode(b)));
    return window.btoa(binary);
  }

  componentDidMount() {
    const base64Flag = 'data:image/jpeg;base64,';
    const imageStr = this.arrayBufferToBase64(this.props.data); // data.img.data.data);
    this.setState({
      img: base64Flag + imageStr,
    });
  }

  render() {
    const { img } = this.state;
    return <img className="floor-pic" src={img} alt="Loading" />;
  }
}
export default Image;
