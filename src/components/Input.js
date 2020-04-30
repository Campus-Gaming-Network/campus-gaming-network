import React from "react";
import { classNames } from "../utilities";
import * as constants from "../constants";

const Input = ({ error, className = "", ...props }) => {
  return (
    <input
      {...props}
      className={classNames([
        constants.STYLES.INPUT[error ? "ERROR" : "DEFAULT"],
        className
      ])}
    />
  );
};

export default Input;