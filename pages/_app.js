// Libraries
import "src/styles/globals.css";
import { SkipNavLink } from "@reach/skip-nav";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import "@reach/skip-nav/styles.css";
import "@reach/combobox/styles.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { config as fontawesomeConfig } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";

// Providers
import { AuthProvider } from "src/providers/auth";

// Constants
import { CUSTOM_CHAKRA_THEME } from "src/constants/styles";

const CUSTOM_THEME = extendTheme(CUSTOM_CHAKRA_THEME);

fontawesomeConfig.autoAddCss = false;

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
