// Libraries
import React from "react";
import { Text } from "@chakra-ui/react";

////////////////////////////////////////////////////////////////////////////////
// CharacterCounter

const CharacterCounter = (props) => {
  const charactersRemaining = React.useMemo(
    () =>
      props.value ? props.maxLength - props.value.length : props.maxLength,
    [props.value]
  );

  return (
    <Text as="span" color={charactersRemaining <= 0 ? "red.500" : undefined}>
      {charactersRemaining.toLocaleString()} characters remaining.
    </Text>
  );
};

export default CharacterCounter;
