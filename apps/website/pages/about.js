// Libraries
import React from "react";
import { Stack, Text, Box, Flex, Spacer, Heading, Img } from "@chakra-ui/react";

// Constants
import { PRODUCTION_URL } from "src/constants/other";

// Providers
import { useAuth } from "src/providers/auth";

// Components
import Article from "src/components/Article";
import PageHeading from "src/components/PageHeading";
import SiteLayout from "src/components/SiteLayout";
import ButtonLink from "src/components/ButtonLink";

////////////////////////////////////////////////////////////////////////////////
// About

const About = () => {
  const { isAuthenticated } = useAuth();

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
          <Box
            maxW={{
              base: "100%",
              sm: "xl",
              md: "5xl",
            }}
            mx="auto"
          >
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
            md: "5xl",
          }}
        >
          <Flex align="center" py={8}>
            <Box p={4}>
              <Img src="/campus-illustration.svg" pr={8} />
            </Box>
            <Box p={4}>
              <Heading as="h3" pb={2} color="brand.500">
                Find your school
              </Heading>
              <Text fontSize={22}>
                Our database has every school in the nation. Find your school,
                meet your classmates, join up for a game.
              </Text>
            </Box>
            <Spacer />
          </Flex>
          <Flex align="center" py={8}>
            <Box p={4} textAlign="right">
              <Heading as="h3" pb={2} color="brand.500">
                Join events
              </Heading>
              <Text fontSize={22}>
                Creating a community of gamers starts with events. Create events
                at your school and bring together your campus or discover events
                at nearby schools.
              </Text>
            </Box>
            <Box p={4}>
              <Img src="/calendar-illustration.svg" pl={8} />
            </Box>
          </Flex>
          <Flex align="center" py={8}>
            <Box p={4}>
              <Img src="/controller-illustration.svg" pr={8} />
            </Box>
            <Box p={4}>
              <Heading as="h3" pb={2} color="brand.500">
                Play games
              </Heading>
              <Text fontSize={22}>
                Whether you're a casual gamer or competitive gamer, playing with
                others is always better. Campus Gaming Network wants to connect
                gamers of all types.
              </Text>
            </Box>
          </Flex>
          {!isAuthenticated ? (
            <Flex py={20} align="center" justify="center">
              <ButtonLink
                href="/signup"
                colorScheme="brand"
                size="lg"
                h="84px"
                fontSize="4xl"
                px={28}
              >
                Create an account
              </ButtonLink>
            </Flex>
          ) : null}
        </Stack>
      </Article>
    </SiteLayout>
  );
};

export default About;
