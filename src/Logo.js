import React, { Component } from 'react';
import logo from './logo.svg';
import './Logo.css';

class Logo extends Component {
  render() {
    return (
      <img src={logo} className="App-logo" alt="logo" />
    );
  }
}

export default Logo;
