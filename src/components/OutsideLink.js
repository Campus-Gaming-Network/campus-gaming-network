import React from "react";
import { classNames } from "./utilities";

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