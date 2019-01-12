import React, { Component } from "react";
import { Router, navigate, Redirect } from "@reach/router";
import { Auth } from "aws-amplify";

// Components
import Main from "Main";
import Header from "Header";
import Home from "Home";
import Login from "Login";
import Signup from "Signup";
import ForgotPassword from "ForgotPassword";
import Profile from "Profile";
import NotFound from "NotFound";
import Account from "Account";
import EditAccount from "EditAccount";
import EditProfile from "EditProfile";
import Feed from "Feed";

class App extends Component {
  state = {
    isAuthenticated: false,
    isAuthenticating: true,
    email: ""
  };

  async componentDidMount() {
    try {
      await Auth.currentSession();
      const response = await Auth.currentAuthenticatedUser();
      this.setUserEmail(response.attributes.email);
      this.userHasAuthenticated(true);
    } catch (e) {
      if (e !== "No current user") {
        alert(e);
      }
    }

    this.setState({ isAuthenticating: false });
  }

  setUserEmail = email => {
    this.setState({ email });
  };

  userHasAuthenticated = authenticated => {
    this.setState({ isAuthenticated: authenticated });
  };

  handleLogout = async () => {
    await Auth.signOut();

    this.userHasAuthenticated(false);

    navigate("/login");
  };

  render() {
    const childProps = {
      isAuthenticated: this.state.isAuthenticated,
      userHasAuthenticated: this.userHasAuthenticated,
      handleLogout: this.handleLogout,
      email: this.state.email
    };

    return (
      <Main>
        <Header {...childProps} />
        {this.state.isAuthenticated ? (
          <Router>
            <Feed path="/" />
            <Profile path="user/:username" {...childProps} />
            <Account path="account" {...childProps}>
              <EditAccount path="/" {...childProps} />
              <EditProfile path="profile" {...childProps} />
            </Account>
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
