import React from "react";
import { classNames } from "../utilities";
import * as constants from "../constants";

const Button = ({ variant = "", className = "", ...props }) => {
  const defaultClass = `${
    constants.STYLES.BUTTON[
      variant.toUpperCase() || constants.STYLES.BUTTON.DEFAULT
    ]
  } border-2 font-semibold py-2 px-4 rounded-lg ${
    props.disabled ? "opacity-50 cursor-not-allowed" : ""
  }`.trim();

  return (
    <button {...props} className={classNames([defaultClass, className])} />
  );
};

export default Button;
