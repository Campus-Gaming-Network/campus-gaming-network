import React, { Component } from "react";
import { Link, navigate } from "@reach/router";
import { Auth } from "aws-amplify";

// Components
import Button from "Button";
import Alert from "Alert";

class Signup extends Component {
  state = {
    isLoading: false,
    email: "",
    password: "",
    confirmPassword: "",
    confirmationCode: "",
    newUser: null
  };

  validateForm() {
    return (
      this.state.email.length > 0 &&
      this.state.password.length > 0 &&
      this.state.password === this.state.confirmPassword
    );
  }

  validateConfirmationForm() {
    return this.state.confirmationCode.length > 0;
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
      const newUser = await Auth.signUp({
        username: this.state.email,
        password: this.state.password
      });
      this.setState({
        newUser
      });
    } catch (e) {
      alert(e.message);
    }

    this.setState({ isLoading: false });
  };

  handleConfirmationSubmit = async event => {
    event.preventDefault();

    this.setState({ isLoading: true });

    try {
      await Auth.confirmSignUp(this.state.email, this.state.confirmationCode);
      await Auth.signIn(this.state.email, this.state.password);

      this.props.userHasAuthenticated(true);
      navigate("/");
    } catch (e) {
      alert(e.message);
      this.setState({ isLoading: false });
    }
  };

  renderConfirmationForm() {
    return (
      <form
        onSubmit={this.handleSubmit}
        className="bg-grey-darkest shadow-lg rounded px-8 pt-6 pb-8 mb-4 text-white"
      >
        <div className="mb-4">
          <label
            className="block text-grey-darker text-sm font-bold mb-2"
            htmlFor="confirmationCode"
          >
            Confirmation Code
          </label>
          <input
            autoFocus
            className="bg-grey-lightest appearance-none border rounded w-full py-2 px-3 text-grey-darker leading-tight focus:outline-none focus:shadow-outline"
            id="confirmationCode"
            name="confirmationCode"
            type="tel"
            placeholder="Confirmation Code"
            value={this.state.confirmationCode}
            onChange={this.handleChange}
            required
          />
        </div>
        <Alert>
          <p className="text-xs">
            Please check your email ({this.state.email}) for a confirmation
            code.
          </p>
        </Alert>
        <Button
          className="mt-6"
          disabled={!this.validateConfirmationForm()}
          isLoading={this.state.isLoading}
          type="submit"
          loadingText="Verifying..."
        >
          Verify
        </Button>
      </form>
    );
  }

  renderForm() {
    return (
      <form
        onSubmit={this.handleSubmit}
        className="bg-grey-darkest shadow-lg rounded px-8 pt-6 pb-8 mb-4 text-white"
      >
        <h1 className="text-center font-normal pb-6 pt-2">Create an Account</h1>
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
            type="email"
            placeholder="Email"
            value={this.state.email}
            onChange={this.handleChange}
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
          value={this.state.password}
          onChange={this.handleChange}
          required
        />
        <label
          className="block text-grey-darker text-sm font-bold mb-2"
          htmlFor="password"
        >
          Confirm Password
        </label>
        <input
          className="bg-grey-lightest appearance-none border rounded w-full py-2 px-3 text-grey-darker mb-2 leading-tight focus:outline-none focus:shadow-outline"
          id="confirmPassword"
          type="password"
          name="confirmPassword"
          placeholder="******************"
          value={this.state.confirmPassword}
          onChange={this.handleChange}
          required
        />
        <Button
          className="mt-6"
          disabled={!this.validateForm()}
          type="submit"
          isLoading={this.state.isLoading}
          loadingText="Signing up..."
        >
          Sign up
        </Button>
      </form>
    );
  }

  render() {
    return (
      <article className="container h-full flex justify-center p-8 max-w-3xl mx-auto">
        <section className="lg:w-1/3 md:w-3/5">
          {this.state.newUser === null
            ? this.renderForm()
            : this.renderConfirmationForm()}
          <span className="text-sm text-grey-dark pr-1">
            Already have an account?
          </span>
          <Link
            to="/login"
            className="text-sm no-underline text-orange-dark hover:text-orange-darker"
          >
            Log In
          </Link>
        </section>
      </article>
    );
  }
}

export default Signup;
