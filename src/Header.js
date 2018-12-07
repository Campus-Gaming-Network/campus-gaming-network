import React, { Component } from "react";
import { Link } from "@reach/router";

// Components
import Logo from "./Logo";

class Header extends Component {
  render() {
    return (
      <header className="shadow bg-white">
        <nav className="flex items-center justify-between p-2">
          <div className="flex mr-6">
            <Logo />
          </div>
          <div className="flex-grow flex items-center w-auto">
            <div className="ml-auto">
              <Link
                to="/login"
                className="no-underline inline-block mr-2 text-sm px-4 py-2 leading-none border rounded text-orange border-orange hover:border-transparent hover:text-white hover:bg-orange"
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
