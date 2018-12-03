import React, { Component } from "react";
import Logo from "./Logo";
import "./Header.css";
import { Link } from "@reach/router";

class Header extends Component {
  render() {
    return (
      <header className="App-header">
        <Logo displayText />
        <nav className="App-header-nav">
          <ul>
            <li>
              <Link to="/schools" className="FindYourSchool-link">
                Find Your School
              </Link>
            </li>
          </ul>
        </nav>
      </header>
    );
  }
}

export default Header;
