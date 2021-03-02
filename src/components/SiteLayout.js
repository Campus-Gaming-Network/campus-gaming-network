// Libraries
import React from "react";
import { Box } from "@chakra-ui/react";

// Components
import Nav from "src/components/Nav";
import Footer from "src/components/Footer";
import VerifyEmailReminderBanner from "src/components/banners/VerifyEmailReminderBanner";

const SiteLayout = ({ children, ...rest }) => {
  return (
    <React.Fragment>
      <VerifyEmailReminderBanner />
      <Nav />
      <Box as="main" pb={12} bg="#fdfdfd" minH="100vh" h="100%" {...rest}>
        {children}
      </Box>
      <Footer />
    </React.Fragment>
  );
};

export default SiteLayout;
