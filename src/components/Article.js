// Libraries
import React from "react";
import { Box } from "@chakra-ui/react";

const Article = ({ children, ...rest }) => {
  return (
    <Box
      as="article"
      py={16}
      px={{ md: 8, sm: 0 }}
      mx="auto"
      fontSize="xl"
      maxW={{ md: "3xl", sm: "100%" }}
      {...rest}
    >
      {children}
    </Box>
  );
};

export default Article;
