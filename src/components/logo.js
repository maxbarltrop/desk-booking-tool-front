import React from 'react';
import '../styles/logo.css';
import logo from '../assets/LogoNoSquares.png';

export default function AnimatedLogo() {
  return (
    <div className="my-logo-div">
      <img src={logo} alt="my-logo" className="my-logo-text" />
      <div className="my-text">LOGO PLACEHOLDER</div>
      <div className="my-logo sq1" />
      <div className="my-logo sq2" />
      <div className="my-logo sq3" />
    </div>
  );
}
