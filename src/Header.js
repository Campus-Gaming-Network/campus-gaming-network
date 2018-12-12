import React, { Component } from "react";
import { Link } from "@reach/router";

// Components
import Logo from "./Logo";

class Header extends Component {
  renderHeaderLinks = () => {
    return !this.props.isAuthenticated ? (
      <Link
        to="/login"
        className="text-xs no-underline font-medium uppercase inline-block px-3 py-2 border rounded text-white border-grey-darker hover:border-grey-dark"
      >
        Log In
      </Link>
    ) : (
      <Link
        to="/user/jdoe"
        className="rounded flex text-grey-light items-center no-underline group px-2 py-1 hover:bg-grey-darkest"
      >
        <span className="text-xs pr-2 group-hover:text-orange">Jane Doe</span>
        <img
          src="https://picsum.photos/30/30/?image=1027"
          alt="Profile"
          className="shadow rounded-full"
        />
      </Link>
    );
  };

  render() {
    return (
      <header>
        <nav className="flex items-center justify-between p-2 max-w-3xl mx-auto">
          <div className="flex mr-6 items-center">
            <Logo />
          </div>
          <div className="flex-grow flex items-center w-auto">
            <div className="ml-auto">{this.renderHeaderLinks()}</div>
          </div>
        </nav>
      </header>
    );
  }
}

export default Header;
