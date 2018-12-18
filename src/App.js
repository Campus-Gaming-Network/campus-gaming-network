import React, { Component } from "react";
import { Router, navigate, Redirect } from "@reach/router";
import { Auth } from "aws-amplify";

// Components
import Main from "./Main";
import Header from "./Header";
import Home from "./Home";
import Login from "./Login";
import Signup from "./Signup";
import ForgotPassword from "./ForgotPassword";
import Profile from "./Profile";
import Schools from "./Schools";
import NotFound from "./NotFound";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isAuthenticated: false,
      isAuthenticating: true
    };
  }

  async componentDidMount() {
    try {
      await Auth.currentSession();
      this.userHasAuthenticated(true);
    } catch (e) {
      if (e !== "No current user") {
        alert(e);
      }
    }

    this.setState({ isAuthenticating: false });
  }

  userHasAuthenticated = authenticated => {
    this.setState({ isAuthenticated: authenticated });
  };

  handleLogout = async event => {
    await Auth.signOut();

    this.userHasAuthenticated(false);

    navigate("/login");
  };

  render() {
    const childProps = {
      isAuthenticated: this.state.isAuthenticated,
      userHasAuthenticated: this.userHasAuthenticated,
      handleLogout: this.handleLogout
    };

    return (
      <Main>
        <Header {...childProps} />
        {this.state.isAuthenticated ? (
          <Router>
            <Home path="/" />
            <Profile path="user/:username" {...childProps} />
            <Schools path="schools" {...childProps} />
            <Redirect from="login" to="/" noThrow />
            <Redirect from="sign-up" to="/" noThrow />
            <Redirect from="forgot-password" to="/" noThrow />
            <NotFound default />
          </Router>
        ) : (
          <Router>
            <Home path="/" />
            <Login path="login" {...childProps} />
            <Signup path="sign-up" {...childProps} />
            <ForgotPassword path="forgot-password" {...childProps} />
            <NotFound default />
          </Router>
        )}
      </Main>
    );
  }
}

export default App;
