import React, { Component } from "react";
import { Link } from "@reach/router";

class Account extends Component {
  render() {
    const isActive = ({ isCurrent }) => {
      let className =
        "no-underline text-xs text-center block rounded-t border-t-4 p-3 text-grey hover:font-medium hover:text-grey-lightest";
      if (isCurrent) {
        className +=
          " font-medium border-orange-dark text-grey-lightest bg-grey-darkest";
      } else {
        className += " border-grey-darker bg-grey-darker";
      }
      return { className };
    };

    return (
      <article className="p-8 max-w-md mx-auto">
        <nav>
          <ul className="list-reset flex">
            <li className="flex-1">
              <Link to="/account" getProps={isActive}>
                Account
              </Link>
            </li>
            <li className="flex-1">
              <Link to="profile" getProps={isActive}>
                Profile
              </Link>
            </li>
          </ul>
        </nav>
        <article className="container">
          <section className="bg-grey-darkest rounded-b px-12 pt-10 pb-12 mb-4 text-white">
            {this.props.children}
          </section>
        </article>
      </article>
    );
  }
}

export default Account;
