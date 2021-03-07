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
import Link from "src/components/Link";
import OutsideLink from "src/components/OutsideLink";

const Footer = () => {
  return (
    <React.Fragment>
      <Box borderTopWidth={1} bg="gray.100" py={4} textAlign="center">
        <Text fontSize="lg">
          Enjoying the site?{" "}
          <OutsideLink href="https://www.buymeacoffee.com/cgnbrandon">
            Buy me a coffee.
            <Text as="span" ml={1}>
              <FontAwesomeIcon icon={faExternalLinkAlt} size="xs" />
            </Text>
          </OutsideLink>
        </Text>
      </Box>
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
            flexBasis={{ base: "33.3333%", sm: "100%" }}
            minWidth={{ base: "33.3333%", sm: "100%" }}
            flexGrow={0}
            pt={{ base: 0, sm: 8 }}
          >
            <ListItem fontSize="xs" fontWeight="bold" textTransform="uppercase">
              Resources
            </ListItem>
            <ListItem fontSize="sm">
              <Link href="/about">About</Link>
            </ListItem>
            <ListItem fontSize="sm">
              <Link href="/frequently-asked-questions">
                <Text as="abbr" title="Frequently asked questions">
                  FAQ
                </Text>
              </Link>
            </ListItem>
            <ListItem fontSize="sm">
              <ChakraLink href="mailto:support@campusgamingnetwork.com">
                Email us
              </ChakraLink>
            </ListItem>
          </List>
          <List
            spacing={2}
            flexBasis={{ base: "33.3333%", sm: "100%" }}
            minWidth={{ base: "33.3333%", sm: "100%" }}
            flexGrow={0}
            pt={{ base: 0, sm: 8 }}
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
            flexBasis={{ base: "33.3333%", sm: "100%" }}
            minWidth={{ base: "33.3333%", sm: "100%" }}
            flexGrow={0}
            pt={{ base: 0, sm: 8 }}
          >
            <ListItem fontSize="sm">
              Made with{" "}
              <Text d="inline" color="red.500">
                <FontAwesomeIcon icon={faHeart} />
              </Text>{" "}
              and <FontAwesomeIcon icon={faMugHot} /> in{" "}
              <Text d="inline">Salt Lake City, Utah</Text>
            </ListItem>
          </List>
        </Flex>
      </Box>
    </React.Fragment>
  );
};

export default Footer;
