import React from "react";
import { Box, Heading, Text } from "@chakra-ui/core";

// Hooks
// import useFetchUserEvents from "../hooks/useFetchUserEvents";

const Home = props => {
  // const userId = props.authenticatedUser ? props.authenticatedUser.uid : null;
  // const [attendingEvents] = useFetchUserEvents(userId);

  // console.log("attendingEvents", attendingEvents);

  return (
    <Box as="article" py={16} px={8} mx="auto" maxW="5xl">
      <Box>
        <Heading size="2xl" mb={8}>
          Campus Gaming Network
        </Heading>
        <Text fontSize="3xl" color="gray.60">
          Connect with other collegiate gamers for casual or competitive gaming
          at your school or nearby.
        </Text>
      </Box>
    </Box>
  );
};

export default Home;
