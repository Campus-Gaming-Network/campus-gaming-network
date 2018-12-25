import React, { Component } from "react";

class EditAccount extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      name: ""
    };
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  };

  handleSubmit = async event => {
    event.preventDefault();

    this.setState({ isLoading: true });
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <h1 className="text-center pb-2 pt-2">Welcome to your account page</h1>
        <p className="text-grey-dark text-center pb-8">
          Your personal information
        </p>
        <div className="mb-4">
          <label
            className="block text-grey-dark text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            autoFocus
            className="bg-grey-light cursor-not-allowed appearance-none border rounded w-full py-2 px-3 text-grey-darker leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            name="email"
            type="text"
            placeholder="Email"
            value={this.props.email}
            disabled
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-grey-dark text-sm font-bold mb-2"
            htmlFor="name"
          >
            Name
          </label>
          <input
            autoFocus
            className="bg-grey-lightest appearance-none border rounded w-full py-2 px-3 text-grey-darker leading-tight focus:outline-none focus:shadow-outline"
            id="name"
            name="name"
            type="text"
            placeholder="Name"
            value={this.props.name}
          />
        </div>
      </form>
    );
  }
}

export default EditAccount;
