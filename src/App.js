import React, { Component } from "react";
import { Router } from "@reach/router";

// Components
import Header from "./Header";
import Main from "./Main";
import Home from "./Home";
import Schools from "./Schools";
import Login from "./Login";

class App extends Component {
  render() {
    return (
      <>
        <Header />
        <Main>
          <Router>
            <Home path="/" />
            <Schools path="schools/*" />
            <Login path="login" />
          </Router>
        </Main>
      </>
    );
  }
}

export default App;
