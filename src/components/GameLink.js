import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import { Text } from "@chakra-ui/react";

// Constants
import { IGDB_GAME_URL } from "src/constants/igdb";

// Components
import OutsideLink from "src/components/OutsideLink";

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
      color="brand.500"
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
