import React from "react";
import ReactDOM from "react-dom";
import "./App.css";
import App from "./App";
import { SkipNavLink } from "@reach/skip-nav";
import * as serviceWorker from "./serviceWorker";
import { AppProvider } from "./store";
import { firebase, firebaseAuth } from "./firebase";
import { LocationProvider } from "@reach/router";
import * as Sentry from "@sentry/react";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import "@reach/skip-nav/styles.css";
import "@reach/combobox/styles.css";

import { SENTRY_CONFIG, CUSTOM_CHAKRA_THEME } from "./constants";

const CUSTOM_THEME = extendTheme(CUSTOM_CHAKRA_THEME);

Sentry.init(SENTRY_CONFIG);

firebaseAuth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);

ReactDOM.render(
  <LocationProvider>
    <AppProvider>
      <ChakraProvider theme={CUSTOM_THEME}>
        <SkipNavLink />
        <App />
      </ChakraProvider>
    </AppProvider>
  </LocationProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
