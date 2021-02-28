// Libraries
import "src/styles/globals.css";
import { SkipNavLink } from "@reach/skip-nav";
import { AppProvider } from "src/store";
import * as Sentry from "@sentry/react";
import { ChakraProvider, extendTheme, Box } from "@chakra-ui/react";
import "@reach/skip-nav/styles.css";
import "@reach/combobox/styles.css";
import { AuthProvider } from "src/providers/auth";

// Constants
import { CUSTOM_CHAKRA_THEME } from "src/constants/styles";
import { SENTRY_CONFIG } from "src/constants/sentry";
import { AUTH_STATUS } from "src/constants/auth";

// Components
import AuthenticatedNav from "src/components/AuthenticatedNav";
import UnauthenticatedNav from "src/components/UnauthenticatedNav";
import Footer from "src/components/Footer";

// Utilities
import { getAuthStatus } from "src/utilities/auth";

const CUSTOM_THEME = extendTheme(CUSTOM_CHAKRA_THEME);

Sentry.init(SENTRY_CONFIG);

const App = ({ Component, pageProps }) => {
  const authStatus = getAuthStatus(pageProps);
  const authUser = {
    uid: pageProps.uid,
    email: pageProps.email
  };

  return (
    <AuthProvider>
      <AppProvider>
        <ChakraProvider theme={CUSTOM_THEME}>
          <SkipNavLink />
          {authStatus === AUTH_STATUS.AUTHENTICATED ? (
            <AuthenticatedNav authUser={authUser} />
          ) : (
            <UnauthenticatedNav authUser={authUser} />
          )}
          <Box as="main" pb={12} bg="#fdfdfd" minH="100vh" h="100%">
            <Component {...pageProps} />
          </Box>
          <Footer />
        </ChakraProvider>
      </AppProvider>
    </AuthProvider>
  );
};

export default App;
