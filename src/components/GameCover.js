import React from "react";
import { Image } from "@chakra-ui/core";

// TODO: We should show a placeholder image
// if no cover exists and we have a name

const GameCover = React.memo(props => {
  if (!props.url || !props.name) {
    return null;
  }

  return (
    <Image
      src={`https:${props.url}`}
      alt={`The cover art for ${props.name}`}
      rounded="md"
      shadow="md"
    />
  );
});

export default GameCover;
