import React from "react";
import { classNames } from "./utilities";

const PageSection = ({ className = "", ...props }) => {
    return (
      <section
        {...props}
        className={classNames([
          className.includes("pt-") ? "" : "pt-12",
          className
        ])}
      />
    );
  };

  export default PageSection;