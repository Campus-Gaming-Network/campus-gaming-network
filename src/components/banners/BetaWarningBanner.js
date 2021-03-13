import React from "react";
import { Alert, AlertIcon, AlertDescription, Text } from "@chakra-ui/react";

// Components
import OutsideLink from "src/components/OutsideLink";

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
          <OutsideLink href="https://discord.gg/dpYU6TY">Discord</OutsideLink>.
        </Text>
      </AlertDescription>
    </Alert>
  );
};

export default BetaWarningBanner;
