import React, { Component } from "react";

class Main extends Component {
  render() {
    return (
      <main role="main" className="h-screen">
        {this.props.children}
      </main>
    );
  }
}

export default Main;
