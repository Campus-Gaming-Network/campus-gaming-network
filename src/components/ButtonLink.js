import React from "react";
import NextLink from "next/link";
import { Link, Button } from "@chakra-ui/react";

const ButtonLink = ({ children, href, ...rest }) => (
  <NextLink href={href}>
    <Button as={Link} {...rest}>
      {children}
    </Button>
  </NextLink>
);

export default ButtonLink;
