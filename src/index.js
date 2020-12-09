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
import { ChakraProvider } from "@chakra-ui/react";
import "@reach/skip-nav/styles.css";
import "@reach/combobox/styles.css";

import { SENTRY_CONFIG } from "./constants";

// const customTheme = {
//   ...theme,
//   fonts: {
//     ...theme.fonts,
//     body:
//       "Lato, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji",
//     heading:
//       "Lato, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji"
//   }
// };

Sentry.init(SENTRY_CONFIG);

firebaseAuth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);

ReactDOM.render(
  <LocationProvider>
    <AppProvider>
      <ChakraProvider>
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
