import React, { Component } from "react";
import { Link, navigate } from "@reach/router";
import { Auth } from "aws-amplify";

// Components
import Button from "Button";

class Login extends Component {
  state = {
    isLoading: false,
    email: "",
    password: ""
  };

  validateForm() {
    return this.state.email.length > 0 && this.state.password.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
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
      <article className="container h-full flex justify-center p-8 max-w-3xl mx-auto">
        <section className="lg:w-1/3 md:w-3/5">
          <form
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
              className="inline-block no-underline align-baseline text-xs text-orange-dark hover:text-orange-darker"
            >
              Forgot Password?
            </Link>
            <Button
              className="mt-6"
              disabled={!this.validateForm()}
              type="submit"
              isLoading={this.state.isLoading}
              loadingText="Logging in..."
            >
              Log In
            </Button>
          </form>
          <span className="text-sm text-grey-dark pr-1">
            Don’t have an account?
          </span>
          <Link
            to="/sign-up"
            className="text-sm no-underline text-orange-dark hover:text-orange-darker"
          >
            Sign up
          </Link>
        </section>
      </article>
    );
  }
}

export default Login;
