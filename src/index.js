import React from "react";
import ReactDOM from "react-dom";
import "./App.css";
import App from "./App";
import { SkipNavLink } from "@reach/skip-nav";
import * as serviceWorker from "./serviceWorker";
import { AppProvider } from "./store";
import { firebase, firebaseAuth } from "./firebase";
import { isDev } from "./utilities";
import { LocationProvider } from "@reach/router";
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";
import { theme, ThemeProvider, CSSReset } from "@chakra-ui/core";
import moment from "moment";
import momentLocalizer from "react-widgets-moment";
import "@reach/skip-nav/styles.css";
import "react-widgets/dist/css/react-widgets.css";
import "@reach/combobox/styles.css";

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  integrations: [new Integrations.BrowserTracing()],
  tracesSampleRate: 1.0,
  environment: isDev() ? "development" : "production"
});

moment.locale("en");
momentLocalizer();

firebaseAuth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);

ReactDOM.render(
  <LocationProvider>
    <AppProvider>
      <ThemeProvider theme={theme}>
        <CSSReset />
        <SkipNavLink />
        <App />
      </ThemeProvider>
    </AppProvider>
  </LocationProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
