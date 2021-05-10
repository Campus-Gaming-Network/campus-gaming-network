// Libraries
import React from "react";
import NextLink from "next/link";
import { Link as ChakraLink } from "@chakra-ui/react";

////////////////////////////////////////////////////////////////////////////////
// Link

const Link = ({ children, href, ...rest }) => (
  <NextLink href={href} passHref>
    <ChakraLink {...rest}>{children}</ChakraLink>
  </NextLink>
);

export default Link;
