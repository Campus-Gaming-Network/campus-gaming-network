// Libraries
import React from "react";
import {
  Box,
  Link as ChakraLink,
  List,
  ListItem,
  Text,
  Flex,
} from "src/components/common";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faMugHot } from "@fortawesome/free-solid-svg-icons";

// Components
import Link from "src/components/Link";
import OutsideLink from "src/components/OutsideLink";

// Constants
import {
  DISCORD_LINK,
  GITHUB_LINK,
  FACEBOOK_LINK,
  TWITTER_LINK,
  INSTAGRAM_LINK,
  BUY_ME_A_COFFEE_LINK,
  SUPPORT_EMAIL,
} from "src/constants/other";

////////////////////////////////////////////////////////////////////////////////
// Footer

const Footer = () => {
  return (
    <React.Fragment>
      <Box borderTopWidth={1} bg="white" py={4} textAlign="center">
        <Text fontSize="lg">
          Enjoying the site?{" "}
          <OutsideLink href={BUY_ME_A_COFFEE_LINK}>
            Buy me a coffee.
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
            <ListItem fontSize="md">
              <Link href="/about">About</Link>
            </ListItem>
            <ListItem fontSize="md">
              <Link href="/frequently-asked-questions">
                <Text as="abbr" title="Frequently asked questions">
                  FAQ
                </Text>
              </Link>
            </ListItem>
            <ListItem fontSize="md">
              <ChakraLink href={`mailto:${SUPPORT_EMAIL}`}>Email us</ChakraLink>
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
            <ListItem fontSize="md">
              Join our <OutsideLink href={DISCORD_LINK}>Discord</OutsideLink>
            </ListItem>
            <ListItem fontSize="md">
              Contribute on <OutsideLink href={GITHUB_LINK}>GitHub</OutsideLink>
            </ListItem>
            <ListItem fontSize="md">
              Like on <OutsideLink href={FACEBOOK_LINK}>Facebook</OutsideLink>{" "}
              and <OutsideLink href={INSTAGRAM_LINK}>Instagram</OutsideLink>
            </ListItem>
            <ListItem fontSize="md">
              Follow on <OutsideLink href={TWITTER_LINK}>Twitter</OutsideLink>
            </ListItem>
          </List>
          <List
            spacing={2}
            flexBasis={{ base: "100%", md: "33.3333%" }}
            minWidth={{ base: "100%", md: "33.3333%" }}
            flexGrow={0}
            pt={{ base: 8, md: 0 }}
          >
            <ListItem fontSize="md">
              Made with{" "}
              <Text d="inline" color="red.500">
                <FontAwesomeIcon icon={faHeart} />
              </Text>{" "}
              and{" "}
              <Text d="inline" color="white">
                <FontAwesomeIcon icon={faMugHot} />
              </Text>{" "}
              in <Text d="inline">Salt Lake City, Utah</Text>
            </ListItem>
          </List>
        </Flex>
      </Box>
    </React.Fragment>
  );
};

export default Footer;
