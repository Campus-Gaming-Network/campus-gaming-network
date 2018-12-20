import React, { Component } from "react";
import { Link } from "@reach/router";
import { FaUser } from "react-icons/fa";

// Components
import Logo from "./Logo";
import Button from "./Button";

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userDropdownOpen: false
    };
  }

  openUserDropdown = event => {
    event.preventDefault();

    this.setState({ userDropdownOpen: true }, () => {
      document.addEventListener("click", this.closeUserDropdown);
    });
  };

  closeUserDropdown = event => {
    this.setState({ userDropdownOpen: false }, () => {
      document.removeEventListener("click", this.closeUserDropdown);
    });
  };

  renderHeaderLinks = () => {
    return !this.props.isAuthenticated ? (
      <Link
        to="/login"
        className="text-xs no-underline font-medium uppercase inline-block px-3 py-2 border rounded text-white border-grey-darker hover:border-grey-dark"
      >
        Log In
      </Link>
    ) : (
      <>
        <Button
          unstyled
          className="flex text-grey-light items-center"
          onClick={this.openUserDropdown}
        >
          <span className="text-xs pr-2">Jane</span>
          <img
            src="https://picsum.photos/30/30/?image=1027"
            alt="Profile"
            className="shadow rounded-full"
          />
        </Button>
        {this.state.userDropdownOpen && (
          <nav className="rounded w-32 bg-grey-darkest shadow-lg absolute pin-r mt-3">
            <ul className="list-reset">
              <li>
                <Link
                  to="/user/jdoe"
                  className="flex items-center w-full text-white py-3 px-4 rounded-t text-xs no-underline hover:bg-grey-darker"
                >
                  <FaUser className="mr-2 text-grey" />
                  Profile
                </Link>
              </li>
              <li className="border-grey-darker border-t">
                <Button
                  unstyled
                  className="flex text-left w-full text-xs py-3 px-4 rounded-b hover:bg-grey-darker"
                  onClick={this.props.handleLogout}
                >
                  Log out
                </Button>
              </li>
            </ul>
          </nav>
        )}
      </>
    );
  };

  render() {
    return (
      <header>
        <nav className="flex container py-2 px-4 max-w-3xl mx-auto">
          <div className="flex mr-6 items-center">
            <Logo />
          </div>
          <div className="flex-grow flex items-center w-auto">
            <div className="ml-auto relative">{this.renderHeaderLinks()}</div>
          </div>
        </nav>
      </header>
    );
  }
}

export default Header;
