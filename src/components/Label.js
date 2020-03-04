import React from "react";
import { classNames } from "./utilities";

const Label = ({ className = "", ...props }) => {
    return (
      <label
        {...props}
        className={classNames([constants.STYLES.LABEL.DEFAULT, className])}
      />
    );
  };

  export default Label;
