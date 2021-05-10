// Libraries
import React from "react";
import { Alert, AlertIcon, AlertDescription, Text } from "@chakra-ui/react";

// Components
import OutsideLink from "src/components/OutsideLink";

// Constants
import { DISCORD_LINK } from "src/constants/other";

////////////////////////////////////////////////////////////////////////////////
// BetaWarningBanner

const BetaWarningBanner = () => {
  return (
    <Alert status="warning" justifyContent="center">
      <AlertIcon />
      <AlertDescription>
        <Text>
          Site is currently in{" "}
          <Text as="span" fontWeight="bold">
            beta
          </Text>
          , there will be bugs. Please report any in our{" "}
          <OutsideLink href={DISCORD_LINK}>Discord</OutsideLink>.
        </Text>
      </AlertDescription>
    </Alert>
  );
};

export default BetaWarningBanner;
