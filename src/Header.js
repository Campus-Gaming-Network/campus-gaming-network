import React, { Component } from "react";
import Logo from "./Logo";
import "./Header.css";
import { Link } from "@reach/router";

class Header extends Component {
  render() {
    return (
      <header className="App-header">
        <Link to="/" className="App-logo-link">
          <Logo />
        </Link>
        <nav className="App-header-nav">
          <ul>
            <li>
              <Link to="/schools">Find Your School</Link>
            </li>
          </ul>
        </nav>
      </header>
    );
  }
}

export default Header;
