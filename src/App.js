import React, { Component } from "react";
import { library } from '@fortawesome/fontawesome-svg-core';
import { faUser } from '@fortawesome/free-solid-svg-icons';

// Components
import Main from "./Main";
import Home from "./Home";
import Login from "./Login";
import Signup from "./Signup";
import ForgotPassword from "./ForgotPassword";
import Profile from "./Profile";
import EditProfile from "./EditProfile";
import Schools from "./Schools";

library.add(faUser);

class App extends Component {
  render() {
    return (
      <Main>
        <Home path="/" />
        <Login path="login" />
        <Signup path="sign-up" />
        <ForgotPassword path="forgot-password" />
        <Profile path="profile">
          <EditProfile path="edit" />
        </Profile>
        <Schools path="schools" />
      </Main>
    );
  }
}

export default App;
