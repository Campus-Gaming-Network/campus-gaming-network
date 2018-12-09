import React, { Component } from "react";

// Components
import ForgotPasswordForm from "./ForgotPasswordForm";

class ForgotPassword extends Component {
  render() {
    return (
      <article className="container h-full flex justify-center p-8 max-w-3xl mx-auto">
        <section className="lg:w-1/3 md:w-3/5">
          <ForgotPasswordForm />
        </section>
      </article>
    );
  }
}

export default ForgotPassword;
