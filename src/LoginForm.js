import React, { Component } from "react";
import { Link, navigate } from "@reach/router";
import { Auth } from "aws-amplify";

class LoginForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      email: "",
      password: ""
    };
  }

  validateForm() {
    return this.state.email.length > 0 && this.state.password.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  };

  handleKeyUp = event => {
    if (event.keyCode === 13) {
      this.handleSubmit(event);
    }
  };

  handleSubmit = async event => {
    event.preventDefault();

    this.setState({ isLoading: true });

    try {
      await Auth.signIn(this.state.email, this.state.password);
      this.props.userHasAuthenticated(true);
      navigate("/");
    } catch (e) {
      alert(e.message);
      this.setState({ isLoading: false });
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
              htmlFor="email"
            >
              Email
            </label>
            <input
              autoFocus
              className="bg-grey-lightest appearance-none border rounded w-full py-2 px-3 text-grey-darker leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              name="email"
              type="text"
              placeholder="Email"
              value={this.state.email}
              onChange={this.handleChange}
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
              value={this.state.password}
              onChange={this.handleChange}
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
            className={`${
              !this.validateForm() ? "opacity-75 cursor-not-allowed" : ""
            } mt-6 w-full bg-orange hover:bg-orange-light hover:border-orange border-b-4 border-orange-dark text-white font-medium py-4 px-4 rounded`}
            disabled={!this.validateForm()}
            type="submit"
          >
            {this.state.isLoading ? "Logging in..." : "Log In"}
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
