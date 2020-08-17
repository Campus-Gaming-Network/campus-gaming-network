import React from "react";
import { Image } from "@chakra-ui/core";

// TODO: We should show a placeholder image
// if no cover exists and we have a name

const GameCover = React.memo(({ url, name, ...rest }) => {
  if (!url || !name) {
    return null;
  }

  return (
    <Image
      src={`https:${url}`}
      alt={`The cover art for ${name}`}
      rounded="md"
      shadow="md"
      {...rest}
    />
  );
});

export default GameCover;
