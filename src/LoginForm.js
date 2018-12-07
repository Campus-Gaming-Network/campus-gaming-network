import React, { Component } from "react";
import { Link } from "@reach/router";

class LoginForm extends Component {
  getFormData = form => {
    const formData = new FormData(form);
    const data = {};

    for (const entry of formData.entries()) {
      data[entry[0]] = entry[1];
    }

    return data;
  };

  // The third party component we use will replace this, but for now lets
  // pretend it does something useful
  validate = () => {
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
    if (this.validate()) {
      const form = event.target;
      const user = this.getFormData(form);
      console.log("user : ", user);
    }
  };

  render() {
    return (
      <article className="w-full">
        <form
          onKeyUp={this.handleKeyUp}
          onSubmit={this.handleSubmit}
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        >
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
          <div className="mb-6">
            <label
              className="block text-grey-darker text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="bg-grey-lightest appearance-none border rounded w-full py-2 px-3 text-grey-darker mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              name="password"
              placeholder="******************"
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-orange hover:bg-orange-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Log In
            </button>
            <Link
              to="/forgot-password"
              className="inline-block align-baseline font-bold text-sm text-orange hover:text-orange-darker"
            >
              Forgot Password?
            </Link>
          </div>
        </form>
      </article>
    );
  }
}

export default LoginForm;
