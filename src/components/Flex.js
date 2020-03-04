import React from "react";
import { classNames } from "./utilities";

const Flex = ({
    tag = "div",
    direction = "row",
    className = "",
    itemsCenter,
    itemsEnd,
    itemsBaseline,
    itemsStart,
    itemsStretch,
    justifyAround,
    justifyCenter,
    justifyBetween,
    justifyStart,
    justifyEnd,
    wrap,
    noWrap,
    wrapReverse,
    ...props
  }) => {
    const CustomTag = `${tag}`;
  
    return (
      <CustomTag
        {...props}
        className={classNames([
          "flex",
          direction === "row" ? "flex-row" : "",
          direction === "row-reverse" ? "flex-row-reverse" : "",
          direction === "col" ? "flex-col" : "",
          direction === "col-reverse" ? "flex-col-reverse" : "",
          itemsCenter ? "items-center" : "",
          itemsEnd ? "items-end" : "",
          itemsBaseline ? "items-baseline" : "",
          itemsStart ? "items-start" : "",
          itemsStretch ? "items-stretch" : "",
          justifyCenter ? "justify-center" : "",
          justifyEnd ? "justify-end" : "",
          justifyBetween ? "justify-between" : "",
          justifyStart ? "justify-start" : "",
          justifyAround ? "justify-around" : "",
          noWrap ? "flex-no-wrap" : "",
          wrap ? "flex-wrap" : "",
          wrapReverse ? "flex-wrap-reverse" : "",
          className
        ])}
      />
    );
  };

  export default Flex;
