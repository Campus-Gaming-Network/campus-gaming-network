import React from "react";
import Link from "next/link";
import { Link as ChakraLink } from "@chakra-ui/react";

const CustomLink = ({ children, ...rest }) => (
  <ChakraLink as={Link} {...rest}>
    <a>{children}</a>
  </ChakraLink>
);

export default CustomLink;
