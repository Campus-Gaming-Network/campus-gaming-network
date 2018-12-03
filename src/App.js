import React, { Component } from "react";
import "./App.css";
import Header from "./Header";
import Main from "./Main";
import { Router } from "@reach/router";
import Home from "./Home";
import Schools from "./Schools";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <Main>
          <Router>
            <Home path="/" />
            <Schools path="schools/*" />
          </Router>
        </Main>
      </div>
    );
  }
}

export default App;
