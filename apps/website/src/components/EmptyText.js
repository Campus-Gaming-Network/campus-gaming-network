// Libraries
import React from "react";
import { Text } from "src/components/common";

////////////////////////////////////////////////////////////////////////////////
// EmptyText

const EmptyText = ({ children, color, ...rest }) => {
  return (
    <Text color="gray.600" fontSize="md" {...rest}>
      {children}
    </Text>
  );
};

export default EmptyText;
