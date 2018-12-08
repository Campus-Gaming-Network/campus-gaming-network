import React, { Component } from "react";

// Components
import Main from "./Main";
import Home from "./Home";
import Login from "./Login";
import Signup from "./Signup";
import ForgotPassword from "./ForgotPassword";
import Profile from "./Profile";
import EditProfile from "./EditProfile";

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
      </Main>
    );
  }
}

export default App;
