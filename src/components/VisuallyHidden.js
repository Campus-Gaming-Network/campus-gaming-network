import React from "react";
import { classNames } from "./utilities";

const VisuallyHidden = ({ className = "", as = "span", ...props }) => {
    const CustomTag = `${as}`;
  
    return (
      <CustomTag
        {...props}
        className={classNames(["visually-hidden", className])}
      />
    );
  };

  export default VisuallyHidden;