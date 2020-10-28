import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import { Text } from "@chakra-ui/core";

// Components
import OutsideLink from "components/OutsideLink";

// TODO: Move to its own constants file
const IGDB_GAME_URL = "https://www.igdb.com/games";

const GameLink = React.memo(props => {
  if (!props.slug || !props.name) {
    return null;
  }

  return (
    <OutsideLink
      href={`${IGDB_GAME_URL}/${props.slug}`}
      d="inline-block"
      lineHeight="1.2"
      fontWeight="bold"
      color="purple.500"
      fontSize="sm"
      mt={2}
    >
      {props.name}
      <Text as="span" ml={1}>
        <FontAwesomeIcon icon={faExternalLinkAlt} size="xs" />
      </Text>
    </OutsideLink>
  );
});

export default GameLink;
