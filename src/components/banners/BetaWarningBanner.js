import React from "react";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Text
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";

// Components
import OutsideLink from "src/components/OutsideLink";

const BetaWarningBanner = () => {
  return (
    <Alert status="warning" justifyContent="center">
      <AlertIcon />
      <AlertTitle mr={2} textTransform="uppercase">
        Beta
      </AlertTitle>
      <AlertDescription>
        <Text>
          Site is currently in{" "}
          <Text as="span" fontWeight="bold">
            beta
          </Text>
          , there will be bugs. Please report any in our{" "}
          <OutsideLink href="https://discord.gg/dpYU6TY">
            Discord
            <Text as="span" ml={1}>
              <FontAwesomeIcon icon={faExternalLinkAlt} size="xs" />
            </Text>
          </OutsideLink>
          .
        </Text>
      </AlertDescription>
    </Alert>
  );
};

export default BetaWarningBanner;
