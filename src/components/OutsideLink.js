import React from "react";
import { Link as ChakraLink } from "@chakra-ui/core";
import { classNames } from "../utilities";
import * as constants from "../constants";

const OutsideLink = ({ className = "", ...props }) => {
  return (
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    <ChakraLink
      {...props}
      className={classNames([constants.STYLES.LINK.DEFAULT, className])}
      isExternal
    />
  );
};

export default OutsideLink;
