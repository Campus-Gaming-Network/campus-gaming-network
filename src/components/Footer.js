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
      <Box borderTopWidth={1} bg="white" py={4} textAlign="center">
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
        pt={{ base: 0, md: 8 }}
        pb={8}
        bg="#323031"
        color="gray.300"
      >
        <Flex justifyContent="space-between" flexWrap="wrap">
          <List
            spacing={2}
            flexBasis={{ base: "100%", md: "33.3333%" }}
            minWidth={{ base: "100%", md: "33.3333%" }}
            flexGrow={0}
            pt={{ base: 8, md: 0 }}
          >
            <ListItem
              fontSize="xs"
              fontWeight="bold"
              textTransform="uppercase"
              color="gray.500"
            >
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
            flexBasis={{ base: "100%", md: "33.3333%" }}
            minWidth={{ base: "100%", md: "33.3333%" }}
            flexGrow={0}
            pt={{ base: 8, md: 0 }}
          >
            <ListItem
              fontSize="xs"
              fontWeight="bold"
              textTransform="uppercase"
              color="gray.500"
            >
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
            flexBasis={{ base: "100%", md: "33.3333%" }}
            minWidth={{ base: "100%", md: "33.3333%" }}
            flexGrow={0}
            pt={{ base: 8, md: 0 }}
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
