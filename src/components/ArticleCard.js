// Libraries
import React from "react";
import { Box } from "@chakra-ui/react";

const ArticleCard = ({ children, ...rest }) => {
  return (
    <Box
      as="article"
      py={16}
      px={{ base: 8, sm: 0 }}
      mx="auto"
      fontSize="xl"
      maxW={{ base: "3xl", sm: "100%" }}
      {...rest}
    >
      {children}
    </Box>
  );
};

export default ArticleCard;
