import React, { Component } from "react";
import { Link } from "@reach/router";

// Components
import Logo from "./Logo";

class Header extends Component {
  render() {
    return (
      <header className="shadow bg-black">
        <nav className="flex items-center justify-between p-2">
          <div className="flex mr-6 items-center">
            <Logo />
            <Link to="schools" className="text-white no-underline pl-6">
              Find Your School
            </Link>
          </div>
          <div className="flex-grow flex items-center w-auto">
            <div className="ml-auto">
              <Link
                to="/login"
                className="no-underline inline-block mr-2 text-sm px-4 py-2 leading-none border rounded text-grey-light border-grey-light hover:border-grey-light hover:text-white"
              >
                Log In
              </Link>
            </div>
          </div>
        </nav>
      </header>
    );
  }
}

export default Header;
