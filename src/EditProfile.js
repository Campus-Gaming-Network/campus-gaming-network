import React, { Component } from "react";
import { FaDiscord, FaSteam, FaXbox, FaPlaystation } from "react-icons/fa";

// Components
import Button from "./Button";

class EditProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      school: "",
      major: "",
      bio: "",
      discord: "",
      steam: "",
      xbox: "",
      playstation: ""
    };
  }

  validateForm() {
    // will figure out later
    return true;
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
        <h1 className="text-center pb-2 pt-2">Edit Your Profile</h1>
        <p className="text-grey-dark text-center pb-8">
          The information entered here will be displayed to other users.
        </p>
        <div className="mb-4">
          <label className="block text-grey-dark text-sm font-bold mb-2">
            School
          </label>
          <div className="relative">
            <select className="bg-grey-lightest appearance-none border rounded w-full py-2 px-3 text-grey-darker leading-tight focus:outline-none focus:shadow-outline">
              <option>Illinois Institute of Technology</option>
              <option>Harvard</option>
              <option>Florida State University</option>
            </select>
            <div className="pointer-events-none absolute pin-y pin-r flex items-center px-2 text-grey-darker">
              <svg
                className="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="mb-4">
          <label
            className="block text-grey-dark text-sm font-bold mb-2"
            htmlFor="major"
          >
            Major
          </label>
          <input
            className="bg-grey-lightest appearance-none border rounded w-full py-2 px-3 text-grey-darker mb-2 leading-tight focus:outline-none focus:shadow-outline"
            id="major"
            type="text"
            name="major"
            placeholder="Major"
            value={this.state.major}
            onChange={this.handleChange}
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-grey-dark text-sm font-bold mb-2"
            htmlFor="bio"
          >
            Bio
          </label>
          <textarea
            className="bg-grey-lightest appearance-none border rounded w-full py-2 px-3 text-grey-darker mb-2 leading-tight focus:outline-none focus:shadow-outline"
            id="bio"
            type="text"
            name="bio"
            placeholder="Write something about yourself"
            value={this.state.bio}
            onChange={this.handleChange}
            rows={5}
            maxLength={300}
          />
        </div>
        <div className="md:flex md:items-center mb-6">
          <div className="md:w-1/3">
            <label
              className="flex text-sm items-center text-grey-dark font-bold mb-2 md:mb-0 pr-4"
              htmlFor="discord"
            >
              <FaDiscord className="text-grey mr-2" />
              Discord
            </label>
          </div>
          <div className="w-full">
            <input
              className="bg-grey-lightest appearance-none rounded w-full py-2 px-4 text-grey-darkest leading-tight focus:outline-none focus:bg-white focus:border-purple"
              id="discord"
              type="text"
              name="discord"
              placeholder="Enter DiscordTag#0000"
              value={this.state.discord}
              onChange={this.handleChange}
            />
          </div>
        </div>
        <div className="md:flex md:items-center mb-6">
          <div className="md:w-1/3">
            <label
              className="flex text-sm items-center text-grey-dark font-bold mb-2 md:mb-0 pr-4"
              htmlFor="steam"
            >
              <FaSteam className="text-grey mr-2" />
              Steam
            </label>
          </div>
          <div className="w-full">
            <input
              className="bg-grey-lightest appearance-none rounded w-full py-2 px-4 text-grey-darkest leading-tight focus:outline-none focus:bg-white focus:border-purple"
              id="steam"
              type="text"
              name="steam"
              placeholder="Enter Steam ID"
              value={this.state.steam}
              onChange={this.handleChange}
            />
          </div>
        </div>
        <div className="md:flex md:items-center mb-6">
          <div className="md:w-1/3">
            <label
              className="flex text-sm items-center text-grey-dark font-bold mb-2 md:mb-0 pr-4"
              htmlFor="xbox"
            >
              <FaXbox className="text-grey mr-2" />
              Xbox
            </label>
          </div>
          <div className="w-full">
            <input
              className="bg-grey-lightest appearance-none rounded w-full py-2 px-4 text-grey-darkest leading-tight focus:outline-none focus:bg-white focus:border-purple"
              id="xbox"
              type="text"
              name="xbox"
              placeholder="Enter Gamertag"
              value={this.state.xbox}
              onChange={this.handleChange}
            />
          </div>
        </div>
        <div className="md:flex md:items-center mb-6">
          <div className="md:w-1/3">
            <label
              className="flex text-sm items-center text-grey-dark font-bold mb-2 md:mb-0 pr-4"
              htmlFor="playstation"
            >
              <FaPlaystation className="text-grey mr-2" />
              PSN
            </label>
          </div>
          <div className="w-full">
            <input
              className="bg-grey-lightest appearance-none rounded w-full py-2 px-4 text-grey-darkest leading-tight focus:outline-none focus:bg-white focus:border-purple"
              id="playstation"
              type="text"
              name="playstation"
              placeholder="Enter a PSN ID"
              value={this.state.playstation}
              onChange={this.handleChange}
            />
          </div>
        </div>
        <Button
          className="mt-6"
          disabled={!this.validateForm()}
          type="submit"
          isLoading={this.state.isLoading}
          loadingText="Updating..."
        >
          Update
        </Button>
      </form>
    );
  }
}

export default EditProfile;
