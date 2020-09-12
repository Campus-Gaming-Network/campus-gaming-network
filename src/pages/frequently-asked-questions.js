import React from "react";
import {
  Box,
  Heading,
  Text,
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionPanel,
  AccordionIcon,
  Link as ChakraLink
} from "@chakra-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faMugHot,
  faExternalLinkAlt
} from "@fortawesome/free-solid-svg-icons";

import OutsideLink from "../components/OutsideLink";

const FrequentlyAskedQuestions = () => {
  return (
    <Box as="article" py={16} px={8} mx="auto" fontSize="xl" maxW="3xl">
      <Heading as="h1" size="2xl" pb={12}>
        Frequently Asked Questions
      </Heading>
      <Accordion defaultIndex={[]} allowMultiple>
        <AccordionItem>
          <AccordionHeader>
            <Box flex="1" textAlign="left" fontWeight="bold">
              Does Campus Gaming Network cost anything to use?
            </Box>
            <AccordionIcon />
          </AccordionHeader>
          <AccordionPanel pb={4}>
            No, it is completely free to use.
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <AccordionHeader>
            <Box flex="1" textAlign="left" fontWeight="bold">
              How does Campus Gaming Network make money?
            </Box>
            <AccordionIcon />
          </AccordionHeader>
          <AccordionPanel pb={4}>
            We make money by donations from our users through a service called{" "}
            <OutsideLink href="https://www.buymeacoffee.com/">
              Buy Me a Coffee
              <Text as="span" ml={1}>
                <FontAwesomeIcon icon={faExternalLinkAlt} size="xs" />
              </Text>
            </OutsideLink>
            . If you like what we do and want to donate to help with development
            costs, you can visit our{" "}
            <OutsideLink href="https://www.buymeacoffee.com/cgnbrandon">
              Buy Me a Coffee page
              <Text as="span" ml={1}>
                <FontAwesomeIcon icon={faExternalLinkAlt} size="xs" />
              </Text>
            </OutsideLink>
            .
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <AccordionHeader>
            <Box flex="1" textAlign="left" fontWeight="bold">
              Where does my profile picture come from?
            </Box>
            <AccordionIcon />
          </AccordionHeader>
          <AccordionPanel pb={4}>
            Your profile picture is managed by{" "}
            <OutsideLink href="https://en.gravatar.com/">
              Gravatar
              <Text as="span" ml={1}>
                <FontAwesomeIcon icon={faExternalLinkAlt} size="xs" />
              </Text>
            </OutsideLink>
            . It is linked to your email address or your last known IP address.
            If you do not have a{" "}
            <OutsideLink href="https://en.gravatar.com/">
              Gravatar
              <Text as="span" ml={1}>
                <FontAwesomeIcon icon={faExternalLinkAlt} size="xs" />
              </Text>
            </OutsideLink>{" "}
            account tied to your email you are given a default randomized
            profile picture.
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <AccordionHeader>
            <Box flex="1" textAlign="left" fontWeight="bold">
              How do I change my profile picture?
            </Box>
            <AccordionIcon />
          </AccordionHeader>
          <AccordionPanel pb={4}>
            To change your profile picture, you need to make a{" "}
            <OutsideLink href="https://en.gravatar.com/">
              Gravatar
              <Text as="span" ml={1}>
                <FontAwesomeIcon icon={faExternalLinkAlt} size="xs" />
              </Text>
            </OutsideLink>{" "}
            account with the same email address you used to sign up for Campus
            Gaming Network. Once you have created a{" "}
            <OutsideLink href="https://en.gravatar.com/">
              Gravatar
              <Text as="span" ml={1}>
                <FontAwesomeIcon icon={faExternalLinkAlt} size="xs" />
              </Text>
            </OutsideLink>{" "}
            account you can upload a profile picture there and it will
            automatically be used on Campus Gaming Network and any other website
            that uses the{" "}
            <OutsideLink href="https://en.gravatar.com/">
              Gravatar
              <Text as="span" ml={1}>
                <FontAwesomeIcon icon={faExternalLinkAlt} size="xs" />
              </Text>
            </OutsideLink>{" "}
            service.
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <AccordionHeader>
            <Box flex="1" textAlign="left" fontWeight="bold">
              Will you allow uploading of profile pictures without{" "}
              <OutsideLink href="https://en.gravatar.com/">
                Gravatar
                <Text as="span" ml={1}>
                  <FontAwesomeIcon icon={faExternalLinkAlt} size="xs" />
                </Text>
              </OutsideLink>
              ?
            </Box>
            <AccordionIcon />
          </AccordionHeader>
          <AccordionPanel pb={4}>
            Maybe sometime in the future, but for right now, to keep costs down
            we are taking advantage of their service.
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <AccordionHeader>
            <Box flex="1" textAlign="left" fontWeight="bold">
              Where does the list of games come from?
            </Box>
            <AccordionIcon />
          </AccordionHeader>
          <AccordionPanel pb={4}>
            Our list of games comes from the{" "}
            <OutsideLink href="https://www.igdb.com/discover">
              Internet Games Database (IGDB)
              <Text as="span" ml={1}>
                <FontAwesomeIcon icon={faExternalLinkAlt} size="xs" />
              </Text>
            </OutsideLink>
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <AccordionHeader>
            <Box flex="1" textAlign="left" fontWeight="bold">
              I can't find a certain game, what gives?
            </Box>
            <AccordionIcon />
          </AccordionHeader>
          <AccordionPanel pb={4}>
            You would need to take that up with the{" "}
            <OutsideLink href="https://www.igdb.com/discover">
              Internet Games Database (IGDB)
              <Text as="span" ml={1}>
                <FontAwesomeIcon icon={faExternalLinkAlt} size="xs" />
              </Text>
            </OutsideLink>
            , we have no control over that.
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <AccordionHeader>
            <Box flex="1" textAlign="left" fontWeight="bold">
              Is there a mobile app?
            </Box>
            <AccordionIcon />
          </AccordionHeader>
          <AccordionPanel pb={4}>
            Not currently, but we plan to develop a native mobile app for both
            iOS and Android in the future.
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <AccordionHeader>
            <Box flex="1" textAlign="left" fontWeight="bold">
              What happens if something on the site doesn't work as expected?
            </Box>
            <AccordionIcon />
          </AccordionHeader>
          <AccordionPanel pb={4}>
            You can email us at{" "}
            <ChakraLink
              href="mailto:support@campusgamingnetwork.com"
              color="purple.500"
              fontWeight={600}
            >
              support@campusgamingnetwork.com
            </ChakraLink>
            , join our{" "}
            <OutsideLink href="https://discord.gg/dpYU6TY">
              Discord
              <Text as="span" ml={1}>
                <FontAwesomeIcon icon={faExternalLinkAlt} size="xs" />
              </Text>
            </OutsideLink>
            , or open an issue on our{" "}
            <OutsideLink href="https://github.com/bsansone/campus-gaming-network">
              GitHub
              <Text as="span" ml={1}>
                <FontAwesomeIcon icon={faExternalLinkAlt} size="xs" />
              </Text>
            </OutsideLink>
            . We will try to reach back and look into the issue as soon as we
            can.
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <AccordionHeader>
            <Box flex="1" textAlign="left" fontWeight="bold">
              Who are you?
            </Box>
            <AccordionIcon />
          </AccordionHeader>
          <AccordionPanel pb={4}>
            An avid gamer, software developer, living in Salt Lake City, who
            wants to see more people connected through video games.
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Box>
  );
};

export default FrequentlyAskedQuestions;
