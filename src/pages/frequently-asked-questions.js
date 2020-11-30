// Libraries
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
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";

// Components
import OutsideLink from "components/OutsideLink";

////////////////////////////////////////////////////////////////////////////////
// FrequentlyAskedQuestions

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
            <BuyMeACoffeeLink />. If you like what we do and want to donate to
            help with development costs, you can visit our{" "}
            <BuyMeACoffeeLink page="cgnbrandon">
              Buy Me a Coffee page
            </BuyMeACoffeeLink>
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
            Your profile picture is managed by <GravatarLink /> . It is linked
            to your email address or your last known IP address. If you do not
            have a <GravatarLink /> account tied to your email you are given a
            default randomized profile picture.
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
            To change your profile picture, you need to make a <GravatarLink />{" "}
            account with the same email address you used to sign up for Campus
            Gaming Network. Once you have created a <GravatarLink /> account you
            can upload a profile picture there and it will automatically be used
            on Campus Gaming Network and any other website that uses the{" "}
            <GravatarLink /> service.
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <AccordionHeader>
            <Box flex="1" textAlign="left" fontWeight="bold">
              Will you allow uploading of profile pictures without{" "}
              <GravatarLink />?
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
            Our list of games comes from the <IGDBLink />
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
              color="orange.500"
              fontWeight={600}
            >
              support@campusgamingnetwork.com
            </ChakraLink>
            , join our <DiscordLink />, or open an issue on our <GithubLink />.
            We will try to reach back and look into the issue as soon as we can.
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

////////////////////////////////////////////////////////////////////////////////
// ExternalLink

const ExternalLink = props => {
  return (
    <OutsideLink href={props.href}>
      {props.children}
      <Text as="span" ml={1}>
        <FontAwesomeIcon icon={faExternalLinkAlt} size="xs" />
      </Text>
    </OutsideLink>
  );
};

////////////////////////////////////////////////////////////////////////////////
// VerifyEmail=
const IGDBLink = props => {
  return (
    <ExternalLink href="https://www.igdb.com/discover">
      {props.children ? props.children : "Internet Games Database (IGDB)"}
    </ExternalLink>
  );
};

////////////////////////////////////////////////////////////////////////////////
// GithubLink

const GithubLink = props => {
  return (
    <ExternalLink href="https://github.com/bsansone/campus-gaming-network">
      {props.children ? props.children : "GitHub"}
    </ExternalLink>
  );
};

////////////////////////////////////////////////////////////////////////////////
// DiscordLink

const DiscordLink = props => {
  return (
    <ExternalLink href="https://discord.gg/dpYU6TY">
      {props.children ? props.children : "Discord"}
    </ExternalLink>
  );
};

////////////////////////////////////////////////////////////////////////////////
// GravatarLink

const GravatarLink = props => {
  return (
    <ExternalLink href="https://en.gravatar.com/">
      {props.children ? props.children : "Gravatar"}
    </ExternalLink>
  );
};

////////////////////////////////////////////////////////////////////////////////
// BuyMeACoffeeLink

const BuyMeACoffeeLink = props => {
  const href = `https://www.buymeacoffee.com/${
    props.page ? props.page : ""
  }`.trim();

  return (
    <ExternalLink href={href}>
      {props.children ? props.children : "Buy Me a Coffee"}
    </ExternalLink>
  );
};

export default FrequentlyAskedQuestions;
