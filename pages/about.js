// Libraries
import React from "react";
import {
  Stack,
  Text,
  Box,
  Flex,
  Spacer,
  Heading,
  Image,
  Img,
} from "@chakra-ui/react";

// Components
import Article from "src/components/Article";
import Card from "src/components/Card";
import PageHeading from "src/components/PageHeading";
import SiteLayout from "src/components/SiteLayout";

// Constants
import { PRODUCTION_URL } from "src/constants/other";

////////////////////////////////////////////////////////////////////////////////
// About

const About = () => {
  return (
    <SiteLayout
      meta={{ title: "About", og: { url: `${PRODUCTION_URL}/about` } }}
    >
      <Article fullWidthMobile fullWidthDesktop maxW="100%" px={0} py={0}>
        <Flex
          as="section"
          bg="#F15A29"
          h="35vh"
          color="white"
          align="center"
          justify="center"
        >
          <Box maxW="65vw" mx="auto">
            <PageHeading>About Campus Gaming Network</PageHeading>
            <Text fontSize={26}>
              Campus Gaming Network is where current college students, alumni,
              and faculty can come to find and build gaming communities at their
              campus or nearby campuses.
            </Text>
          </Box>
        </Flex>
        <Stack
          mx="auto"
          maxW={{
            base: "100%",
            sm: "xl",
            md: "3xl",
          }}
        >
          <Flex align="center" py={4}>
            <Box p="4">
              <Img src="/campus-illustration.svg" />
            </Box>
            <Box p="4">
              <Heading as="h3">Find your school</Heading>
              <Text>
                Our database has every school in the nation. Find your school,
                meet your classmates, join up for a game.
              </Text>
            </Box>
          </Flex>
          <Flex align="center" py={4}>
            <Box p="4">
              <Heading as="h3">Join events</Heading>
              <Text>
                Creating a community of gamers starts with events. Create events
                at your school and bring together your campus or discover events
                at nearby schools.
              </Text>
            </Box>
            <Box p="4">
              <Img src="/calendar-illustration.svg" />
            </Box>
          </Flex>
          <Flex align="center" py={4}>
            <Box p="4">
              <Img src="/controller-illustration.svg" />
            </Box>
            <Box p="4">
              <Heading as="h3">Play games</Heading>
              <Text>
                Whether you're a casual gamer or competitive gamer, playing with
                others is always better. Campus Gaming Network wants to connect
                gamers of all types.
              </Text>
            </Box>
          </Flex>
        </Stack>
      </Article>
    </SiteLayout>
  );
};

export default About;
