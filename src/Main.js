import React, { Component } from "react";
import { Router } from "@reach/router";

// Components
import Header from "./Header";

class Main extends Component {
  render() {
    return (
      <main role="main" className="h-screen">
        <Header />
        <Router>{this.props.children}</Router>
      </main>
    );
  }
}

export default Main;
