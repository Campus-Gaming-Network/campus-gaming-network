import React, { Component } from "react";

// Components
import LoginForm from "./LoginForm";

class Login extends Component {
  render() {
    return (
      <article className="container max-w-sm flex mx-auto">
        <section className="py-8 w-full">
          <h1 className="text-center">Welcome back</h1>
          <p className="text-grey-dark text-center pb-4">
            Log in to your account.
          </p>
          <LoginForm />
        </section>
      </article>
    );
  }
}

export default Login;
