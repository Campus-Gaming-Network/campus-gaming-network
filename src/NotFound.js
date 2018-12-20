import React, { Component } from "react";

class NotFound extends Component {
  render() {
    return (
      <article>
        <section className="p-8 max-w-3xl mx-auto text-center">
          <h1 className="text-white">Oops!</h1>
          <p className="text-white font-hairline">
            We can’t seem to find the page you're looking for.
          </p>
        </section>
      </article>
    );
  }
}

export default NotFound;
