import React, { Component } from "react";
import logo from "./logo.svg";
import "./Logo.css";
import { Link } from "@reach/router";

class Logo extends Component {
  render() {
    return (
      <Link to="/" className="App-logo-link">
        <img src={logo} className="App-logo" alt="logo" />
        {this.props.displayText && <span>Campus Gamer</span>}
      </Link>
    );
  }
}

export default Logo;
