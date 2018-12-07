import React, { Component } from "react";
import { Link } from "@reach/router";

// Assets
import logo from "./logo.svg";

class Logo extends Component {
  render() {
    return (
      <Link to="/">
        <img src={logo} alt="logo" className="h-12" />
        {this.props.displayText && <span>Campus Gamer</span>}
      </Link>
    );
  }
}

export default Logo;
