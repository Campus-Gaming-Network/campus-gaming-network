// Libraries
import React from "react";

// Constants
import { IGDB_GAME_URL } from "src/constants/igdb";

// Components
import OutsideLink from "src/components/OutsideLink";

////////////////////////////////////////////////////////////////////////////////
// GameLink

const GameLink = React.memo((props) => {
  if (!props.slug || !props.name) {
    return null;
  }

  return (
    <OutsideLink
      href={`${IGDB_GAME_URL}/${props.slug}`}
      d="inline-block"
      lineHeight="1.2"
      fontWeight="bold"
      color="brand.500"
      fontSize="sm"
      mt={2}
    >
      {props.name}
    </OutsideLink>
  );
});

export default GameLink;
