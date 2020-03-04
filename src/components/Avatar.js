import React from "react";
import { classNames } from "./utilities";
import Flex from "./Flex";

const Avatar = ({
    size = "md",
    rounded = false,
    alt = "",
    className = "",
    ...props
  }) => {
    let defaultClass = "bg-gray-400";
  
    if (rounded) {
      defaultClass += " rounded-full";
    }
  
    const sizes = {
      sm: "h-10 w-10",
      md: "h-20 w-20",
      lg: "h-40 w-40"
    };
  
    defaultClass += ` ${sizes[size]}`;
  
    if (props.children) {
      return (
        <Flex
          itemsCenter
          justifyCenter
          className={classNames([defaultClass, className])}
          {...props}
        />
      );
    }
  
    // eslint-disable-next-line
    return <img {...props} className={classNames([defaultClass, className])} />;
  };

  export default Avatar;
