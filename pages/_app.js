// Libraries
import "src/styles/globals.css";
import { SkipNavLink } from "@reach/skip-nav";
import * as Sentry from "@sentry/react";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import "@reach/skip-nav/styles.css";
import "@reach/combobox/styles.css";
import { config as fontawesomeConfig } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";

// Providers
import { AuthProvider } from "src/providers/auth";

// Constants
import { CUSTOM_CHAKRA_THEME } from "src/constants/styles";
// import { SENTRY_CONFIG } from "src/constants/sentry";

const CUSTOM_THEME = extendTheme(CUSTOM_CHAKRA_THEME);

fontawesomeConfig.autoAddCss = false;

// if (SENTRY_CONFIG.dsn) {
//   Sentry.init(SENTRY_CONFIG);
// }

const App = ({ Component, pageProps }) => {
  return (
    <AuthProvider>
      <ChakraProvider theme={CUSTOM_THEME}>
        <SkipNavLink />
        <Component {...pageProps} />
      </ChakraProvider>
    </AuthProvider>
  );
};

export default App;
