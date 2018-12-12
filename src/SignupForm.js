import React, { Component } from "react";
import { Link, navigate } from "@reach/router";
import { Auth } from "aws-amplify";

class SignupForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      email: "",
      password: "",
      confirmPassword: "",
      confirmationCode: "",
      newUser: null
    };
  }

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

  handleKeyUp = event => {
    if (event.keyCode === 13) {
      if (event.target.id === "form") {
        this.handleSubmit(event);
      } else if (event.target.id === "confirmationForm") {
        this.handleConfirmationSubmit(event);
      }
    }
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
        id="confirmationForm"
        onKeyUp={this.handleKeyUp}
        onSubmit={this.handleSubmit}
        className="bg-grey-darkest shadow-lg rounded px-8 pt-6 pb-8 mb-4 text-white"
      >
        <div className="mb-4">
          <label
            className="block text-grey-darker text-sm font-bold mb-2"
            htmlFor="email"
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
        <div
          class="bg-teal-lightest border-l-4 border-teal text-teal-dark p-4"
          role="alert"
        >
          <p className="text-xs">
            Please check your email for the confirmation code.
          </p>
        </div>
        <button
          className={`${
            !this.validateConfirmationForm()
              ? "opacity-75 cursor-not-allowed"
              : ""
          } mt-6 w-full bg-orange hover:bg-orange-light hover:border-orange border-b-4 border-orange-dark text-white font-medium py-4 px-4 rounded`}
          disabled={!this.validateConfirmationForm()}
          type="submit"
        >
          {this.state.isLoading ? "Verifying..." : "Verify"}
        </button>
      </form>
    );
  }

  renderForm() {
    return (
      <form
        id="form"
        onKeyUp={this.handleKeyUp}
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
        <button
          className={`${
            !this.validateForm() ? "opacity-75 cursor-not-allowed" : ""
          } mt-6 w-full bg-orange hover:bg-orange-light hover:border-orange border-b-4 border-orange-dark text-white font-medium py-4 px-4 rounded`}
          disabled={!this.validateForm()}
          type="submit"
        >
          {this.state.isLoading ? "Signing up..." : "Sign up"}
        </button>
      </form>
    );
  }

  render() {
    return (
      <>
        {this.state.newUser === null
          ? this.renderForm()
          : this.renderConfirmationForm()}
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
