// Libraries
import React from "react";
import {
  Box,
  Link as ChakraLink,
  List,
  ListItem,
  Text,
  Flex
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faMugHot,
  faExternalLinkAlt
} from "@fortawesome/free-solid-svg-icons";

// Components
import Link from "./Link";
import OutsideLink from "./OutsideLink";

const Footer = () => {
  return (
    <Box
      as="footer"
      borderTopWidth={1}
      textAlign="center"
      pt={{ md: 8, sm: 0 }}
      pb={8}
    >
      <Flex justifyContent="space-between" flexWrap="wrap">
        <List
          spacing={2}
          flexBasis={{ md: "33.3333%", sm: "100%" }}
          minWidth={{ md: "33.3333%", sm: "100%" }}
          flexGrow={0}
          pt={{ md: 0, sm: 8 }}
        >
          <ListItem fontSize="xs" fontWeight="bold" textTransform="uppercase">
            Resources
          </ListItem>
          <ListItem fontSize="sm">
            <Link to="/about-us" color="orange.500" fontWeight={600}>
              About us
            </Link>
          </ListItem>
          <ListItem fontSize="sm">
            <Link
              to="/frequently-asked-questions"
              color="orange.500"
              fontWeight={600}
            >
              <Text as="abbr" title="Frequently asked questions">
                FAQ
              </Text>
            </Link>
          </ListItem>
          <ListItem fontSize="sm">
            <ChakraLink
              href="mailto:support@campusgamingnetwork.com"
              color="orange.500"
              fontWeight={600}
            >
              Email us
            </ChakraLink>
          </ListItem>
        </List>
        <List
          spacing={2}
          flexBasis={{ md: "33.3333%", sm: "100%" }}
          minWidth={{ md: "33.3333%", sm: "100%" }}
          flexGrow={0}
          pt={{ md: 0, sm: 8 }}
        >
          <ListItem fontSize="xs" fontWeight="bold" textTransform="uppercase">
            Community
          </ListItem>
          <ListItem fontSize="sm">
            Join our{" "}
            <OutsideLink href="https://discord.gg/dpYU6TY">
              Discord
              <Text as="span" ml={1}>
                <FontAwesomeIcon icon={faExternalLinkAlt} size="xs" />
              </Text>
            </OutsideLink>
          </ListItem>
          <ListItem fontSize="sm">
            Contribute on{" "}
            <OutsideLink href="https://github.com/bsansone/campus-gaming-network">
              GitHub
              <Text as="span" ml={1}>
                <FontAwesomeIcon icon={faExternalLinkAlt} size="xs" />
              </Text>
            </OutsideLink>
          </ListItem>
        </List>
        <List
          spacing={2}
          flexBasis={{ md: "33.3333%", sm: "100%" }}
          minWidth={{ md: "33.3333%", sm: "100%" }}
          flexGrow={0}
          pt={{ md: 0, sm: 8 }}
        >
          <ListItem fontSize="sm">
            Made with{" "}
            <Text d="inline" color="red.500">
              <FontAwesomeIcon icon={faHeart} />
            </Text>{" "}
            and <FontAwesomeIcon icon={faMugHot} /> in{" "}
            <Text d="inline" fontWeight={600}>
              Salt Lake City, Utah
            </Text>
          </ListItem>
          <ListItem fontSize="sm">
            Enjoying the site?{" "}
            <OutsideLink href="https://www.buymeacoffee.com/cgnbrandon">
              Buy me a coffee.
              <Text as="span" ml={1}>
                <FontAwesomeIcon icon={faExternalLinkAlt} size="xs" />
              </Text>
            </OutsideLink>
          </ListItem>
        </List>
      </Flex>
    </Box>
  );
};

export default Footer;
