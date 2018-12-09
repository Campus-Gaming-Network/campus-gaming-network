import React, { Component } from "react";
import { Link } from "@reach/router";

// Utils
import { getFormData } from "./utils";

class SignupForm extends Component {
  // The third party component we use will replace this, but for now lets
  // pretend it does something useful
  validate = form => {
    return true;
  };

  handleKeyUp = event => {
    if (event.keyCode === 13) {
      this.handleSubmit(event);
    }
  };

  // This will be replaced by a third party component like aws amplify or
  // something similar
  handleSubmit = event => {
    event.preventDefault();
    const form = event.target;
    if (this.validate(form)) {
      const user = getFormData(form);
      console.log("user : ", user);
    }
  };

  render() {
    return (
      <>
        <form
          onKeyUp={this.handleKeyUp}
          onSubmit={this.handleSubmit}
          className="bg-grey-darkest shadow-lg rounded px-8 pt-6 pb-8 mb-4 text-white"
        >
          <h1 className="text-center font-normal pb-6 pt-2">
            Create an Account
          </h1>
          <div className="mb-4">
            <label
              className="block text-grey-darker text-sm font-bold mb-2"
              htmlFor="username"
            >
              Username
            </label>
            <input
              className="bg-grey-lightest appearance-none border rounded w-full py-2 px-3 text-grey-darker leading-tight focus:outline-none focus:shadow-outline"
              id="username"
              name="username"
              type="text"
              placeholder="Username"
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-grey-darker text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="bg-grey-lightest appearance-none border rounded w-full py-2 px-3 text-grey-darker leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              required
            />
          </div>
          <label
            className="block text-grey-darker text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            className="bg-grey-lightest appearance-none border rounded w-full py-2 px-3 text-grey-darker mb-2 leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            type="password"
            name="password"
            placeholder="******************"
            required
          />
          <button
            className="mt-6 w-full bg-orange hover:bg-orange-dark text-white font-medium py-4 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Sign up
          </button>
        </form>
        <span className="text-sm text-grey-dark pr-1">
          Already have an account?
        </span>
        <Link
          to="/login"
          className="text-sm no-underline text-orange hover:text-orange-dark"
        >
          Log In
        </Link>
      </>
    );
  }
}

export default SignupForm;
