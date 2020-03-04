import React from "react";
import { classNames } from "../utilities";

const PageWrapper = ({ className = "", ...props }) => {
  return (
    <article
      {...props}
      className={classNames([
        "max-w-4xl mx-auto my-16 px-8 text-xl",
        className
      ])}
    />
  );
};

export default PageWrapper;
