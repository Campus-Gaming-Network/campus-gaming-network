// Libraries
import React from "react";
import { Box } from "@chakra-ui/react";
import Head from "next/head";

// Components
import Nav from "src/components/Nav";
import Footer from "src/components/Footer";
import VerifyEmailReminderBanner from "src/components/banners/VerifyEmailReminderBanner";
import BetaWarningBanner from "./banners/BetaWarningBanner";

const SiteLayout = ({
  children,
  title = "Campus Gaming Network",
  description = "Campus Gaming Network - Connect with other collegiate gamers for casual or competitive gaming at your school or nearby.",
  hideNav = false,
  hideFooter = false,
  ...rest
}) => {
  const pageTitle = React.useMemo(() => {
    if (process.env.NODE_ENV !== "production") {
      return `DEV | ${title} | CGN`;
    }

    return `${title} | CGN`;
  }, [title]);

  return (
    <React.Fragment>
      <Head>
        <title>{pageTitle}</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, user-scalable=yes"
        />
        <meta name="description" content={description} />
      </Head>
      <BetaWarningBanner />
      <VerifyEmailReminderBanner />
      {!hideNav ? <Nav /> : null}
      <Box as="main" pb={12} bg="#fdfdfd" minH="100vh" h="100%" {...rest}>
        {children}
      </Box>
      {!hideFooter ? <Footer /> : null}
    </React.Fragment>
  );
};

export default SiteLayout;
