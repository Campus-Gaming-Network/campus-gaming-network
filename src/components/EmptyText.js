// Libraries
import React from "react";
import { Text } from "@chakra-ui/react";

const EmptyText = ({ children, ...rest }) => {
  return (
    <Text color="gray.400" fontSize="xl" fontWeight="600" {...rest}>
      {children}
    </Text>
  );
};

export default EmptyText;
