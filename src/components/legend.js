import React from 'react';
import '../styles/legend.css';

export default class Legend extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="legend">
        <div className="legend-p">
          <div className="legend-icon green" />
          <div className="legend-text"> Selected </div>
          <div className="legend-icon yellow" />
          <div className="legend-text"> Available </div>
          <div className="legend-icon red" />
          <div className="legend-text"> Unbookable </div>
          <div className="legend-icon grey" />
          <div className="legend-text"> Booked </div>
        </div>
      </div>
    );
  }
}
