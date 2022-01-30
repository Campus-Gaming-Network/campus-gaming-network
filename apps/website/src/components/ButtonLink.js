// Libraries
import React from "react";
import NextLink from "next/link";
import { Link, Button } from "src/components/common";

////////////////////////////////////////////////////////////////////////////////
// ButtonLink

const ButtonLink = ({ children, disabled, href, ...rest }) => (
  <NextLink href={disabled ? "#" : href} passHref>
    <Button as={Link} disabled={disabled} {...rest}>
      {children}
    </Button>
  </NextLink>
);

export default ButtonLink;
