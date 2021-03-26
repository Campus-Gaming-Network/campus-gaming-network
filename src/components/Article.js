// Libraries
import React from "react";
import { Box } from "@chakra-ui/react";

const Article = ({
  fullWidthDesktop = false,
  fullWidthMobile = false,
  children,
  ...rest
}) => {
  return (
    <Box
      as="article"
      py={{ base: 6, md: 16 }}
      px={{ base: fullWidthMobile ? 0 : 4, md: 8 }}
      mx="auto"
      fontSize="xl"
      maxW={{
        base: "100%",
        sm: fullWidthDesktop ? "90%" : "xl",
        md: fullWidthDesktop ? "90%" : "3xl",
      }}
      {...rest}
    >
      {children}
    </Box>
  );
};

export default Article;
