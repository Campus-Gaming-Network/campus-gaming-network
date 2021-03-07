// Libraries
import React from "react";
import { Box } from "@chakra-ui/react";

const ArticleCardBody = ({ children, ...rest }) => {
  return (
    <Box
      borderWidth={1}
      boxShadow="lg"
      rounded={{ base: "lg", sm: "none" }}
      bg="white"
      p={6}
      {...rest}
    >
      {children}
    </Box>
  );
};

export default ArticleCardBody;
