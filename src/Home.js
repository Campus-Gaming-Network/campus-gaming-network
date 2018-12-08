import React, { Component } from "react";
import { Link } from "@reach/router";

class Home extends Component {
  render() {
    return (
      <article>
        <section className="p-8 w-full">
          <h1 className="text-white">Home</h1>
          <Link to="profile">Profile</Link>
        </section>
      </article>
    );
  }
}

export default Home;
