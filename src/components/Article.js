// Libraries
import React from "react";
import { Box } from "@chakra-ui/react";

const Article = ({ children, ...rest }) => {
  return (
    <Box
      as="article"
      py={16}
      px={{ base: 0, md: 8 }}
      mx="auto"
      fontSize="xl"
      maxW={{ base: "100%", md: "3xl" }}
      {...rest}
    >
      {children}
    </Box>
  );
};

export default Article;
