import React from "react";
import { Heading, Image, VisuallyHidden } from "@chakra-ui/react";

// Components
import Link from "src/components/Link";

const Logo = ({ src, ...rest }) => {
  return (
    <Link href="/">
      <VisuallyHidden>
        <Heading as="h1" size="lg">
          Campus Gaming Network
        </Heading>
      </VisuallyHidden>
      <Image
        src="/logo.svg"
        alt="Campus Gaming Network Home"
        title="Campus Gaming Network Home"
        {...rest}
      />
    </Link>
  );
};

export default Logo;
