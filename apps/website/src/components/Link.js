// Libraries
import React from "react";
import NextLink from "next/link";
import { Link as ChakraLink, Tooltip } from "src/components/common";

// Components
import ConditionalWrapper from "src/components/ConditionalWrapper";

////////////////////////////////////////////////////////////////////////////////
// Link

const Link = ({ children, href, tooltip, ...rest }) => {
  const TooltipLink = React.forwardRef((props, ref) => {
    return (
      <ConditionalWrapper
        condition={Boolean(tooltip)}
        wrapper={(_children) => <Tooltip label={tooltip}>{_children}</Tooltip>}
      >
        <ChakraLink ref={ref} {...props}>
          {children}
        </ChakraLink>
      </ConditionalWrapper>
    );
  });

  return (
    <NextLink href={href} passHref prefetch={false}>
      <TooltipLink {...rest} />
    </NextLink>
  );
};

export default Link;
