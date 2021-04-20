// Libraries
import React from "react";
import { Text } from "@chakra-ui/react";

const Time = ({ children, dateTime, ...rest }) => {
  if (!process.browser) {
    return null;
  }

  return (
    <Text as="time" dateTime={dateTime} title={dateTime} {...rest}>
      {children}
    </Text>
  );
};

export default Time;
