import React, { Component } from "react";

class EditAccount extends Component {
  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <h1 className="text-center pb-2 pt-2">Welcome to your account page</h1>
        <p className="text-grey-dark text-center pb-8">
          Your private information.
        </p>
        <div className="mb-4">
          <span className="block text-grey-dark text-sm font-bold mb-2">
            Email
          </span>
          <p className="text-grey-lightest">{this.props.email}</p>
        </div>
      </form>
    );
  }
}

export default EditAccount;
