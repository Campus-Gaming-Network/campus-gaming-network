import React, { Component } from "react";
import { Link } from "@reach/router";

class Home extends Component {
  render() {
    return (
      <article>
        <section className="p-8 w-full">
          <Link to="/" className="block text-white p-2">
            Home
          </Link>
          <Link to="user/jdoe" className="block text-white p-2">
            Profile
          </Link>
          <Link to="login" className="block text-white p-2">
            Log in
          </Link>
          <Link to="sign-up" className="block text-white p-2">
            Sign up
          </Link>
          <Link to="forgot-password" className="block text-white p-2">
            Forgot Password
          </Link>
          <Link to="schools" className="block text-white p-2">
            Find Your School
          </Link>
        </section>
      </article>
    );
  }
}

export default Home;
