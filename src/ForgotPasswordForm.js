import React, { Component } from "react";
import { Auth } from "aws-amplify";
import { Link } from "@reach/router";

// Components
import Button from "./Button";
import Alert from "./Alert";

class ForgotPasswordForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      code: "",
      email: "",
      password: "",
      codeSent: false,
      confirmed: false,
      confirmPassword: "",
      isConfirming: false,
      isSendingCode: false
    };
  }

  validateCodeForm() {
    return this.state.email.length > 0;
  }

  validateResetForm() {
    return (
      this.state.code.length > 0 &&
      this.state.password.length > 0 &&
      this.state.password === this.state.confirmPassword
    );
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  };

  handleSendCodeClick = async event => {
    event.preventDefault();

    this.setState({ isSendingCode: true });

    try {
      await Auth.forgotPassword(this.state.email);
      this.setState({ codeSent: true });
    } catch (e) {
      alert(e.message);
      this.setState({ isSendingCode: false });
    }
  };

  handleConfirmClick = async event => {
    event.preventDefault();

    this.setState({ isConfirming: true });

    try {
      await Auth.forgotPasswordSubmit(
        this.state.email,
        this.state.code,
        this.state.password
      );
      this.setState({ confirmed: true });
    } catch (e) {
      alert(e.message);
      this.setState({ isConfirming: false });
    }
  };

  renderRequestCodeForm() {
    return (
      <form
        onSubmit={this.handleSendCodeClick}
        className="bg-grey-darkest shadow-lg rounded px-8 pt-6 pb-8 mb-4 text-white"
      >
        <h1 className="text-center pb-2 pt-2">Forgot your password?</h1>
        <p className="text-grey-dark text-center pb-8">
          Enter the email you use for Campus Gaming Network, and we'll help you
          create a new password.
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
            type="email"
            placeholder="Email"
            value={this.state.email}
            onChange={this.handleChange}
            required
          />
        </div>
        <Button
          className="mt-6"
          type="submit"
          loadingText="Sending..."
          isLoading={this.state.isSendingCode}
          disabled={!this.validateCodeForm()}
        >
          Send Confirmation
        </Button>
      </form>
    );
  }

  renderConfirmationForm() {
    return (
      <form
        onSubmit={this.handleConfirmClick}
        className="bg-grey-darkest shadow-lg rounded px-8 pt-6 pb-8 mb-4 text-white"
      >
        <Alert className="mb-2">
          <p className="text-xs">
            Please check your email ({this.state.email}) for a confirmation
            code.
          </p>
        </Alert>
        <div className="mb-4">
          <label
            className="block text-grey-darker text-sm font-bold mb-2"
            htmlFor="code"
          >
            Confirmation Code
          </label>
          <input
            autoFocus
            className="bg-grey-lightest appearance-none border rounded w-full py-2 px-3 text-grey-darker leading-tight focus:outline-none focus:shadow-outline"
            id="code"
            name="code"
            type="tel"
            placeholder="Confirmation Code"
            value={this.state.code}
            onChange={this.handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-grey-darker text-sm font-bold mb-2"
            htmlFor="code"
          >
            New Password
          </label>
          <input
            className="bg-grey-lightest appearance-none border rounded w-full py-2 px-3 text-grey-darker leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            name="password"
            type="password"
            placeholder="******************"
            value={this.state.password}
            onChange={this.handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-grey-darker text-sm font-bold mb-2"
            htmlFor="code"
          >
            Confirm Password
          </label>
          <input
            className="bg-grey-lightest appearance-none border rounded w-full py-2 px-3 text-grey-darker leading-tight focus:outline-none focus:shadow-outline"
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="******************"
            value={this.state.confirmPassword}
            onChange={this.handleChange}
            required
          />
        </div>
        <Button
          className="mt-6"
          disabled={!this.validateResetForm()}
          isLoading={this.state.isConfirming}
          type="submit"
          loadingText="Confirming..."
        >
          Confirm
        </Button>
      </form>
    );
  }

  renderSuccessMessage() {
    return (
      <div className="text-center">
        <p className="text-white pb-2">Your password has been reset.</p>
        <p>
          <Link
            to="/login"
            className="text-xs no-underline text-orange hover:text-orange-dark"
          >
            Click here to login with your new credentials.
          </Link>
        </p>
      </div>
    );
  }

  render() {
    return !this.state.codeSent
      ? this.renderRequestCodeForm()
      : !this.state.confirmed
      ? this.renderConfirmationForm()
      : this.renderSuccessMessage();
  }
}

export default ForgotPasswordForm;
