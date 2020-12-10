import React from "react";
import { Heading, Image, VisuallyHidden } from "@chakra-ui/react";

// Components
import Link from "./Link";

import logo from "../logo.svg";

const Logo = ({ src, ...rest }) => {
  return (
    <Link to="/">
      <VisuallyHidden>
        <Heading as="h1" size="lg">
          Campus Gaming Network
        </Heading>
      </VisuallyHidden>
      <Image src={logo} alt="CGN Home" {...rest} />
    </Link>
  );
};

export default Logo;
