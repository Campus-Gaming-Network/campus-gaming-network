// Libraries
import React from "react";
import { Img, Heading, VisuallyHidden } from "src/components/common";

// Components
import Link from "src/components/Link";

////////////////////////////////////////////////////////////////////////////////
// Logo

const Logo = ({ src, ...rest }) => {
  return (
    <Link href="/">
      <VisuallyHidden>
        <Heading as="h1" size="lg">
          Campus Gaming Network
        </Heading>
      </VisuallyHidden>
      <Img
        src="/logo.svg"
        alt="Campus Gaming Network"
        title="Campus Gaming Network"
        {...rest}
      />
    </Link>
  );
};

export default Logo;
