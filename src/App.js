import React, { Component } from "react";
import "./App.css";
import Header from "./Header";
import Main from "./Main";
import { Router } from "@reach/router";
import Home from "./Home";
import SchoolList from "./SchoolList";
import SchoolDetail from "./SchoolDetail";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <Main>
          <Router>
            <Home path="/" />
            <SchoolList path="schools" />
            <SchoolDetail path=":school" />
          </Router>
        </Main>
      </div>
    );
  }
}

export default App;
