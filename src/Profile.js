import React, { Component } from "react";
import { Link } from "@reach/router";

class Profile extends Component {
  render() {
    return (
      <article>
        <section>
          <h1>Profile</h1>
          <Link to="edit">Edit</Link>
          {this.props.children}
        </section>
      </article>
    );
  }
}

export default Profile;
