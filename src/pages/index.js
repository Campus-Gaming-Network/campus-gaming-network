import React from "react";
import { Box } from "@chakra-ui/core";

const Home = () => {
  return (
    <Box as="article" my={16} px={8} mx="auto" fontSize="xl" maxW="4xl">
      <Box>
        <h1 className="text-logo text-6xl mb-8 leading-none">
          Campus Gaming Network
        </h1>
        <h2 className="text-3xl leading-tight text-gray-600">
          Connect with other collegiate gamers for casual or competitive gaming
          at your school or nearby.
        </h2>
      </Box>
    </Box>
  );
};

export default Home;
