import React, { Component } from "react";
import { Link } from "@reach/router";

// Utils
import { getFormData } from "./utils";

class LoginForm extends Component {
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
          <h1 className="text-center pb-2 pt-2">Welcome back</h1>
          <p className="text-grey-dark text-center pb-8">
            Log in to your account.
          </p>
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
          <div>
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
          </div>
          <Link
            to="/forgot-password"
            className="inline-block no-underline align-baseline text-xs text-orange hover:text-orange-dark"
          >
            Forgot Password?
          </Link>
          <button
            className="mt-6 w-full bg-orange hover:bg-orange-dark text-white font-medium py-4 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Log In
          </button>
        </form>
        <span className="text-sm text-grey-dark pr-1">
          Don't have an account?
        </span>
        <Link
          to="/sign-up"
          className="text-sm no-underline text-orange hover:text-orange-dark"
        >
          Sign up
        </Link>
      </>
    );
  }
}

export default LoginForm;
